+++
date = '2026-08-12T21:26:15+08:00'
draft = false
title = "字母异位词分组"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/group-anagrams.png)

### Use Array To Count
Time: O(nk)  
Space: O(n)

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> hashmap = new HashMap<>();

        for (String str : strs) {
            int[] counts = new int[26];
            for (char c : str.toCharArray()) {
                counts[c - 'a']++;
            }
            StringBuilder s = new StringBuilder();
            for (int count : counts) {
                // '#' split for each character
                s.append(count).append('#');
            }
            String key = s.toString();
            hashmap.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
        }
        return new ArrayList<>(hashmap.values());
    }
}
```