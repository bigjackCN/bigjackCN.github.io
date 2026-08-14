+++
date = '2026-08-14T23:03:12+08:00'
draft = false
title = "回文子串"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/palindromic-substring.png)

### Manacher Algorithm
Time: O(n)  
Space: O(n)

```java
class Solution {
    public int countSubstrings(String s) {
        // Transform: "abc" -> "^#a#b#c#$"
        StringBuilder sb = new StringBuilder("^#");
        for (char c : s.toCharArray()) {
            sb.append(c).append("#");
        }
        sb.append("$");
        String t = sb.toString();
        int n = t.length();
        
        int[] p = new int[n]; // p[i] = radius steps (excluding center)
        int center = 0;
        int right = 0;
        int count = 0;
        
        for (int i = 1; i < n - 1; i++) {
            // Mirror index
            int mirror = 2 * center - i;
            
            // If within current right boundary, use mirrored value
            if (i < right) {
                p[i] = Math.min(right - i, p[mirror]);
            }
            
            // Expand around center i (sentinels avoid bound checks)
            while (t.charAt(i + p[i] + 1) == t.charAt(i - p[i] - 1)) {
                p[i]++;
            }
            
            // Update center and right boundary
            if (i + p[i] > right) {
                center = i;
                right = i + p[i];
            }
            
            // Count palindromes centered at i
            // In transformed string, every radius step contributes 1 palindrome in original
            count += (p[i] + 1) / 2;
        }
        
        return count;
    }
}
```