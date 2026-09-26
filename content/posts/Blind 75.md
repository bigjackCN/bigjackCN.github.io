+++
date = '2026-08-19T21:57:33+08:00'
lastmod = '2026-08-19T00:00:00+08:00'
draft = false
title = "Blind 75 刷题笔记（长期更新）"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = "images/blind-75.png"
alt = "leetcode page"
caption = ""
+++

> 本文汇总 Blind 75 中经典题目的 Java 解法，持续更新。每道题均附思路简述、复杂度分析及核心代码。

---

## 1. 两数之和（LeetCode 1）

**题目**：给定一个整数数组 `nums` 和一个目标值 `target`，请你在该数组中找出和为目标值的那 **两个** 整数，并返回它们的数组下标。

### 哈希表

Time: O(n)  
Space: O(n)

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int capacity = (int) (nums.length / 0.75f) + 1;
        Map<Integer, Integer> hash = new HashMap<>(capacity);
        for (int i = 0; i < nums.length; i++) {
            if (hash.get(nums[i]) != null) {
                return new int[] {hash.get(nums[i]), i};
            }
            hash.put(target - nums[i], i);
        }
        return null;
    }
}

```

## 2. 无重复字符的最长子串（LeetCode 3）

**题目**：给定一个字符串 s，请你找出其中不含有重复字符的 最长子串 的长度。

### 滑动窗口（HashMap 跳跃版）

Time: O(n)  
Space: O(min(m, n))

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        if (s == null || s.length() == 0) return 0;
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, max = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                left = Math.max(left, map.get(c) + 1);
            }
            map.put(c, right);
            max = Math.max(max, right - left + 1);
        }
        return max;
    }
}

```

## 3. 盛最多水的容器（LeetCode 11）

**题目**：给定 n 个非负整数 height，每个整数代表坐标中的一个点 \(i, height\[i\]\)。找出两条线与 x 轴共同构成的容器，使其能容纳最多的水。

### 双指针

Time: O(n)  
Space: O(1)

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1, max = 0;
        while (left < right) {
            int area = (right - left) * Math.min(height[left], height[right]);
            max = Math.max(max, area);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return max;
    }
}

```

## 4. 三数之和（LeetCode 15）

**题目**：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a \+ b \+ c = 0？请你找出所有和为 0 且不重复的三元组。

### 排序 + 双指针

Time: O(n²)     
Space: O(1)

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1, target = -nums[i];
            while (left < right) {
                int sum = nums[left] + nums[right];
                if (sum == target) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return res;
    }
}

```

## 5. 删除链表的倒数第 N 个结点（LeetCode 19）

**题目**：给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。 

### Slow Fast Pointers

Time: O(n)      
Space: O(1)

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode fast = dummy;
        ListNode slow = dummy;

        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        
        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

## 6. 有效的括号（LeetCode 20）

**题目**：给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。

### 栈

Time: O(n)  
Space: O(n)

```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}

```

## 7. 合并两个有序链表（LeetCode 21）

**题目**：将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

### Compare Merge

Time: O(m+n)      
Space: O(1)

```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }
        if (list1 != null) current.next = list1;
        if (list2 != null) current.next = list2;
        return dummy.next;
    }
}
```

## 8. 合并 K 个升序链表（LeetCode 23）

**题目**：给你一个链表数组，每个链表都已经按升序排列。 

### MinHeap

Time: O(nlogk)      
Space: O(k)

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>
                            ((a, b) -> Integer.compare(a.val, b.val));

        for (int i = 0; i < lists.length; i++) {
            if (lists[i] != null) {
                minHeap.offer(lists[i]);
            }
        }

        ListNode dummy = new ListNode(-1);
        ListNode current = dummy;

        while (!minHeap.isEmpty()) {
            ListNode minNode = minHeap.poll();
            
            current.next = minNode;
            current = current.next;
            
            if (minNode.next != null) {
                minHeap.offer(minNode.next);
            }
        }
        return dummy.next;
    }
}
```

## 9. 搜索旋转排序数组（LeetCode 33）

**题目**：整数数组 nums 按升序排列，在某个未知点进行了旋转。给定一个目标值 target，如果目标值在数组中返回其下标，否则返回 \-1。

### 修改的二分查找

Time: O(logn)   
Space: O(1)

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (target > nums[mid] && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
}

```

## 10. 组合总和（LeetCode 39）

**题目**：给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。

### backtracking

