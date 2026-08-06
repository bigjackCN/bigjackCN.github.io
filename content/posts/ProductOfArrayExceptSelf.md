+++
date = '2026-08-05T21:35:19+08:00'
draft = false
title = "除了自身以外数组的乘积(Product Of Array Except Self)"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/product-of-array-except-self.png)

### Prefix + Suffix Array
Time: O(n)  
Space: O(n)
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int[] prefix = new int[nums.length];
        prefix[0] = 1;
        for (int i = 1; i < nums.length; i++) {
            prefix[i] = prefix[i-1] * nums[i-1];
        }
        int[] suffix = new int[nums.length];
        suffix[nums.length-1] = 1;
        for (int i = nums.length - 2; i >= 0 ; i--) {
            suffix[i] = suffix[i+1] * nums[i+1];
        }
        int[] res = new int[nums.length];
        for (int i = 0; i < res.length; i++) {
            res[i] = prefix[i] * suffix[i]; 
        }
        return res;
    }
}
```

### No Extra Space
Time: O(n)  
Space: O(1)
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int[] res = new int[nums.length];
        
        res[0] = 1;
        for (int i = 1; i < nums.length; i++) {
            res[i] = res[i-1] * nums[i-1];
        }

        int suffix = 1; 
        for (int i = nums.length - 1; i >= 0; i--) {
            res[i] = res[i] * suffix; 
            suffix *= nums[i]; 
        }
        return res;
    }
}
```

### Handle For Zero Case
Time: O(n)  
Space: O(1)
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        // handle zero case
        int zeroCount = 0;
        for (int num : nums) {
            if (num == 0) zeroCount++;
        }

        if (zeroCount == 1) {
            return oneZeroHelper(nums);
        }
        
        if (zeroCount >= 2) {
            return new int[nums.length];
        }
        
        int[] res = new int[nums.length];
        res[0] = 1;
        for (int i = 1; i < nums.length; i++) {
            res[i] = res[i-1] * nums[i-1];
        }

        int suffix = 1; 
        for (int i = nums.length - 1; i >= 0; i--) {
            res[i] = res[i] * suffix; 
            suffix *= nums[i]; 
        }
        return res;
    }

    public int[] oneZeroHelper(int[] nums) {
        int acc = 1;
        int zeroIndex = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                acc *= nums[i];
            } else {
                zeroIndex = i;
            }
        }
        int[] res = new int[nums.length];
        res[zeroIndex] = acc;
        return res;
    }
}
```