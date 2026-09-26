/*
 * rt.js - the Java test-harness runtime that is appended to the user's code.
 * It provides ListNode / TreeNode and JKRT (runs each test in its own thread with a
 * time limit, captures System.out per test and prints one result line per test).
 */
(function (root) {
  root.JK_RT = String.raw`
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}
class JKRT {
    static boolean submit;
    static boolean unordered;
    static boolean approx;
    static String kind = "";
    static long limitMs = 3000L;
    static int idx = 0;
    static boolean stop = false; // Submit stops at the first failing test; a timed-out test stops everything
    static final java.io.PrintStream REAL = System.out;
    static final java.io.PrintStream SINK = new java.io.PrintStream(new java.io.OutputStream() {
        public void write(int b) {}
        public void write(byte[] b, int o, int l) {}
    });

    static void begin(boolean submit, String cmp, String kind, long limitMs) {
        JKRT.submit = submit;
        JKRT.unordered = cmp.equals("unordered");
        JKRT.approx = cmp.equals("approx");
        JKRT.kind = kind;
        JKRT.limitMs = limitMs;
        System.setOut(SINK);
        System.setErr(SINK);
    }

    static void end() {
        REAL.println("@@END@@");
        REAL.flush();
        System.exit(0);
    }

    static void t(boolean hidden, String input, Callable<Object> call, Object expected) {
        if (hidden && !submit) return;
        if (stop) return;
        idx++;
        final Object[] res = new Object[1];
        final Throwable[] err = new Throwable[1];
        java.io.ByteArrayOutputStream buf = new java.io.ByteArrayOutputStream();
        java.io.PrintStream cap = new java.io.PrintStream(buf, true);
        System.setOut(cap);
        System.setErr(cap);
        long t0 = System.nanoTime();
        Thread th = new Thread(null, () -> {
            try { res[0] = call.call(); } catch (Throwable e) { err[0] = e; }
        }, "jk-test", 128L * 1024 * 1024);
        th.setDaemon(true);
        th.start();
        try { th.join(limitMs); } catch (InterruptedException e) { }
        long ms = (System.nanoTime() - t0) / 1000000L;
        boolean alive = th.isAlive();
        System.setOut(SINK);
        System.setErr(SINK);
        String verdict;
        String actual = "";
        String exp = show(expected);
        if (alive) {
            verdict = "TLE";
            actual = "Time limit exceeded (> " + limitMs + " ms)";
        } else if (err[0] != null) {
            verdict = "ERR";
            actual = describe(err[0]);
        } else {
            actual = show(res[0]);
            boolean ok = approx ? close(expected, res[0]) : exp.equals(actual);
            verdict = ok ? "PASS" : "FAIL";
        }
        if (verdict.equals("TLE") || (submit && !verdict.equals("PASS"))) stop = true;
        String out = buf.toString();
        if (out.length() > 4000) out = out.substring(0, 4000) + "...(truncated)";
        REAL.println("@@JK@@\t" + idx + "\t" + verdict + "\t" + ms + "\t" + esc(input) + "\t" + esc(clip(exp)) + "\t" + esc(clip(actual)) + "\t" + esc(out));
        REAL.flush();
    }

    static String clip(String s) {
        return s.length() > 400 ? s.substring(0, 400) + "...(" + s.length() + " chars)" : s;
    }

    static String esc(String s) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\') b.append("\\\\");
            else if (c == '\t') b.append("\\t");
            else if (c == '\n') b.append("\\n");
            else if (c == '\r') { }
            else b.append(c);
        }
        return b.toString();
    }

    static String describe(Throwable e) {
        String loc = "";
        for (StackTraceElement el : e.getStackTrace()) {
            if (el.getClassName().startsWith("Solution")) { loc = " (Solution line " + el.getLineNumber() + ")"; break; }
        }
        String m = e.getMessage();
        return e.getClass().getName() + (m != null ? ": " + m : "") + loc;
    }

    static boolean close(Object a, Object b) {
        if (a instanceof Number && b instanceof Number) {
            return Math.abs(((Number) a).doubleValue() - ((Number) b).doubleValue()) < 1e-5;
        }
        return String.valueOf(a).equals(String.valueOf(b));
    }

    static String show(Object o) { return fmt(o, unordered, true); }

    static String fmt(Object o, boolean sort, boolean top) {
        if (o == null) return (top && (kind.equals("list") || kind.equals("tree"))) ? "[]" : "null";
        if (o instanceof String) return "\"" + o + "\"";
        if (o instanceof Character) return "'" + o + "'";
        if (o instanceof ListNode) {
            StringBuilder sb = new StringBuilder("[");
            ListNode c = (ListNode) o;
            int n = 0;
            while (c != null && n < 1000000) {
                if (n > 0) sb.append(",");
                sb.append(c.val);
                c = c.next;
                n++;
            }
            if (c != null) sb.append(",...(cycle?)");
            return sb.append("]").toString();
        }
        if (o instanceof TreeNode) {
            List<String> vals = new ArrayList<>();
            LinkedList<TreeNode> q = new LinkedList<>();
            q.add((TreeNode) o);
            int guard = 0;
            while (!q.isEmpty() && guard++ < 2000000) {
                TreeNode n = q.poll();
                if (n == null) { vals.add("null"); continue; }
                vals.add(String.valueOf(n.val));
                q.add(n.left);
                q.add(n.right);
            }
            while (!vals.isEmpty() && vals.get(vals.size() - 1).equals("null")) vals.remove(vals.size() - 1);
            return "[" + String.join(",", vals) + "]";
        }
        if (o.getClass().isArray()) {
            int n = java.lang.reflect.Array.getLength(o);
            List<String> parts = new ArrayList<>();
            for (int i = 0; i < n; i++) parts.add(fmt(java.lang.reflect.Array.get(o, i), sort, false));
            if (sort) Collections.sort(parts);
            return "[" + String.join(",", parts) + "]";
        }
        if (o instanceof List) {
            List<String> parts = new ArrayList<>();
            for (Object x : (List<?>) o) parts.add(fmt(x, sort, false));
            if (sort) Collections.sort(parts);
            return "[" + String.join(",", parts) + "]";
        }
        return String.valueOf(o);
    }

    /* ---- builders used by the generated tests ---- */
    static List<Object> L(Object... a) { return new ArrayList<>(Arrays.asList(a)); }

    static ListNode list(int... v) {
        ListNode dummy = new ListNode(), c = dummy;
        for (int x : v) { c.next = new ListNode(x); c = c.next; }
        return dummy.next;
    }

    static TreeNode tree(Integer... v) {
        if (v.length == 0 || v[0] == null) return null;
        TreeNode root = new TreeNode(v[0]);
        LinkedList<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < v.length) {
            TreeNode n = q.poll();
            if (i < v.length && v[i] != null) { n.left = new TreeNode(v[i]); q.add(n.left); }
            i++;
            if (i < v.length && v[i] != null) { n.right = new TreeNode(v[i]); q.add(n.right); }
            i++;
        }
        return root;
    }

    static TreeNode rightChain(int n) {
        TreeNode root = new TreeNode(1), c = root;
        for (int i = 1; i < n; i++) { c.right = new TreeNode(1); c = c.right; }
        return root;
    }

    static int[] range(int a, int b) {
        int[] r = new int[b - a + 1];
        for (int i = 0; i < r.length; i++) r[i] = a + i;
        return r;
    }

    static int[] rangeDesc(int hi, int lo) {
        int[] r = new int[hi - lo + 1];
        for (int i = 0; i < r.length; i++) r[i] = hi - i;
        return r;
    }

    static int[] fill(int n, int v) {
        int[] r = new int[n];
        Arrays.fill(r, v);
        return r;
    }

    static char[][] grid(int rows, int cols, char ch) {
        char[][] g = new char[rows][cols];
        for (char[] row : g) Arrays.fill(row, ch);
        return g;
    }

    static ListNode[] singles(int n) {
        ListNode[] a = new ListNode[n];
        for (int i = 0; i < n; i++) a[i] = new ListNode(n - i);
        return a;
    }
}
`;
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.JK_RT;