Time: O(n^(t/c))      
Space: O(t/c)

```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> temp = new ArrayList<>();
        helper(candidates, target, 0, res, temp);
        return res;
    }

    private void helper(int[] candidates, int target, int start, List<List<Integer>> res, List<Integer> temp) {
        if (target < 0) return;
        if (target == 0) {
            res.add(new ArrayList<>(temp));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (target - candidates[i] >= 0) {
                temp.add(candidates[i]);
                helper(candidates, target - candidates[i], i, res, temp);
                temp.remove(temp.size() - 1);
            }
        }
    }
}
```

## 11. 旋转图像（LeetCode 48）

**题目**：给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。

### use one extra block + 4 angles rotation

Time: O(m*n)      
Space: O(1)

```java
class Solution {
    public void rotate(int[][] matrix) {
        int left = 0, right = matrix[0].length - 1;
        while(left < right) {
            int top = left, bottom = right;
            for (int i = 0; i < right - left; i++) {
                int temp = matrix[top][left + i];
                matrix[top][left + i] = matrix[bottom - i][left];
                matrix[bottom - i][left] = matrix[bottom][right - i];
                matrix[bottom][right - i] = matrix[top + i][right];
                matrix[top + i][right] = temp;
            }
            left++;
            right--;
        }
    }
}
```

## 12. 字母异位词分组（LeetCode 49）

**题目**：给定字符串数组 strs，将所有字母异位词（由相同字母重排列形成的词）组合在一起。

### 计数数组作为 key

Time: O(nk)（k 为字符串最大长度）   
Space: O(n)

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String str : strs) {
            int[] counts = new int[26];
            for (char c : str.toCharArray()) counts[c - 'a']++;
            StringBuilder sb = new StringBuilder();
            for (int count : counts) sb.append(count).append('#');
            String key = sb.toString();
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
        }
        return new ArrayList<>(map.values());
    }
}

```

## 13. 最大子数组和（LeetCode 53）

**题目**：给你一个整数数组 nums，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

### Kadane 算法（DP）

Time: O(n)  
Space: O(1)

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int acc = 0, max = nums[0];
        for (int num : nums) {
            acc += num;
            if (num > max) max = num;
            if (acc < 0) acc = 0;
            else if (acc > max) max = acc;
        }
        return max;
    }
}

```

## 14. 螺旋矩阵（LeetCode 54）

**题目**：给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。

### left -> right, top -> bottom, right -> left, bottom -> top. 

Time: O(m*n)      
Space: O(1)

```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int left = 0, right = matrix[0].length, top = 0, bottom = matrix.length;
        List<Integer> res = new ArrayList<>();
        while (left < right && top < bottom) {
            for (int i = left; i < right; i++) {
                res.add(matrix[top][i]);
            }
            top++;
            if (top >= bottom) break;
            for (int j = top; j < bottom; j++) {
                res.add(matrix[j][right - 1]); 
            }
            right--;
            if (left >= right) break;
            for (int k = right - 1; k >= left; k--) {
                res.add(matrix[bottom - 1][k]);
            }
            bottom--;
            if (top >= bottom) break;
            for (int l = bottom - 1; l >= top; l--) {
                res.add(matrix[l][left]);
            }
            left++;
        }
        return res;
    }
}
```

## 15. Jump Game（LeetCode 55）

**题目**：You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

### Greedy on jump cover

Time: O(n)      
Space: O(1)

```java
class Solution {
    public boolean canJump(int[] nums) {
        int cover = 0;

        for (int i = 0; i <= cover; i++) {
            cover = Math.max(cover, i + nums[i]);
            if (cover >= nums.length - 1) {
                return true;
            } 
        }
        return false;
    }
}
```

## 16. Merge Intervals（LeetCode 56）

**题目**：Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Greedy

