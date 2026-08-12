+++
date = '2026-08-11T22:24:15+08:00'
draft = false
title = "乘积最大子数组"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/maximum-product-subarray.png)

### Dynamic Programming
Time: O(n)  
Space: O(1)

```java
class Solution {
    public int maxProduct(int[] nums) {
        if (nums.length == 1) return nums[0];

        int max = nums[0];
        int min = nums[0];
        int res = nums[0];  // res maintain global max

        for (int i = 1; i < nums.length; i++) {
            // swap max & min when nums[i] is negative
            if (nums[i] < 0) {
                int tmp = max;
                max = min;
                min = tmp;
            }
            max = Math.max(nums[i], nums[i] * max);
            min = Math.min(nums[i], nums[i] * min);
            res = Math.max(res, max);
        }
        return res;
    }
}
```