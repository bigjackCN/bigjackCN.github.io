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

## 5. 有效的括号（LeetCode 20）

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

## 6. 搜索旋转排序数组（LeetCode 33）

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

## 7. 字母异位词分组（LeetCode 49）

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

## 8. 最大子数组和（LeetCode 53）

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

## 9. 买卖股票的最佳时机（LeetCode 121）

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

## 10. 验证回文串（LeetCode 125）

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

## 11. 乘积最大子数组（LeetCode 152）

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

## 12. 寻找旋转排序数组中的最小值（LeetCode 153）

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

## 13. 存在重复元素（LeetCode 217）

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

## 14. 除了自身以外数组的乘积（LeetCode 238）

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

## 15. 有效的字母异位词（LeetCode 242）

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

## 16. 回文子串（LeetCode 647）

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

## 17. 最小覆盖子串（LeetCode 76）

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

## 18.反转链表（LeetCode 206）

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

## 19.环形链表（LeetCode 141）

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

## 20.合并两个有序链表（LeetCode 21）

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

## 21.合并 K 个升序链表（LeetCode 23）

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

## 22.删除链表的倒数第 N 个结点（LeetCode 19）

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

## 23.重排链表（LeetCode 143）

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

## 24.两整数之和（LeetCode 371）

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

## 25.位1的个数（LeetCode 191）

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

## 26.比特位计数（LeetCode 338）

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

## 27.颠倒二进制位（LeetCode 190）

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

## 28.矩阵置零（LeetCode 73）

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

## 29.螺旋矩阵（LeetCode 54）

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

## 30.旋转图像（LeetCode 48）

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

## 31.单词搜索（LeetCode 79）

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

## 32.二叉树的最大深度（LeetCode 104）

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