Time: O(nlogn)      
Space: O(1)

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        int index = 0;
        int start = intervals[0][0];
        int end = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (end >= intervals[i][0]) {
                end = Math.max(end, intervals[i][1]);
            } else {
                intervals[index][0] = start;
                intervals[index][1] = end;
                index++;

                start = intervals[i][0];
                end = intervals[i][1];
            }
        }
        intervals[index][0] = start;
        intervals[index][1] = end;
        index++;
        return Arrays.copyOf(intervals, index);
    }
}
```

## 17. 不同路径（LeetCode 62）

**题目**：一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
问总共有多少条不同的路径？

### DP from left and top

Time: O(m*n)      
Space: O(n)

```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] = dp[j] + dp[j-1];
            }
        }
        return dp[n-1];
    }
}
```

## 18. 爬楼梯（LeetCode 70）

**题目**：假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

### DP

Time: O(n)      
Space: O(1)

```java
class Solution {
    public int climbStairs(int n) {
        int prev1 = 1, prev2 = 1;
        int cur = 1;
        for (int i = 2; i <= n; i++) {
            cur = prev1 + prev2;
            prev1 = prev2;
            prev2 = cur;
        }
        return cur;
    }
}
```

## 19. 矩阵置零（LeetCode 73）

**题目**：给定一个 m x n 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。

### use row and col zero + one extra block 

Time: O(m*n)      
Space: O(1)

```java
class Solution {
    public void setZeroes(int[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int extraRow = 1;

        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (matrix[row][col] == 0) {
                    matrix[0][col] = 0;
                    if (row > 0) {
                        matrix[row][0] = 0;
                    } else {
                        extraRow = 0;
                    }
                }
            }
        }

        for (int row = 1; row < rows; row++) {
            for (int col = 1; col < cols; col++) {
                if (matrix[row][0] == 0 || matrix[0][col] == 0) {
                    matrix[row][col] = 0;
                }
            }
        }

        if (matrix[0][0] == 0) {
            for (int row = 1; row < rows; row++) {
                matrix[row][0] = 0;
            }
        }

        // need to count from col = 0
        if (extraRow == 0) {
            for (int col = 0; col < cols; col++) {
                matrix[0][col] = 0;
            }
        }
    }
}
```

## 20. 最小覆盖子串（LeetCode 76）

**题目**：给定两个字符串 s 和 t，长度分别是 m 和 n，返回 s 中的 最短窗口 子串，使得该子串包含 t 中的每一个字符（包括重复字符）。如果没有这样的子串，返回空字符串 ""。

### 滑动窗口

Time: O(n)  
Space: O(k)

```java
class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : t.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }
        int remaining = freq.size();   // 还需要多少种字符
        int left = 0, minStart = 0, minLen = Integer.MAX_VALUE;

        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            if (freq.containsKey(ch)) {
                freq.put(ch, freq.get(ch) - 1);
                if (freq.get(ch) == 0) remaining--;
            }

            while (remaining == 0) {          // 当前窗口已覆盖 t
                int windowLen = right - left + 1;
                if (windowLen < minLen) {
                    minLen = windowLen;
                    minStart = left;
                }

                char leftChar = s.charAt(left);
                if (freq.containsKey(leftChar)) {
                    freq.put(leftChar, freq.get(leftChar) + 1);
                    if (freq.get(leftChar) > 0) remaining++;
                }
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }
}
```

## 21. 单词搜索（LeetCode 79）

**题目**：给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。

### dfs 

Time: O(m*n*3^k)      
Space: O(m*n)

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        int rows = board.length;
        int cols = board[0].length;
        boolean[][] visit = new boolean[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, r, c, 0, visit)) return true;
            }
        }
        return false;
    }

    boolean dfs(char[][] board, String word, int r, int c, int i, boolean[][] visit) {
        if (i == word.length()) return true;
        int rows = board.length;
        int cols = board[0].length;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (visit[r][c] || board[r][c] != word.charAt(i)) return false;

        visit[r][c] = true;
        boolean found = dfs(board, word, r + 1, c, i + 1, visit)
                     || dfs(board, word, r, c + 1, i + 1, visit)
                     || dfs(board, word, r - 1, c, i + 1, visit)
                     || dfs(board, word, r, c - 1, i + 1, visit);
        visit[r][c] = false;
        return found;
    }
}
```

## 22. 解码方法（LeetCode 91）

**题目**：给你一个只含数字的 非空 字符串 s ，请计算并返回 解码 方法的 总数 。如果没有合法的方式解码整个字符串，返回 0。

### DP with digit verify

Time: O(n)      
Space: O(n)

```java
class Solution {
    public int numDecodings(String s) {
        int[] dp = new int[s.length() + 1];
        dp[0] = 1;

        for (int i = 1; i <= s.length(); i++) {
            if (s.charAt(i-1) != '0') {
                dp[i] = dp[i-1];
            }
            if (i >= 2) {
                char firstDigit = s.charAt(i - 2);
                char secondDigit = s.charAt(i - 1);
                if (firstDigit == '1' || 
                (firstDigit == '2' && 
                    secondDigit >= '0' && secondDigit <= '6')) {
                    dp[i] += dp[i - 2];
                }
            }
        }
        return dp[s.length()];
    }
}
```

