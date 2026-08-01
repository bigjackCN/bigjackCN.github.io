+++
date = '2026-08-01T13:14:41+08:00'
draft = false
title = "存在重复元素(Contains Duplicate)"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/contains-duplicate.png)

### Brute Force 
Time: O(n^2)  
Space: O(1)
```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] == nums[j]) {
                    return true;
                }
            }
        }
        return false;
    }
}
```

### Array Sort
Time: O(nlogn)  
Space: O(logn)
```java
import java.util.Arrays;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Arrays.sort(nums);
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == nums[i-1]) {
                return true;
            }
        }
        return false;
    }
}
```

### HashSet
Time: O(n)  
Space: O(n)
```java
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        // avoid resizing
        int capacity = (int) (nums.length / 0.75f) + 1;
        Set<Integer> set = new HashSet<>(capacity);

        for (int num : nums) {
            // add return false if element exists
            if (!set.add(num)) {
                return true;
            }
        }
        return false;
    }
}
```
