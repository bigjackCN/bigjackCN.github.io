+++
date = '2026-08-03T20:51:09+08:00'
draft = false
title = "买卖股票的最佳时机(Best Time To Buy And Sell Stock)"
tags = ["Java", "LeetCode", "Blind 75"]
categories = ["学习"]

[cover]
image = ""
alt = ""
caption = ""
+++

![problem summary](/images/best-time-to-buy-and-sell-stock.png)

### Brute Force 
Time: O(n^2)  
Space: O(1)
```java
class Solution {
    public int maxProfit(int[] prices) {
        int maxProfit = 0;
        for (int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                int profit = prices[j] - prices[i];
                if (profit > maxProfit) {
                    maxProfit = profit;
                }
            }
        }
        return maxProfit;
    }
}
```

### Heuristic
Time: O(n)  
Space: O(1)
```java
class Solution {
    public int maxProfit(int[] prices) {
        int boughtPrice = prices[0];
        int maxProfit = 0;
        for (int i = 1; i < prices.length; i++) {
            int sellPrice = prices[i];
            if ((sellPrice - boughtPrice) > maxProfit) {
                maxProfit = sellPrice - boughtPrice;
            }
            if (sellPrice < boughtPrice) {
                boughtPrice = sellPrice;
            }
        }
        return maxProfit;
    }
}
```