## 23. 验证二叉搜索树（LeetCode 98）

**题目**：给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。

### Inorder Traversal

Time: O(n)      
Space: O(h)

```java
class Solution {
    private TreeNode pre = null;
    public boolean isValidBST(TreeNode root) {
        if (root == null) return true;

        // left -> root -> right
        if (!isValidBST(root.left)) return false;

        if (pre != null && pre.val >= root.val) return false;
        pre = root;

        return isValidBST(root.right);
    }
}
```

## 24. 相同的树（LeetCode 100）

**题目**：给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。

### recursion

Time: O(n)      
Space: O(h)

```java
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

## 25. 二叉树的层序遍历（LeetCode 102）

**题目**：给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）。

### BFS

Time: O(n)      
Space: O(n)

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        Queue<TreeNode> deque = new LinkedList<>();
        if (root != null) deque.offer(root);
        while (!deque.isEmpty()) {
            List<Integer> list = new ArrayList<>();

            int length = deque.size();
            for (int i = 0; i < length; i++) {
                TreeNode node = deque.poll();
                list.add(node.val);

                if (node.left != null) {
                    deque.add(node.left);
                }
                if (node.right != null) {
                    deque.add(node.right);
                }
            }
            res.add(list);
        }
        return res;
    }
}
```

## 26. 二叉树的最大深度（LeetCode 104）

**题目**：给定一个二叉树 root ，返回其最大深度。

### recursion

Time: O(n)      
Space: O(h)

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
}
```

## 27. 列构造二叉树（LeetCode 105）

**题目**：给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历， inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。

### HashMap

Time: O(n)      
Space: O(h)

```java
class Solution {
    Map<Integer, Integer> map = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) {
            map.put(inorder[i], i);
        }
        return build(preorder, 0, preorder.length - 1, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int preStart, int preEnd, int inStart, int inEnd) {
        if (preStart > preEnd || inStart > inEnd) return null;

        int rootVal = preorder[preStart];
        TreeNode root = new TreeNode(rootVal);
        int rootIndex = map.get(rootVal);
        int leftSize = rootIndex - inStart;

        root.left = build(preorder, preStart + 1, preStart + leftSize, inStart, rootIndex - 1);
        root.right = build(preorder, preStart + leftSize + 1, preEnd, rootIndex + 1, inEnd);
        return root;
    }
}
```

## 28. 买卖股票的最佳时机（LeetCode 121）

**题目**：给定一个数组 prices，其中 prices\[i\] 表示第 i 天的股票价格。你只能选择某一天买入，并在未来的某一天卖出，求能获得的最大利润。

### 一次遍历

Time: O(n)  
Space: O(1)

```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = prices[0], maxProfit = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] < minPrice) minPrice = prices[i];
            else if (prices[i] - minPrice > maxProfit) maxProfit = prices[i] - minPrice;
        }
        return maxProfit;
    }
}

```

## 29. 二叉树中的最大路径和（LeetCode 124）

**题目**：二叉树中的 路径 被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。

### res for global max, choose either left or right as return value

Time: O(n)      
Space: O(n)

```java
class Solution {
    private int res = Integer.MIN_VALUE;
    public int maxPathSum(TreeNode root) {
        dfs(root);
        return res;
    }

    private int dfs(TreeNode root) {
        if (root == null) return 0;

        int left = Math.max(0, dfs(root.left));
        int right = Math.max(0, dfs(root.right));

        res = Math.max(res, root.val + left + right);
        return root.val + Math.max(left, right);
    }
}
```

## 30. 验证回文串（LeetCode 125）

**题目**：给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，忽略字母的大小写。

### 双指针

Time: O(n)  
Space: O(1)

```java
class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
            left++;
            right--;
        }
        return true;
    }
}

```

## 31. Longest Consecutive Sequence（LeetCode 128）

**题目**：Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

### HashSet

Time: O(n)      
Space: O(n)

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        int max = 0;
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }
        for (int num : set) {
            if (!set.contains(num - 1)) {
                int count = 1;
                num++;
                while (set.contains(num)) {
                    count++;
                    num++;
                }
                max = Math.max(max, count);
            }
        }
        return max;
    }
}
```

## 32. Clone Graph（LeetCode 133）

**题目**：Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.

### DFS

