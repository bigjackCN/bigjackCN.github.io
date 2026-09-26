module.exports = {
'permutations': String.raw`import java.util.*;
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        go(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }
    private void go(int[] a, boolean[] used, List<Integer> cur, List<List<Integer>> res) {
        if (cur.size() == a.length) { res.add(new ArrayList<>(cur)); return; }
        for (int i = 0; i < a.length; i++) {
            if (used[i]) continue;
            used[i] = true; cur.add(a[i]);
            go(a, used, cur, res);
            cur.remove(cur.size() - 1); used[i] = false;
        }
    }
}`,
'subsets': String.raw`import java.util.*;
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        go(nums, 0, new ArrayList<>(), res);
        return res;
    }
    private void go(int[] a, int i, List<Integer> cur, List<List<Integer>> res) {
        if (i == a.length) { res.add(new ArrayList<>(cur)); return; }
        go(a, i + 1, cur, res);
        cur.add(a[i]);
        go(a, i + 1, cur, res);
        cur.remove(cur.size() - 1);
    }
}`,
'letter-combinations-of-a-phone-number': String.raw`import java.util.*;
class Solution {
    private static final String[] MAP = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    public List<String> letterCombinations(String digits) {
        List<String> res = new ArrayList<>();
        if (digits.isEmpty()) return res;
        go(digits, 0, new StringBuilder(), res);
        return res;
    }
    private void go(String d, int i, StringBuilder sb, List<String> res) {
        if (i == d.length()) { res.add(sb.toString()); return; }
        for (char c : MAP[d.charAt(i) - '0'].toCharArray()) {
            sb.append(c);
            go(d, i + 1, sb, res);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
'combination-sum': String.raw`import java.util.*;
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        go(candidates, 0, target, new ArrayList<>(), res);
        return res;
    }
    private void go(int[] c, int start, int rem, List<Integer> cur, List<List<Integer>> res) {
        if (rem == 0) { res.add(new ArrayList<>(cur)); return; }
        for (int i = start; i < c.length; i++) {
            if (c[i] > rem) continue;
            cur.add(c[i]);
            go(c, i, rem - c[i], cur, res);
            cur.remove(cur.size() - 1);
        }
    }
}`,
'generate-parentheses': String.raw`import java.util.*;
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        go(n, 0, 0, new StringBuilder(), res);
        return res;
    }
    private void go(int n, int open, int close, StringBuilder sb, List<String> res) {
        if (sb.length() == 2 * n) { res.add(sb.toString()); return; }
        if (open < n) { sb.append('('); go(n, open + 1, close, sb, res); sb.deleteCharAt(sb.length() - 1); }
        if (close < open) { sb.append(')'); go(n, open, close + 1, sb, res); sb.deleteCharAt(sb.length() - 1); }
    }
}`,
'word-search': String.raw`class Solution {
    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++)
            for (int j = 0; j < board[0].length; j++)
                if (go(board, word, 0, i, j)) return true;
        return false;
    }
    private boolean go(char[][] b, String w, int k, int i, int j) {
        if (k == w.length()) return true;
        if (i < 0 || j < 0 || i >= b.length || j >= b[0].length || b[i][j] != w.charAt(k)) return false;
        char c = b[i][j];
        b[i][j] = '#';
        boolean ok = go(b, w, k + 1, i + 1, j) || go(b, w, k + 1, i - 1, j) || go(b, w, k + 1, i, j + 1) || go(b, w, k + 1, i, j - 1);
        b[i][j] = c;
        return ok;
    }
}`,
'palindrome-partitioning': String.raw`import java.util.*;
class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res = new ArrayList<>();
        go(s, 0, new ArrayList<>(), res);
        return res;
    }
    private void go(String s, int start, List<String> cur, List<List<String>> res) {
        if (start == s.length()) { res.add(new ArrayList<>(cur)); return; }
        for (int end = start + 1; end <= s.length(); end++) {
            if (!pal(s, start, end - 1)) continue;
            cur.add(s.substring(start, end));
            go(s, end, cur, res);
            cur.remove(cur.size() - 1);
        }
    }
    private boolean pal(String s, int i, int j) {
        while (i < j) if (s.charAt(i++) != s.charAt(j--)) return false;
        return true;
    }
}`,
'n-queens': String.raw`import java.util.*;
class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        go(n, 0, new int[n], new boolean[n], new boolean[2 * n], new boolean[2 * n], res);
        return res;
    }
    private void go(int n, int r, int[] pos, boolean[] col, boolean[] d1, boolean[] d2, List<List<String>> res) {
        if (r == n) {
            List<String> board = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                char[] row = new char[n];
                Arrays.fill(row, '.');
                row[pos[i]] = 'Q';
                board.add(new String(row));
            }
            res.add(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (col[c] || d1[r + c] || d2[r - c + n]) continue;
            col[c] = d1[r + c] = d2[r - c + n] = true;
            pos[r] = c;
            go(n, r + 1, pos, col, d1, d2, res);
            col[c] = d1[r + c] = d2[r - c + n] = false;
        }
    }
}`,
'search-insert-position': String.raw`class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] < target) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}`,
'search-a-2d-matrix': String.raw`class Solution {
    public boolean searchMatrix(int[][] m, int target) {
        int R = m.length, C = m[0].length, lo = 0, hi = R * C - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1, v = m[mid / C][mid % C];
            if (v == target) return true;
            if (v < target) lo = mid + 1; else hi = mid - 1;
        }
        return false;
    }
}`,
'find-first-and-last-position-of-element-in-sorted-array': String.raw`class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = lower(nums, target);
        if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
        return new int[]{first, lower(nums, target + 1) - 1};
    }
    private int lower(int[] a, int t) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] < t) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}`,
'search-in-rotated-sorted-array': String.raw`class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
            }
        }
        return -1;
    }
}`,
'find-minimum-in-rotated-sorted-array': String.raw`class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
        }
        return nums[lo];
    }
}`,
'median-of-two-sorted-arrays': String.raw`class Solution {
    public double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a);
        int m = a.length, n = b.length, lo = 0, hi = m, half = (m + n + 1) / 2;
        while (lo <= hi) {
            int i = (lo + hi) / 2, j = half - i;
            int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1], aR = i == m ? Integer.MAX_VALUE : a[i];
            int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1], bR = j == n ? Integer.MAX_VALUE : b[j];
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return Math.max(aL, bL);
                return (Math.max(aL, bL) + (double) Math.min(aR, bR)) / 2.0;
            } else if (aL > bR) hi = i - 1; else lo = i + 1;
        }
        return 0.0;
    }
}`,
'valid-parentheses': String.raw`import java.util.*;
class Solution {
    public boolean isValid(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')');
            else if (c == '[') st.push(']');
            else if (c == '{') st.push('}');
            else if (st.isEmpty() || st.pop() != c) return false;
        }
        return st.isEmpty();
    }
}`,
'min-stack': String.raw`import java.util.*;
class MinStack {
    private final Deque<int[]> st = new ArrayDeque<>();
    public MinStack() {}
    public void push(int val) {
        int min = st.isEmpty() ? val : Math.min(val, st.peek()[1]);
        st.push(new int[]{val, min});
    }
    public void pop() { st.pop(); }
    public int top() { return st.peek()[0]; }
    public int getMin() { return st.peek()[1]; }
}`,
'decode-string': String.raw`import java.util.*;
class Solution {
    public String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();
        Deque<StringBuilder> strs = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int k = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) k = k * 10 + (c - '0');
            else if (c == '[') { counts.push(k); strs.push(cur); cur = new StringBuilder(); k = 0; }
            else if (c == ']') {
                StringBuilder prev = strs.pop();
                int times = counts.pop();
                for (int i = 0; i < times; i++) prev.append(cur);
                cur = prev;
            } else cur.append(c);
        }
        return cur.toString();
    }
}`,
'daily-temperatures': String.raw`import java.util.*;
class Solution {
    public int[] dailyTemperatures(int[] t) {
        int[] ans = new int[t.length];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < t.length; i++) {
            while (!st.isEmpty() && t[st.peek()] < t[i]) { int j = st.pop(); ans[j] = i - j; }
            st.push(i);
        }
        return ans;
    }
}`,
'largest-rectangle-in-histogram': String.raw`import java.util.*;
class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> st = new ArrayDeque<>();
        int best = 0, n = heights.length;
        for (int i = 0; i <= n; i++) {
            int h = i == n ? 0 : heights[i];
            while (!st.isEmpty() && heights[st.peek()] >= h) {
                int height = heights[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }
}`
};
