+++
date = '2024-12-06'
title = 'CS338 music app: seven things that bit me'
tags = ["PostgreSQL", "Node.js", "Express", "Database"]
+++

A group project for CS338: a music app. HTML and Bootstrap on the front end, Node + Express + EJS on the back end, PostgreSQL 15 running locally. The data came out of a `production.xlsx` and landed in the database as just over a thousand tracks.

The feature list sounds trivial — register, log in, reset a password, search tracks, rate them, browse a Top 10 by genre and language, keep playlists. What I actually learned is that almost none of the bugs were in the features. They were in the schema and in the state.

## Architecture

```text
   production.xlsx / sample.xlsx          (1000+ tracks)
            |
            |  script.py   pandas: one sheet -> one csv
            v
   csv files  ->  pgAdmin IMPORT
            |
            v
   ============================================================
     PostgreSQL 15   localhost:5432
       users / artists / albums / tracks
       playlists / playlistTracks
       TrackSearch / UserGallery   <- CREATE TABLE AS (snapshot)
   ============================================================
            |
            |  pg.Pool  +  parameterised query  ($1, $2, ...)
            v
   ============================================================
     Express   index.js   :3000
       18 hand-written POST routes  ->  SQL  ->  EJS
   ============================================================
            |
            |  form POST (urlencoded)
            v
   ============================================================
     Browser   index.html / register.html / user.ejs
   ============================================================
```

## 1. The import, and a landmine I planted while solving it

pgAdmin's Import only eats CSV, not xlsx, so I wrote a script to split every sheet into its own CSV, using the sheet name as the table name:

```python
def xlsx_to_csv(xlsx_path, output_dir):
    xls = pd.ExcelFile(xlsx_path)
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name)
        df.to_csv(f"{output_dir}/{sheet_name}.csv", index=False)
```

What I regret is the next step: I made every column `varchar(45)`, including `Rating`, `Duration` and `ReleaseDate`. My reasoning was "it all comes out of Excel as text anyway". The cost showed up later — I could not sort by release date, and every comparison involving a rating needed an explicit `::DECIMAL`.

## 2. My "average rating" was never an average

Rating a track looked simple: the user submits a score, update `tracks.Rating`.

```sql
UPDATE tracks SET Rating = DIV((SELECT (SELECT Rating FROM tracks WHERE TrackTitle=$1)::DECIMAL + $2), 2)
WHERE TrackTitle=$3;
```

`DIV` is integer division, so that line computes `floor((old + new) / 2)`.

It ran. The test passed. But it means a track could be rated a hundred times and only the last two ratings would survive — because there is nowhere in the schema to store "user X rated track Y with score Z". `tracks.Rating` is a single cell and the history is gone.

This is the decision I regret most. The right design is a `ratings(UserID, TrackID, Score)` table with `tracks.Rating` kept only as a cache, computing `AVG(Score)` on read. I understood that after the code was finished.

## 3. Check-then-insert has a race, and INSERT returns no rows

Registration started as two steps: `SELECT` to see whether the username or email was taken, then `INSERT` if not. Two simultaneous requests leave a window where both `SELECT`s see "not taken".

I collapsed it into one statement:

```sql
INSERT INTO users(UserID, UserName, Email, UserPassword, SecurityQuestion, SecurityAnswer)
SELECT $1, $2, $3, $4, $5, $6
WHERE NOT EXISTS(SELECT * FROM users WHERE UserName=$7 OR Email=$8);
```

On the way I hit something that confused me for a while: `result.rows[0]` is always `undefined` after that statement. INSERT returns no rows, so my `console.log` printed nothing and I assumed the insert had failed. To see how many rows went in you read `result.rowCount`.

## 4. PostgreSQL folds identifiers to lowercase

In `tables.sql` I wrote `UserPassword` and `UserName`. PostgreSQL folds unquoted identifiers to lowercase, so the column that comes back is actually `userpassword`:

