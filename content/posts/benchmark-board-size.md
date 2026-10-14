+++
date = '2026-07-11'
title = 'Benchmark postmortem: board size was the wrong axis'
tags = ["Benchmark", "ILP", "Optimization", "Python"]
+++

For my master's project I built a benchmark around tactical resource allocation in a collectible card game: solve it exactly with integer programming (ILP), train an MLP to approximate the solver, then run a small ILP to repair the ML's constraint violations. The theory part proves the problem is NP-hard once abilities are added, and the motivation is "exact methods stop being viable as instances grow, so you need learning plus repair".

The headline numbers were good. On a 7×7 board the exact ILP takes 88.55 ms, my framework takes 32.66 ms, and quality is still 90%.

Then I went back through the experiment and found that **my benchmark cannot measure the thing I set out to prove**. The problem is the independent variable.

## How I defined "size"

For the whole study, "size" was this one line:

```python
board_sizes = [(2,2), (3,3), (4,4), (5,5), (6,6), (7,7)]
```

Three decisions I did not think about at the time all turned into problems: the number of attackers `m` is always equal to the number of targets `n`; the upper bound is 7; and there are only six values.

## Problem 1: the domain rules capped the axis

Here is what I wrote:

> We evaluate on board sizes from 2×2 to 7×7 (the maximum board size in Hearthstone).

Hearthstone allows at most seven minions per side, so 7×7 is the largest legal board. But the claim I wanted to test is "as size grows without bound, exact methods fail" — **I used an axis nailed shut by the rules to test a claim about a limit.**

My own data contradicted me:

```text
   m\n     L1    L2    L3    L4    L5      ILP time (ms)
   2x2     *     *     *     *     *        25 - 27    <- already the fixed-cost floor
   3x3     *     *     *     *     *        27 - 32
   4x4     *     *     *     *     *        28 - 39
   5x5     *     *     *     *     *        30 - 54
   6x6     *     *     *     *     *        32 - 70
   7x7     *     *     *     *     *        33 - 89    <- Hearthstone's cap

   ~~~~~~~~ everything above sits inside the ILP's comfort zone ~~~~~~~~
   ~~~~ the region the theory says should explode ~~~~          <- never tested
```

The question I should have been asking is not "is the ILP slow" but "**how big does the board have to get before the ILP is slow**". My experiment cannot answer it.

## Problem 2: m and n are welded together

`(2,2) ... (7,7)` means both sides always hold the same count. But the ILP has `m·n` variables and `m+n` constraints — with both dimensions moving at once I cannot attribute anything: is the search space growing because there are more attackers, or more targets?

Real matches are usually asymmetric too. Three against six is more common than six against six, and more interesting — **allocation under scarcity is the actual problem**.

## Problem 3: 2×2 costs 26 milliseconds

This is the worst one. Look at the ILP runtime curve: a 2×2 board already takes about 26 ms.

What is 2×2? Four `x` variables and two `e` variables. Branch and bound is not even warmed up at that size. So where did the 26 ms go? Into **how I called the solver**:

```python
prob.solve(pulp.PULP_CBC_CMD(msg=0))
```

Behind that line: PuLP writes the model to an `.lp` file in Python, spawns a `cbc.exe` subprocess, reads its output and parses it back.

I assumed Python-side model building was the bottleneck. So I installed PuLP 3.3.2 (matching the API version the code uses) and measured the pipeline piece by piece:

| Model | Build only | Build + solve | Solve only |
|---|---|---|---|
| **1 variable** | — | **12.14 ms** | ≈ 0 |
| 2×2 Level 1 | 0.06 ms | 13.25 ms | ~1 ms |
| 7×7 Level 1 | 0.33 ms | 25.99 ms | ~13 ms |
| 7×7 Level 5 | 0.62 ms | 45.60 ms | ~32 ms |

The result is uglier than my guess: **a model with a single variable still costs 12 ms.** Those 12 ms have nothing to do with instance size; they are entirely the cost of spawning `cbc.exe`. Python-side construction takes 0.06 ms. I did not even guess the right cause.

(My machine is faster than the one the experiment ran on, so the absolute numbers are lower; the shape is the same. The original run's 2×2 sits at 26 ms, mine at 13 ms — each is its own floor.)

The consequences run in both directions, and I missed both:

- **The low end is flattened.** From 2×2 to 7×7 at Level 1, real solving time grows by **more than 10×** (about 1 ms to about 13 ms), while the reported number only moves from 26 to 33 ms — a 2× increase. That stretch of the curve measures process startup, not combinatorial explosion.
- **The high end is diluted.** Both the exact ILP and the repair call `PULP_CBC_CMD`, so **both pay the same fixed cost**, which pushes every speed-up ratio toward 1.

Subtracting the fixed cost as an intercept (the standard "measure a near-zero instance to find the intercept" move):

| 7×7 / Level 5 | Reported | Minus fixed cost |
|---|---|---|
| Exact ILP | 88.55 ms | ≈ 62 ms |
| My framework | 32.66 ms | ≈ 14 ms |
| **Speed-up** | **2.7×** | **≥ 4×** |

The two methods differ by 6 ms at 2×2 (26 vs 19) and I never fully explained that. If you assume both should carry the same fixed cost and use 26 ms as a shared intercept, the ratio becomes about 9×. **Either way the conclusion holds: the reported 2.7× is flattened by fixed cost, and the real gap is at least 4×.**

**My framework is better than the draft made it look** — and it was understated because I had folded the measurement tool's startup cost into the algorithm's cost.

## Problem 4: size and difficulty moved together

The board generator:

```python
attackers = [random.randint(1, MAX_ATTACK) for _ in range(m)]   # 1..8
defenders = [random.randint(1, MAX_HEALTH) for _ in range(n)]   # 1..10
weights   = [random.randint(1, MAX_WEIGHT) for _ in range(n)]   # 1..5
```

The ranges are fixed, so as the board grows, total attack and total health grow **in proportion** — the difficulty density stays constant and only the combinatorial space changes.

Which means `board size` was carrying two things at once: the **size** of the instance and its **difficulty distribution**. I treated them as one.

## What I would do differently

1. **Split the axis in two.** A game-legal range (2×2–7×7) to stay realistic, plus an abstract stress range (say 8×8 to 12×12) clearly labelled as beyond Hearthstone's cap. The framework claims to be game-agnostic, and the abstract model has no 7 in it — the second range is the one the theory needs.
2. **Decouple m and n.** An m×n heatmap, or "fix n, sweep m" plus "fix m, sweep n", so you can tell which dimension is doing the work.
3. **Fix the timing methodology.** Measure the near-zero intercept and report it, give fixed overhead and net solve time as two lines, or just use the solver's own CPU time.
4. **Use variable and constraint counts as the theoretical size axis.** Board size is only a projection of it — that lines up with ILP complexity theory and is not bound by domain rules.
5. **Repeat each configuration and report a distribution**, not a single mean over 200 instances.

## The general lesson

When I chose the independent variable, my checklist had exactly one item: "does this quantity reflect the difficulty of the problem?" `board size` passed. It really is the natural measure of scale here.

What I missed was the second question: **does the range of this quantity cover the region where the claim I want to test actually lives?**

I picked the right variable. Its range was nailed shut by the domain rules. And that class of constraint is easy to miss because it is not in the algorithm — it is in the **rulebook**. "Hearthstone caps the board at seven" felt like game trivia in my head, not an experimental design decision. It was an experimental design decision, and the most important one.