Time: O(v + e)      
Space: O(v)

```java
class Solution {
    private Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        if (visited.containsKey(node)) {
            return visited.get(node);
        }

        Node clone = new Node(node.val);
        visited.put(node, clone);

        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }    

        return clone;
    }
}
```

## 33. 单词拆分（LeetCode 139）

**题目**：给你一个字符串 s 和一个字符串列表 wordDict 作为字典。如果可以利用字典中出现的一个或多个单词拼接出 s 则返回 true。

### dp

Time: O(n*m*l)      
Space: O(n)

```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;

        for (int i = 0; i < n; i++) {
            if (!dp[i]) continue;
            for (String word : wordDict) {
                int end = i + word.length();
                if (end <= n && s.substring(i, end).equals(word)) {
                    dp[end] = true;
                }
            }
        }
        return dp[n];
    }
}
```

## 34. 环形链表（LeetCode 141）

**题目**：给你一个链表的头节点 head ，判断链表中是否有环。

### Slow + Fast Pointers

Time: O(n)       
Space: O(1)

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null) return false;
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}
```

## 35. 重排链表（LeetCode 143）

**题目**：给定一个单链表 L 的头节点 head ，单链表 L 表示为：

L0 → L1 → … → Ln - 1 → Ln
请将其重新排列后变为：

L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …
不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。 

### Slow Fast Pointers + Reverse Merge

Time: O(n)      
Space: O(1)

```java
class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        ListNode slow = head;
        ListNode fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        ListNode second = slow.next;
        slow.next = null;
        second = reverseList(second);

        ListNode first = head;
        while (second != null) {
            ListNode nextFirst = first.next;
            ListNode nextSecond = second.next;
            first.next = second;
            second.next = nextFirst;
            first = nextFirst;
            second = nextSecond;
        }
    }

    private ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}
```

## 36. 乘积最大子数组（LeetCode 152）

**题目**：给你一个整数数组 nums，请你找出数组中乘积最大的连续子数组，并返回该子数组的乘积。

### 动态规划（维护最大最小）

Time: O(n)  
Space: O(1)

```java
class Solution {
    public int maxProduct(int[] nums) {
        int max = nums[0], min = nums[0], res = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < 0) {
                int tmp = max;
                max = min;
                min = tmp;
            }
            max = Math.max(nums[i], max * nums[i]);
            min = Math.min(nums[i], min * nums[i]);
            res = Math.max(res, max);
        }
        return res;
    }
}

```

## 37. 寻找旋转排序数组中的最小值（LeetCode 153）

**题目**：已知一个长度为 n 的升序数组，在未知点进行了旋转。请找出数组中的最小元素。

### 修改的二分查找

Time: O(logn)   
Space: O(1)

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) left = mid + 1;
            else right = mid;
        }
        return nums[left];
    }
}

```

## 38. 颠倒二进制位（LeetCode 190）

**题目**：颠倒给定的 32 位有符号整数的二进制位。

### bit operation

Time: O(1)      
Space: O(1)

```java
class Solution {
    public int reverseBits(int n) {
        int res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | ((n >> i) & 1);
        }
        return res;
    }
}
```

## 39. 位1的个数（LeetCode 191）

**题目**：给定一个正整数 n，编写一个函数，获取一个正整数的二进制形式并返回其二进制表达式中 设置位 的个数（也被称为汉明重量）。

### n &= (n-1) -> 消掉最右边的1

Time: O(1)      
Space: O(1)

```java
class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n-1);
            count++;
        }
        return count;
    }
}
```

## 40. 打家劫舍（LeetCode 198）

**题目**：你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

### DP

Time: O(n)      
Space: O(1)

```java
class Solution {
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int prev1 = 0;  // dp[i-1]
        int prev2 = 0;  // dp[i-2]

        for (int num : nums) {
            int cur = Math.max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
```

## 41. Number of Islands（LeetCode 200）

**题目**：Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

### BFS

Time: O(r*c)      
Space: O(r*c)

```java
class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];
        int count = 0;

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == '1' && !visited[i][j]) {
                    count++;
                    bfs(grid, i, j, visited);
                }
            }
        }
        return count;
    }

    private void bfs(char[][] grid, int row, int col, boolean[][] visited) {
        int rows = grid.length;
        int cols = grid[0].length;

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{row, col});
        visited[row][col] = true;

        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int[] cur = queue.poll();
            int r = cur[0];
            int c = cur[1];

            for (int[] d : dirs) {
                int nr = r + d[0];
                int nc = c + d[1];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] == '1') {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
    }
}
```