```js
if (result.rows[0] != undefined && result.rows[0]["userpassword"] == password) { ... }
```

Writing `result.rows[0].UserPassword` gives you `undefined`, the comparison is never true, and the symptom is "the password is right but login keeps failing". That one cost me an afternoon.

## 5. Using req.app.locals as a session

To avoid pulling in `express-session`, I stashed the current user in `req.app.locals`:

```js
req.app.locals.username = username;
```

`app.locals` is shared by the whole application instance, not per request. Two people logging in at the same time means the second request overwrites the first. During the demo only one person was ever using it, so it looked fine — and I had told myself "there is only one user anyway".

## 6. Eight Top 10 routes, produced by copy-paste

Top 10 by genre had eight entry points — pop, rap, rock, latin, r&b, edm, english, spanish — identical except for the `WHERE` clause. So I copied it eight times: eight routes and eight `.ejs` templates.

The bill arrived quickly:

- `/latin` rendered `rock.ejs`. The data was Latin, the template was the rock one. The two templates look almost identical, so it was invisible by eye.
- `/rate` ended at `client.release()` with **no response**. Clicking "Rate" left the browser spinning forever. The tests missed it because they tested the SQL (`UPDATE 1`), not the browser.
- I put `pool.on('error', ...)` inside every route handler. Each request registers another listener that is never removed, and its callback is `process.exit(-1)` — so one error on an idle connection takes the whole server down. It belongs at the top of the file, once.

## 7. Snapshot tables from CREATE TABLE AS

Searching needed a three-way join across tracks, artists and albums; the user gallery needed four. To save effort I materialised the result with `CREATE TABLE AS`:

```sql
CREATE TABLE TrackSearch AS
(SELECT tracks.TrackTitle, artists.ArtistName, albums.AlbumTitle, albums.ReleaseDate, albums.Genre
 FROM tracks
 JOIN artists ON artists.ArtistID = tracks.ArtistID
 JOIN albums  ON albums.AlbumID  = tracks.AlbumID);
```

It is a one-shot snapshot. It gets built once after the import and never moves again, so after you rate a track, search still returns the old row.

Worse is `/addtracks`, where I implemented "add to playlist" as an INSERT straight into `UserGallery`:

```sql
INSERT INTO UserGallery(TrackTitle, Name, UserName) VALUES($1, $2, $3)
```

`UserGallery` is itself a snapshot of a four-way join, not a source of truth. Writing into a copy leaves the real tables completely unaware. It "worked" only because the read path used the same copy.

## The tests we added

Once we realised the browser was untested, we wrote cases instead: twelve against the production dataset covering the register, login, search, rating, genre-filter and Top 10 requirements (R6 to R11), and nine against the sample dataset mostly to confirm the imported data itself was right. The SQL and the expected result sit together:

```sql
-- Test2: the email already exists, so this insert must fail
INSERT INTO users (UserID, UserName, Email, UserPassword, SecurityQuestion, SecurityAnswer)
SELECT 'US302', 'test2', 'test2@gmail.com', 'test2', 'test2 question', 'test2 answer'
WHERE NOT EXISTS(SELECT * FROM users WHERE UserName='test2' OR Email='test@gmail.com');
```

The insert that should succeed and the one that should fail came back as `INSERT 0 1` and `INSERT 0 0` — exactly the proof that the uniqueness check works. We saved each run's output as a `.out` file and kept screenshots alongside as evidence.

## If I did it again

- Add a `ratings` table, keep individual scores, compute `AVG()` on read
- Use `DATE` and `INT` where the column is a date or a number, instead of `varchar(45)` everywhere
- Use a real session instead of `app.locals`
- Collapse the eight Top 10 routes into `/top?genre=pop` and keep one template
- Wrap `pool.connect()` in `try / finally` so the client is released even on error
- Hash the password before storing it

Nearly every pitfall came from the same habit: I kept making decisions on the basis of "get it running first". A schema is exactly the kind of thing that is very hard to walk back afterwards.
