+++
date = '2026-08-06T21:28:07+08:00'
draft = false
title = "寻找旋转排序数组中的最小值"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/find-minimum-in-rotated-sorted-array.png)

### Modified Binary Search
Time: O(logn)  
Space: O(1)
```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return nums[left];
    }
}
```