## 42. 反转链表（LeetCode 206）

**题目**：给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

### Three Pointers

Time: O(n)  
Space: O(1)

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;

        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}
```

## 43. 打家劫舍 II（LeetCode 213）

**题目**：你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都 围成一圈 ，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警 。

### DP twice to break the loop

Time: O(n)      
Space: O(1)

```java
class Solution {
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];

        int case1 = robHelper(nums, 0, nums.length - 1);
        int case2 = robHelper(nums, 1, nums.length);

        return Math.max(case1, case2);
    }

    private int robHelper(int[] nums, int start, int end) {
        int prev1 = 0;  // dp[i-1]
        int prev2 = 0;  // dp[i-2]
        for (int i = start; i < end; i++) {
            int cur = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
```

## 44. 存在重复元素（LeetCode 217）

**题目**：给定一个整数数组，判断是否存在重复元素。如果存在一值在数组中出现至少两次，返回 true；否则返回 false。

### 哈希表

Time: O(n)  
Space: O(n)

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            if (!set.add(num)) return true;
        }
        return false;
    }
}

```

## 45. 翻转二叉树（LeetCode 226）

**题目**：给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点。

### recursion

Time: O(n)      
Space: O(h)

```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return root;
        
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);

        root.left = right;
        root.right = left;

        return root;
    }
}
```

## 46. 二叉搜索树中第 K 小的元素（LeetCode 230）

**题目**：给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 小的元素（k 从 1 开始计数）。

### Stack

Time: O(n)      
Space: O(h)

```java
class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Stack<TreeNode> stack = new Stack<>();
        TreeNode cur = root;
        int count = 0;
        
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            count++;
            if (count == k) return cur.val;  
            cur = cur.right;
        }
        return -1;
    }
}
```

## 47. 二叉搜索树的最近公共祖先（LeetCode 235）

**题目**：给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

### left -> right

Time: O(h)      
Space: O(h)

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root.val > p.val && root.val > q.val) {
            return lowestCommonAncestor(root.left, p, q);
        } else if (root.val < p.val && root.val < q.val) {
            return lowestCommonAncestor(root.right, p, q);
        } else {
            return root;
        }
    }
}
```

## 48. 二叉树的最近公共祖先（LeetCode 236）

**题目**：给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

### Postorder Traversal

Time: O(n)      
Space: O(h)

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}
```

## 49. 除了自身以外数组的乘积（LeetCode 238）

**题目**：给你一个整数数组 nums，返回数组 answer，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。题目保证数组元素乘积在 32 位整数范围内。

### 前缀积 + 后缀积（空间 O(1)）

Time: O(n)  
Space: O(1)（不考虑返回数组）

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int[] res = new int[nums.length];
        res[0] = 1;
        for (int i = 1; i < nums.length; i++) {
            res[i] = res[i - 1] * nums[i - 1];
        }
        int suffix = 1;
        for (int i = nums.length - 1; i >= 0; i--) {
            res[i] *= suffix;
            suffix *= nums[i];
        }
        return res;
    }
}

```

## 50. 有效的字母异位词（LeetCode 242）

**题目**：给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

### 计数数组

Time: O(n)  
Space: O(1)

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (char c : s.toCharArray()) counts[c - 'a']++;
        for (char c : t.toCharArray()) counts[c - 'a']--;
        for (int count : counts) if (count != 0) return false;
        return true;
    }
}

```

## 51. 二叉树的序列化与反序列化（LeetCode 297）

**题目**：请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

### BFS

Time: O(n)      
Space: O(n)

```java
public class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        if (root == null) return "";
        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                sb.append("null,");
                continue;
            }
            sb.append(node.val).append(",");
            queue.offer(node.left);
            queue.offer(node.right);
        }
        sb.setLength(sb.length() - 1);  // remove the last comma
        return sb.toString();
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        String[] vals = data.split(",");
        TreeNode root = new TreeNode(Integer.parseInt(vals[0]));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (!vals[i].equals("null")) {          // left node
                node.left = new TreeNode(Integer.parseInt(vals[i]));
                queue.offer(node.left);
            }
            i++;
            if (!vals[i].equals("null")) {          // right node 
                node.right = new TreeNode(Integer.parseInt(vals[i]));
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
}
```

## 52. 零钱兑换（LeetCode 322）

