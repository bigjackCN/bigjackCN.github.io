/*
 * rt.js - the Java test-harness runtime appended after the user's code.
 *
 * Everything is fully qualified (java.util.List ...) because the user's file has to compile with
 * exactly the imports THEY wrote - nothing is pre-imported for them.
 *
 * JK_RT_BUILD(needs) returns the Java source: the base runner (JKRT) plus, only when a problem needs
 * them, ListNode / TreeNode / Node and their helpers (so they can never clash with a user's own classes).
 */
(function (root) {
  var BASE = String.raw`
class JKRT {
    static boolean submit;
    static String mode = "exact";
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
        JKRT.mode = cmp;
        JKRT.approx = cmp.equals("approx");
        JKRT.kind = kind;
        JKRT.limitMs = limitMs;
        System.setOut(SINK);
        System.setErr(SINK);
    }

    // ---- the user names their own class and method: find it by parameter types ----
    static String[] userClasses = new String[0];
    static Class<?>[] sigTypes = new Class<?>[0];

    static void sig(Class<?>... types) { sigTypes = types; }

    @SuppressWarnings("unchecked")
    static <T extends Throwable> void sneaky(Throwable t) throws T { throw (T) t; }

    static String typeNames(Class<?>[] ts) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < ts.length; i++) b.append(i > 0 ? ", " : "").append(ts[i].getSimpleName());
        return b.toString();
    }

    static Object call(Object... args) {
        java.lang.reflect.Method best = null;
        Class<?> owner = null;
        int bestScore = -1;
        for (String name : userClasses) {
            Class<?> c;
            try { c = Class.forName(name); } catch (Throwable e) { continue; }
            for (java.lang.reflect.Method m : c.getDeclaredMethods()) {
                if (m.isSynthetic() || java.lang.reflect.Modifier.isPrivate(m.getModifiers()) || m.getName().equals("main")) continue;
                Class<?>[] ps = m.getParameterTypes();
                int score = -1;
                if (java.util.Arrays.equals(ps, sigTypes)) score = 2;
                else if (ps.length == sigTypes.length) score = 1;
                if (score > bestScore) { bestScore = score; best = m; owner = c; }
            }
            if (bestScore == 2) break;
        }
        if (best == null) {
            throw new IllegalStateException("No method found that takes (" + typeNames(sigTypes) + "). Write a method with " + sigTypes.length + " parameter(s) of those types, inside a class.");
        }
        try {
            best.setAccessible(true);
            Object inst = null;
            if (!java.lang.reflect.Modifier.isStatic(best.getModifiers())) {
                java.lang.reflect.Constructor<?> k = owner.getDeclaredConstructor();
                k.setAccessible(true);
                inst = k.newInstance();
            }
            return best.invoke(inst, args);
        } catch (java.lang.reflect.InvocationTargetException e) {
            JKRT.<RuntimeException>sneaky(e.getCause());
            return null;
        } catch (NoSuchMethodException e) {
            throw new IllegalStateException("Class " + owner.getName() + " needs a constructor with no arguments.");
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Your method takes different parameter types than (" + typeNames(sigTypes) + ").");
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(String.valueOf(e));
        }
    }

    static void end() {
        REAL.println("@@END@@");
        REAL.flush();
        System.exit(0);
    }

    static void t(boolean hidden, String input, java.util.concurrent.Callable<Object> call, Object expected) {
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
            String cn = el.getClassName();
            if (!cn.startsWith("JK") && !cn.startsWith("Main") && !cn.startsWith("java.") && !cn.startsWith("jdk.") && !cn.startsWith("sun.")) {
                loc = " (line " + el.getLineNumber() + ")";
                break;
            }
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

    static String show(Object o) { return fmt(o, 0); }

    static String fmt(Object o, int depth) {
        if (o == null) return (depth == 0 && kind.length() > 0) ? "[]" : "null";
        String sp = JKX.special(o);
        if (sp != null) return sp;
        if (o instanceof String) return "\"" + o + "\"";
        if (o instanceof Character) return "'" + o + "'";
        boolean sortHere = mode.equals("unordered") || (mode.equals("setOuter") && depth == 0);
        if (o.getClass().isArray()) {
            int n = java.lang.reflect.Array.getLength(o);
            java.util.List<String> parts = new java.util.ArrayList<String>();
            for (int i = 0; i < n; i++) parts.add(fmt(java.lang.reflect.Array.get(o, i), depth + 1));
            if (sortHere) java.util.Collections.sort(parts);
            return "[" + String.join(",", parts) + "]";
        }
        if (o instanceof java.util.List) {
            java.util.List<String> parts = new java.util.ArrayList<String>();
            for (Object x : (java.util.List<?>) o) parts.add(fmt(x, depth + 1));
            if (sortHere) java.util.Collections.sort(parts);
            return "[" + String.join(",", parts) + "]";
        }
        return String.valueOf(o);
    }

    /* ---- generic builders used by generated tests ---- */
    static java.util.List<Object> L(Object... a) { return new java.util.ArrayList<Object>(java.util.Arrays.asList(a)); }

    static int[] range(int a, int b) {
        int[] r = new int[b - a + 1];
        for (int i = 0; i < r.length; i++) r[i] = a + i;
        return r;
    }

    static java.util.List<Object> filledList(int n, int v) {
        java.util.List<Object> r = new java.util.ArrayList<Object>();
        for (int i = 0; i < n; i++) r.add(v);
        return r;
    }

    static java.util.List<Object> rangeList(int a, int b) {
        java.util.List<Object> r = new java.util.ArrayList<Object>();
        for (int i = a; i <= b; i++) r.add(i);
        return r;
    }

    static int[] rangeDesc(int hi, int lo) {
        int[] r = new int[hi - lo + 1];
        for (int i = 0; i < r.length; i++) r[i] = hi - i;
        return r;
    }

    static int[] concat(int[] a, int[] b) {
        int[] r = java.util.Arrays.copyOf(a, a.length + b.length);
        System.arraycopy(b, 0, r, a.length, b.length);
        return r;
    }

    static int[] fill(int n, int v) {
        int[] r = new int[n];
        java.util.Arrays.fill(r, v);
        return r;
    }

    static char[][] grid(int rows, int cols, char ch) {
        char[][] g = new char[rows][cols];
        for (char[] row : g) java.util.Arrays.fill(row, ch);
        return g;
    }
}
`;

  var LIST_FMT = String.raw`
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
`;

  var TREE_FMT = String.raw`
        if (o instanceof TreeNode) {
            java.util.List<String> vals = new java.util.ArrayList<String>();
            java.util.LinkedList<TreeNode> q = new java.util.LinkedList<TreeNode>();
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
`;

  var NODE_FMT = String.raw`
        if (o instanceof Node) {
            java.util.IdentityHashMap<Node, Integer> pos = new java.util.IdentityHashMap<Node, Integer>();
            int i = 0;
            for (Node c = (Node) o; c != null && i < 1000000; c = c.next) pos.put(c, i++);
            StringBuilder sb = new StringBuilder("[");
            i = 0;
            for (Node c = (Node) o; c != null && i < 1000000; c = c.next) {
                if (i > 0) sb.append(",");
                sb.append("[").append(c.val).append(",");
                Integer r = c.random == null ? null : pos.get(c.random);
                sb.append(c.random == null ? "null" : (r == null ? "?" : String.valueOf(r))).append("]");
                i++;
            }
            return sb.append("]").toString();
        }
`;

  var LIST = String.raw`
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
class JKL {
    static ListNode list(int... v) {
        ListNode dummy = new ListNode(), c = dummy;
        for (int x : v) { c.next = new ListNode(x); c = c.next; }
        return dummy.next;
    }
    static ListNode[] singles(int n) {
        ListNode[] a = new ListNode[n];
        for (int i = 0; i < n; i++) a[i] = new ListNode(n - i);
        return a;
    }
    static ListNode cycleList(int[] v, int pos) {
        ListNode d = new ListNode(), c = d, target = null;
        for (int i = 0; i < v.length; i++) {
            c.next = new ListNode(v[i]);
            c = c.next;
            if (i == pos) target = c;
        }
        if (pos >= 0 && target != null) c.next = target;
        return d.next;
    }
    static int indexOf(ListNode head, ListNode t) {
        if (t == null) return -1;
        int i = 0;
        while (head != null && i < 10000000) {
            if (head == t) return i;
            head = head.next;
            i++;
        }
        return -1;
    }
    static ListNode chain(int[] v, int upto, ListNode tail) {
        ListNode d = new ListNode(), c = d;
        for (int i = 0; i < upto; i++) { c.next = new ListNode(v[i]); c = c.next; }
        c.next = tail;
        return d.next;
    }
    static ListNode[] intersect(int[] a, int[] b, int sa, int sb) {
        ListNode shared = list(java.util.Arrays.copyOfRange(a, sa, a.length));
        return new ListNode[]{chain(a, sa, shared), chain(b, sb, shared)};
    }
}
`;

  var TREE = String.raw`
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}
class JKT {
    static TreeNode tree(Integer... v) {
        if (v.length == 0 || v[0] == null) return null;
        TreeNode root = new TreeNode(v[0]);
        java.util.LinkedList<TreeNode> q = new java.util.LinkedList<TreeNode>();
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
    static TreeNode rightChainVals(int n) {
        TreeNode root = new TreeNode(1), c = root;
        for (int i = 2; i <= n; i++) { c.right = new TreeNode(i); c = c.right; }
        return root;
    }
    static TreeNode find(TreeNode r, int val) {
        if (r == null) return null;
        if (r.val == val) return r;
        TreeNode l = find(r.left, val);
        return l != null ? l : find(r.right, val);
    }
    static void inorder(TreeNode r, java.util.List<Integer> out) {
        if (r == null) return;
        inorder(r.left, out);
        out.add(r.val);
        inorder(r.right, out);
    }
    static int height(TreeNode r) {
        if (r == null) return 0;
        int l = height(r.left);
        if (l < 0) return -1;
        int rr = height(r.right);
        if (rr < 0) return -1;
        if (Math.abs(l - rr) > 1) return -1;
        return Math.max(l, rr) + 1;
    }
    static boolean balancedBstOf(TreeNode r, int[] sorted) {
        java.util.List<Integer> in = new java.util.ArrayList<Integer>();
        inorder(r, in);
        if (in.size() != sorted.length) return false;
        for (int i = 0; i < sorted.length; i++) if (in.get(i) != sorted[i]) return false;
        return height(r) >= 0;
    }
}
`;

  var NODE = String.raw`
class Node {
    int val;
    Node next;
    Node random;
    Node(int val) { this.val = val; }
}
class JKN {
    static Node build(Integer[][] a) {
        int n = a.length;
        if (n == 0) return null;
        Node[] ns = new Node[n];
        for (int i = 0; i < n; i++) ns[i] = new Node(a[i][0]);
        for (int i = 0; i < n; i++) {
            if (i + 1 < n) ns[i].next = ns[i + 1];
            if (a[i][1] != null) ns[i].random = ns[a[i][1]];
        }
        return ns[0];
    }
    static boolean shares(Node orig, Node copy) {
        java.util.IdentityHashMap<Node, Boolean> seen = new java.util.IdentityHashMap<Node, Boolean>();
        for (Node c = orig; c != null; c = c.next) seen.put(c, Boolean.TRUE);
        int guard = 0;
        for (Node c = copy; c != null && guard++ < 1000000; c = c.next) {
            if (seen.containsKey(c) || (c.random != null && seen.containsKey(c.random))) return true;
        }
        return false;
    }
}
`;

  root.JK_RT_BUILD = function (needs) {
    needs = needs || {};
    var special = 'class JKX {\n    static String special(Object o) {\n' +
      (needs.list ? LIST_FMT : '') + (needs.tree ? TREE_FMT : '') + (needs.node ? NODE_FMT : '') +
      '        return null;\n    }\n}\n';
    return BASE + special + (needs.list ? LIST : '') + (needs.tree ? TREE : '') + (needs.node ? NODE : '');
  };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.JK_RT_BUILD;
