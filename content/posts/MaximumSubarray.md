+++
date = '2026-08-10T21:48:37+08:00'
draft = false
title = "最大子数组和"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/maximum-subarray.png)

### Kadane Algorithm (DP)
Time: O(n)  
Space: O(1)

```java
class Solution {
    public int maxSubArray(int[] nums) {
        if (nums.length == 1) return nums[0];
        
        int acc = 0;
        int max = nums[0];
        for (int num : nums) {
            acc += num;

            // handle num all negative case
            if (num > max) {
                max = num;
            }
            if (acc < 0) {
                acc = 0;
                continue;
            }
            if (acc > max) {
                max = acc;
            }
        }
        return max;
    }
}
```