**题目**：给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。

### DP for both amount and coins value

Time: O(a*c)      
Space: O(a)

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);

        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int j = 0; j < coins.length; j++) {
                if (i - coins[j] >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
                }
            }
        }
        
        if (dp[amount] == amount + 1) {
            return -1;
        } else {
            return dp[amount];
        }
    }
}
```

## 53. 比特位计数（LeetCode 338）

**题目**：给你一个整数 n ，对于 0 <= i <= n 中的每个 i ，计算其二进制表示中 1 的个数 ，返回一个长度为 n + 1 的数组 ans 作为答案。

### dynamic programming

Time: O(n)      
Space: O(1)

```java
class Solution {
    public int[] countBits(int n) {
        int[] res = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            res[i] = res[i >> 1] + (i & 1);
        }
        return res;
    }
}
```

## 54. 两整数之和（LeetCode 371）

**题目**：给你两个整数 a 和 b ，不使用 运算符 + 和 - ​​​​​​​，计算并返回两整数之和。

### XOR + AND

Time: O(1)      
Space: O(1)

```java
class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int temp_add = a ^ b;
            int temp_carry = (a & b) << 1;
            a = temp_add;
            b = temp_carry;
        } 
        return a;
    }
}
```

## 55. 另一棵树的子树（LeetCode 572）

**题目**：给你两棵二叉树 root 和 subRoot 。检验 root 中是否包含和 subRoot 具有相同结构和节点值的子树。如果存在，返回 true ；否则，返回 false 。

### recursion

Time: O(m*n)      
Space: O(h)

```java
class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (subRoot == null) return true;
        if (root == null) return false;
        if (isSameTree(root, subRoot)) return true;
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }

    boolean isSameTree(TreeNode root, TreeNode subRoot) {
        if (root == null && subRoot == null) return true;
        if (root == null || subRoot == null) return false;
        if (root.val != subRoot.val) return false;
        return isSameTree(root.left, subRoot.left) && isSameTree(root.right, subRoot.right);
    }
}
```

## 56. 回文子串（LeetCode 647）

**题目**：给你一个字符串 s，请你统计并返回这个字符串中 回文子串 的数目。

### Manacher 算法

Time: O(n)  
Space: O(n)

```java
class Solution {
    public int countSubstrings(String s) {
        // convert s to odd length
        StringBuilder sb = new StringBuilder("^#");
        for (char c : s.toCharArray()) {
            sb.append(c).append("#");
        }
        sb.append("$");
        s = sb.toString();

        int[] p = new int[s.length()];
        int center = 0;
        int right = 0;
        int count = 0;

        for (int i = 1; i < s.length() - 1; i++) {
            int mirror = 2 * center - i;

            if (i < right) {
                p[i] = Math.min(right - i, p[mirror]);
            }

            while (s.charAt(i + p[i] + 1) == s.charAt(i - p[i] - 1)) {
                p[i]++;
            }
            
            if (i + p[i] > right) {
                center = i;
                right = i + p[i];
            }
            count += (p[i] + 1) / 2;
        }
        return count;
    }
}
```

## 57. 最长公共子序列（LeetCode 1143）

**题目**：给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。

### dp

Time: O(n*m)      
Space: O(n*m)

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int n = text1.length();
        int m = text2.length();
        int[][] dp = new int[n + 1][m + 1];

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (text1.charAt(i-1) == text2.charAt(j-1)) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        return dp[n][m];
    }
}
```

## 58. Course Schedule（LeetCode 207）

**题目**：There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

### Topological sorting

Time: O(v+e)      
Space: O(v+e)

```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }

        int[] indegree = new int[numCourses];

        for (int[] p : prerequisites) {
            int a = p[0];
            int b = p[1];
            graph.get(b).add(a);
            indegree[a]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }

        int count = 0;
        
        while (!queue.isEmpty()) {
            int cur = queue.poll();
            count++;

            for (int next : graph.get(cur)) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    queue.offer(next);
                }
            }
        }
        return count == numCourses;   
    }
}
```

## 59. Implement Trie (Prefix Tree)（LeetCode 208）

**题目**：A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

### Use Array with size 26

