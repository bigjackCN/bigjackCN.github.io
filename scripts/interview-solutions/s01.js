// Reference solutions for p01.js (used only by scripts/verify-interview.js, never served with the site).
module.exports = {
'two-sum': String.raw`import java.util.*;
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[]{j, i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
'group-anagrams': String.raw`import java.util.*;
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] c = s.toCharArray();
            Arrays.sort(c);
            map.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
'longest-consecutive-sequence': String.raw`import java.util.*;
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int best = 0;
        for (int x : set) {
            if (set.contains(x - 1)) continue;
            int len = 1;
            while (set.contains(x + len)) len++;
            best = Math.max(best, len);
        }
        return best;
    }
}`,
'move-zeroes': String.raw`class Solution {
    public void moveZeroes(int[] nums) {
        int w = 0;
        for (int i = 0; i < nums.length; i++) if (nums[i] != 0) nums[w++] = nums[i];
        while (w < nums.length) nums[w++] = 0;
    }
}`,
'container-with-most-water': String.raw`class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++; else r--;
        }
        return best;
    }
}`,
'3sum': String.raw`import java.util.*;
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s < 0) l++;
                else if (s > 0) r--;
                else {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    l++; r--;
                    while (l < r && nums[l] == nums[l - 1]) l++;
                    while (l < r && nums[r] == nums[r + 1]) r--;
                }
            }
        }
        return res;
    }
}`,
'trapping-rain-water': String.raw`class Solution {
    public int trap(int[] h) {
        int l = 0, r = h.length - 1, lm = 0, rm = 0, water = 0;
        while (l < r) {
            if (h[l] < h[r]) {
                if (h[l] >= lm) lm = h[l]; else water += lm - h[l];
                l++;
            } else {
                if (h[r] >= rm) rm = h[r]; else water += rm - h[r];
                r--;
            }
        }
        return water;
    }
}`,
'longest-substring-without-repeating-characters': String.raw`import java.util.*;
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int best = 0, left = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last.containsKey(c) && last.get(c) >= left) left = last.get(c) + 1;
            last.put(c, r);
            best = Math.max(best, r - left + 1);
        }
        return best;
    }
}`,
'find-all-anagrams-in-a-string': String.raw`import java.util.*;
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> res = new ArrayList<>();
        if (p.length() > s.length()) return res;
        int[] need = new int[26];
        for (char c : p.toCharArray()) need[c - 'a']++;
        int m = p.length();
        for (int i = 0; i < s.length(); i++) {
            need[s.charAt(i) - 'a']--;
            if (i >= m) need[s.charAt(i - m) - 'a']++;
            if (i >= m - 1) {
                boolean ok = true;
                for (int x : need) if (x != 0) { ok = false; break; }
                if (ok) res.add(i - m + 1);
            }
        }
        return res;
    }
}`,
'subarray-sum-equals-k': String.raw`import java.util.*;
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        cnt.put(0, 1);
        int sum = 0, res = 0;
        for (int x : nums) {
            sum += x;
            res += cnt.getOrDefault(sum - k, 0);
            cnt.merge(sum, 1, Integer::sum);
        }
        return res;
    }
}`,
'sliding-window-maximum': String.raw`import java.util.*;
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
        }
        return res;
    }
}`,
'minimum-window-substring': String.raw`class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;
        for (int r = 0; r < s.length(); r++) {
            if (need[s.charAt(r)]-- > 0) missing--;
            while (missing == 0) {
                if (r - left + 1 < bestLen) { bestLen = r - left + 1; bestStart = left; }
                if (++need[s.charAt(left++)] > 0) missing++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
'maximum-subarray': String.raw`class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            best = Math.max(best, cur);
        }
        return best;
    }
}`,
'merge-intervals': String.raw`import java.util.*;
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] cur : intervals) {
            if (out.isEmpty() || out.get(out.size() - 1)[1] < cur[0]) out.add(new int[]{cur[0], cur[1]});
            else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);
        }
        return out.toArray(new int[0][]);
    }
}`,
'rotate-array': String.raw`class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        rev(nums, 0, n - 1); rev(nums, 0, k - 1); rev(nums, k, n - 1);
    }
    private void rev(int[] a, int i, int j) {
        while (i < j) { int t = a[i]; a[i++] = a[j]; a[j--] = t; }
    }
}`,
'product-of-array-except-self': String.raw`class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int right = 1;
        for (int i = n - 1; i >= 0; i--) { ans[i] *= right; right *= nums[i]; }
        return ans;
    }
}`,
'first-missing-positive': String.raw`class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int j = nums[i] - 1, t = nums[j];
                nums[j] = nums[i];
                nums[i] = t;
            }
        }
        for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
}`,
'set-matrix-zeroes': String.raw`class Solution {
    public void setZeroes(int[][] m) {
        int R = m.length, C = m[0].length;
        boolean[] row = new boolean[R], col = new boolean[C];
        for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) if (m[i][j] == 0) { row[i] = true; col[j] = true; }
        for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) if (row[i] || col[j]) m[i][j] = 0;
    }
}`,
'spiral-matrix': String.raw`import java.util.*;
class Solution {
    public List<Integer> spiralOrder(int[][] m) {
        List<Integer> res = new ArrayList<>();
        int top = 0, bot = m.length - 1, left = 0, right = m[0].length - 1;
        while (top <= bot && left <= right) {
            for (int j = left; j <= right; j++) res.add(m[top][j]);
            top++;
            for (int i = top; i <= bot; i++) res.add(m[i][right]);
            right--;
            if (top <= bot) { for (int j = right; j >= left; j--) res.add(m[bot][j]); bot--; }
            if (left <= right) { for (int i = bot; i >= top; i--) res.add(m[i][left]); left++; }
        }
        return res;
    }
}`,
'rotate-image': String.raw`class Solution {
    public void rotate(int[][] m) {
        int n = m.length;
        for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) { int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t; }
        for (int[] row : m) for (int i = 0, j = n - 1; i < j; i++, j--) { int t = row[i]; row[i] = row[j]; row[j] = t; }
    }
}`,
'search-a-2d-matrix-ii': String.raw`class Solution {
    public boolean searchMatrix(int[][] m, int target) {
        int i = 0, j = m[0].length - 1;
        while (i < m.length && j >= 0) {
            if (m[i][j] == target) return true;
            if (m[i][j] > target) j--; else i++;
        }
        return false;
    }
}`
};
