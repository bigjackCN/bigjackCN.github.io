+++
date = '2026-08-13T22:00:05+08:00'
draft = false
title = "有效的括号"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/valid-parentheses.png)

### Stack
Time: O(n)  
Space: O(n)

```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();

        for (char c : s.toCharArray()) {
            if (c == '(') {
                stack.push(')');
            } else if (c == '{') {
                stack.push('}');
            } else if (c == '[') {
                stack.push(']');
            } else if (stack.isEmpty() || stack.pop() != c) {
                    return false;
            }
        }
        return stack.isEmpty();
    }
}
```