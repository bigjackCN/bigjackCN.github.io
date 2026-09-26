module.exports = {
'binary-tree-inorder-traversal': String.raw`import java.util.*;
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }
            cur = st.pop();
            res.add(cur.val);
            cur = cur.right;
        }
        return res;
    }
}`,
'maximum-depth-of-binary-tree': String.raw`class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
'invert-binary-tree': String.raw`class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode l = invertTree(root.left), r = invertTree(root.right);
        root.left = r;
        root.right = l;
        return root;
    }
}`,
'symmetric-tree': String.raw`class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || mirror(root.left, root.right);
    }
    private boolean mirror(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
    }
}`,
'diameter-of-binary-tree': String.raw`class Solution {
    private int best;
    public int diameterOfBinaryTree(TreeNode root) {
        best = 0;
        depth(root);
        return best;
    }
    private int depth(TreeNode n) {
        if (n == null) return 0;
        int l = depth(n.left), r = depth(n.right);
        best = Math.max(best, l + r);
        return Math.max(l, r) + 1;
    }
}`,
'binary-tree-level-order-traversal': String.raw`import java.util.*;
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            int n = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                TreeNode x = q.poll();
                level.add(x.val);
                if (x.left != null) q.add(x.left);
                if (x.right != null) q.add(x.right);
            }
            res.add(level);
        }
        return res;
    }
}`,
'convert-sorted-array-to-binary-search-tree': String.raw`class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    private TreeNode build(int[] a, int lo, int hi) {
        if (lo > hi) return null;
        int mid = (lo + hi) >>> 1;
        TreeNode n = new TreeNode(a[mid]);
        n.left = build(a, lo, mid - 1);
        n.right = build(a, mid + 1, hi);
        return n;
    }
}`,
'validate-binary-search-tree': String.raw`class Solution {
    public boolean isValidBST(TreeNode root) {
        return ok(root, null, null);
    }
    private boolean ok(TreeNode n, Integer lo, Integer hi) {
        if (n == null) return true;
        if ((lo != null && n.val <= lo) || (hi != null && n.val >= hi)) return false;
        return ok(n.left, lo, n.val) && ok(n.right, n.val, hi);
    }
}`,
'kth-smallest-element-in-a-bst': String.raw`import java.util.*;
class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> st = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !st.isEmpty()) {
            while (cur != null) { st.push(cur); cur = cur.left; }
            cur = st.pop();
            if (--k == 0) return cur.val;
            cur = cur.right;
        }
        return -1;
    }
}`,
'binary-tree-right-side-view': String.raw`import java.util.*;
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            int n = q.size();
            for (int i = 0; i < n; i++) {
                TreeNode x = q.poll();
                if (i == n - 1) res.add(x.val);
                if (x.left != null) q.add(x.left);
                if (x.right != null) q.add(x.right);
            }
        }
        return res;
    }
}`,
'flatten-binary-tree-to-linked-list': String.raw`class Solution {
    public void flatten(TreeNode root) {
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left != null) {
                TreeNode p = cur.left;
                while (p.right != null) p = p.right;
                p.right = cur.right;
                cur.right = cur.left;
                cur.left = null;
            }
            cur = cur.right;
        }
    }
}`,
'construct-binary-tree-from-preorder-and-inorder-traversal': String.raw`import java.util.*;
class Solution {
    private Map<Integer, Integer> pos = new HashMap<>();
    private int pre;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) pos.put(inorder[i], i);
        pre = 0;
        return build(preorder, 0, inorder.length - 1);
    }
    private TreeNode build(int[] preorder, int lo, int hi) {
        if (lo > hi) return null;
        TreeNode n = new TreeNode(preorder[pre++]);
        int m = pos.get(n.val);
        n.left = build(preorder, lo, m - 1);
        n.right = build(preorder, m + 1, hi);
        return n;
    }
}`,
'path-sum-iii': String.raw`import java.util.*;
class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        Map<Long, Integer> cnt = new HashMap<>();
        cnt.put(0L, 1);
        return dfs(root, 0L, targetSum, cnt);
    }
    private int dfs(TreeNode n, long sum, int target, Map<Long, Integer> cnt) {
        if (n == null) return 0;
        sum += n.val;
        int res = cnt.getOrDefault(sum - target, 0);
        cnt.merge(sum, 1, Integer::sum);
        res += dfs(n.left, sum, target, cnt) + dfs(n.right, sum, target, cnt);
        cnt.merge(sum, -1, Integer::sum);
        return res;
    }
}`,
'lowest-common-ancestor-of-a-binary-tree': String.raw`class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode l = lowestCommonAncestor(root.left, p, q), r = lowestCommonAncestor(root.right, p, q);
        if (l != null && r != null) return root;
        return l != null ? l : r;
    }
}`,
'binary-tree-maximum-path-sum': String.raw`class Solution {
    private int best;
    public int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }
    private int gain(TreeNode n) {
        if (n == null) return 0;
        int l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
        best = Math.max(best, n.val + l + r);
        return n.val + Math.max(l, r);
    }
}`,
'number-of-islands': String.raw`class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++)
            for (int j = 0; j < grid[0].length; j++)
                if (grid[i][j] == '1') { count++; sink(grid, i, j); }
        return count;
    }
    private void sink(char[][] g, int i, int j) {
        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != '1') return;
        g[i][j] = '0';
        sink(g, i + 1, j); sink(g, i - 1, j); sink(g, i, j + 1); sink(g, i, j - 1);
    }
}`,
'rotting-oranges': String.raw`import java.util.*;
class Solution {
    public int orangesRotting(int[][] grid) {
        int R = grid.length, C = grid[0].length, fresh = 0;
        Queue<int[]> q = new LinkedList<>();
        for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) {
            if (grid[i][j] == 2) q.add(new int[]{i, j});
            else if (grid[i][j] == 1) fresh++;
        }
        int minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty() && fresh > 0) {
            minutes++;
            for (int s = q.size(); s > 0; s--) {
                int[] c = q.poll();
                for (int[] d : dirs) {
                    int x = c[0] + d[0], y = c[1] + d[1];
                    if (x >= 0 && y >= 0 && x < R && y < C && grid[x][y] == 1) { grid[x][y] = 2; fresh--; q.add(new int[]{x, y}); }
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
'course-schedule': String.raw`import java.util.*;
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        int[] indeg = new int[numCourses];
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.add(i);
        int done = 0;
        while (!q.isEmpty()) {
            int c = q.poll();
            done++;
            for (int nx : adj.get(c)) if (--indeg[nx] == 0) q.add(nx);
        }
        return done == numCourses;
    }
}`,
'implement-trie-prefix-tree': String.raw`class Trie {
    private static class N { N[] next = new N[26]; boolean end; }
    private final N root = new N();
    public Trie() {}
    public void insert(String word) {
        N n = root;
        for (char c : word.toCharArray()) {
            if (n.next[c - 'a'] == null) n.next[c - 'a'] = new N();
            n = n.next[c - 'a'];
        }
        n.end = true;
    }
    private N find(String s) {
        N n = root;
        for (char c : s.toCharArray()) {
            n = n.next[c - 'a'];
            if (n == null) return null;
        }
        return n;
    }
    public boolean search(String word) { N n = find(word); return n != null && n.end; }
    public boolean startsWith(String prefix) { return find(prefix) != null; }
}`
};
