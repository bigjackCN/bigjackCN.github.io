+++
date = '2026-08-09T22:01:46+08:00'
draft = false
title = "盛最多水的容器"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/container-with-most-water.png)

### Two Pointers
Time: O(n)  
Space: O(1)

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int max = 0;

        while (left < right) {
            int current = (right - left) * Math.min(height[left], height[right]);
            
            if (current > max) max = current;

            if (height[left] < height[right]) {
                left += 1;
            } else {
                right -= 1;
            }
        }
        return max;
    }
}
```
