+++
date = '2026-08-09T06:55:36+08:00'
draft = false
title = "三数之和"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/three-sum.png)

### Sorting + Two Pointers
Time: O(n^2)  
Space: O(1)
```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);

        for (int i = 0; i <= nums.length - 3; i++) {
            // pruning for threeSum > 0
            if (nums[i] > 0) break;

            // remove current duplicate number
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            // if current and next two number sum > 0, then no upcoming solutions
            if (nums[i] + nums[i+1] + nums[i+2] > 0) break;
            // if current and two largest number sum < 0, then no solution for current number
            if (nums[i] + nums[nums.length - 1] + nums[nums.length - 2] < 0) continue;

            int left = i + 1;
            int right = nums.length - 1;
            int target = -nums[i];
            
            while (left < right) {
                int sum = nums[left] + nums[right];
                if (sum == target) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                
                    // avoid duplicate number
                    while (left < right && nums[left] == nums[left+1]) left++;
                    while (left < right && nums[right] == nums[right-1]) right--;
                    left++;
                    right--;
                } else if (sum > target) {
                    right--;
                } else {
                    left++;
                }
            }
        }
        return res;
    }
}
```