```java
class Trie {
    private TrieNode root;

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    public Trie() {
        root = new TrieNode();
    }
    
    //  Time: O(l)      
    //  Space: O(l)
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) {
                node.children[i] = new TrieNode();
            }
            node = node.children[i];
        }
        node.isEnd = true;
    }
    
    //  Time: O(l)      
    //  Space: O(1)
    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) {
                return false;
            }
            node = node.children[i];
        }
        return node.isEnd;
    }
    
    //  Time: O(l)      
    //  Space: O(1)
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) {
                return false;
            }
            node = node.children[i];
        }
        return true;
    }
}
```

## 60. Design Add and Search Words Data Structure（LeetCode 211）

**题目**：Design a data structure that supports adding new words and finding if a string matches any previously added string.

### Use Array with size 26

```java
class WordDictionary {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isWord;
    }

    private final TrieNode root;

    public WordDictionary() {
        root = new TrieNode();
    }
    
    //  Time: O(l)      
    //  Space: O(l)
    public void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) {
                node.children[i] = new TrieNode();
            }
            node = node.children[i];
        }
        node.isWord = true;
    }
    
    //  Time: O(l)      
    //  Space: O(26^l)
    public boolean search(String word) {
        return dfs(word, 0, root);
    }

    private boolean dfs(String word, int index, TrieNode node) {
        if (node == null) return false;
        if (index == word.length()) return node.isWord;

        char c = word.charAt(index);

        if (c == '.') {
            for (TrieNode child : node.children) {
                if (child != null && dfs(word, index + 1, child)) {
                    return true;
                }
            }
            return false;
        } else {
            int i = c - 'a';
            return dfs(word, index + 1, node.children[i]);
        }
    }
}
```

## 61. Word Search II（LeetCode 212）

**题目**：Given an m x n board of characters and a list of strings words, return all words on the board.

### Trie

```java
class Solution {
    private int m, n;
    private int[] dirs = {-1, 0, 1, 0, -1};

    class TrieNode {
            TrieNode[] children = new TrieNode[26];
            String word;
        }

    public List<String> findWords(char[][] board, String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode node = root;
            for (char c : w.toCharArray()) {
                int i = c - 'a';
                if (node.children[i] == null) {
                    node.children[i] = new TrieNode();
                }
                node = node.children[i];
            }
            node.word = w;
        }
        List<String> ans = new ArrayList<>();
        m = board.length;
        n = board[0].length;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                dfs(board, i, j, root, ans);
            }
        }
        return ans;
    }
    
    private void dfs(char[][] board, int i, int j, TrieNode node, List<String> ans) {
        char c = board[i][j];
        if (c == '#' || node.children[c - 'a'] == null) return;
        TrieNode next = node.children[c - 'a'];
        if (next.word != null) {
            ans.add(next.word);
            next.word = null;
        }
        board[i][j] = '#';

        for (int d = 0; d < 4; d++) {
            int ni = i + dirs[d];
            int nj = j + dirs[d+1];
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] != '#') {
                dfs(board, ni, nj, next, ans);
            }
        }
        board[i][j] = c;
        if (isEmpty(next)) {
            node.children[c - 'a'] = null;
        }
    }
    private boolean isEmpty(TrieNode node) {
            for (TrieNode child : node.children) {
                if (child != null) return false;
            }
            return true;
        }
}
```

## 62. Contains Duplicate（LeetCode 217）

**题目**：Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

### Set

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            if (!set.add(num)) {
                return true;
            }
        }
        return false;
    }
}
```

## 63. Find Median from Data Stream（LeetCode 295）

**题目**：The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

### Maintain two heaps

```java
class MedianFinder {
    private PriorityQueue<Integer> small;
    private PriorityQueue<Integer> large;

    public MedianFinder() {
        small = new PriorityQueue<>(Collections.reverseOrder());
        large = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        small.offer(num);

        large.offer(small.poll());

        if (large.size() > small.size()) {
            small.offer(large.poll());
        }
    }
    
    public double findMedian() {
        if (small.size() > large.size()) {
            return small.peek();
        }
        return (small.peek() + large.peek()) / 2.0; 
    }
}
```

## 64. Top K Frequent Elements（LeetCode 347）

**题目**：Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

### Heap

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int num : nums) {
            map.compute(num, (key, v) -> v == null ? 1 : v + 1);
        }
        
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        for (Map.Entry<Integer, Integer> e : map.entrySet()) {
            heap.offer(new int[]{e.getKey(), e.getValue()});
            if (heap.size() > k) {
                heap.poll();
            }
        }

        int[] ans = new int[k];
        for (int i = 0; i < k; i++) {
            ans[i] = heap.poll()[0];
        }
        return ans;
    }
}
```