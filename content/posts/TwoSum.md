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

![problem summary](/images/two-sum.png)

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
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // avoid resizing
        int capacity = (int) (nums.length / 0.75f) + 1;
        Map<Integer, Integer> map = new HashMap<>(capacity);

        for (int i = 0; i < nums.length; i++) {
            int toFind = target - nums[i];
            if (map.containsKey(toFind)) {
                return new int[] {map.get(toFind), i};
            }
            map.put(nums[i], i);
        }
        return new int[] {-1, -1};
    }
}
```
