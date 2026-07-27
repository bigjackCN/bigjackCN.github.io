+++
date = '2026-07-26T23:26:46-04:00'
draft = false
title = "两数之和(Two Sum)"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/static/images/two-sum.png)

### Brute Force 
Time: O(n^2)  
Space: O(1)
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        
        for (int i = 0; i < nums.length - 1; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{-1, -1};
    }
}
```

### Hash Map
Time: O(n)  
Space: O(n)

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> hash = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int toFind = target - nums[i];
            if (hash.containsKey(toFind)) {
                return new int[] {hash.get(toFind), i};
            }
            hash.put(nums[i], i);
        }
        return new int[] {-1, -1};
    }
}
```
