/* Problems 5/5: heap, greedy, dynamic programming, tricks (+ a few classics). */
(function () {
  var P = JK.P, t = JK.t, h = JK.h, R = JK.R, dt = JK.dt, dh = JK.dh;
  function rep(s, n) { var r = ''; for (var i = 0; i < n; i++) r += s; return r; }

  /* ------------------------------------------------------------ heap */
  P({
    n: 215, title: 'Kth Largest Element in an Array', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code>th largest element in the array. Note that it is the <code>k</code>th largest element in sorted order, not the <code>k</code>th distinct element.</p>',
    ex: [['nums = [3,2,1,5,6,4], k = 2', '5'], ['nums = [3,2,3,1,2,4,5,5,6], k = 4', '4']],
    sig: 'int findKthLargest(int[] nums, int k)',
    tests: [
      t([[3, 2, 1, 5, 6, 4], 2], 5), t([[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], 4),
      h([[1], 1], 1), h([[7, 6, 5], 3], 5), h([[-1, -1], 2], -1),
      h([R('JKRT.range(1,100000)', '[1..100000]'), 1], 100000, 'nums = [1..100000], k = 1')
    ]
  });

  P({
    n: 347, title: 'Top K Frequent Elements', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return the <code>k</code> most frequent elements. You may return the answer in any order. The answer is guaranteed to be unique.</p>',
    ex: [['nums = [1,1,1,2,2,3], k = 2', '[1,2]'], ['nums = [1], k = 1', '[1]']],
    sig: 'int[] topKFrequent(int[] nums, int k)', cmp: 'unordered',
    tests: [
      t([[1, 1, 1, 2, 2, 3], 2], [1, 2]), t([[1], 1], [1]),
      h([[4, 4, 4, 5, 5, 6], 1], [4]), h([[1, 2], 2], [1, 2]), h([[-1, -1, 2, 2, 2, 3], 1], [2])
    ]
  });

  P({
    n: 295, title: 'Find Median from Data Stream', diff: 'Hard',
    desc: '<p>The median is the middle value in an ordered integer list. If the size of the list is even, the median is the mean of the two middle values.</p><p>Implement <code>MedianFinder()</code>; <code>void addNum(int num)</code> adds the integer to the data structure; <code>double findMedian()</code> returns the median of all elements so far.</p>',
    ex: [['["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', '[null,null,null,1.5,null,2.0]']],
    design: { ctor: 'MedianFinder()', methods: ['void addNum(int num)', 'double findMedian()'] },
    tests: [
      dt(['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'], [[], [1], [2], [], [3], []], [null, null, null, R('1.5', '1.5'), null, R('2.0', '2.0')]),
      dh(['MedianFinder', 'addNum', 'findMedian', 'addNum', 'findMedian'], [[], [5], [], [8], []], [null, null, R('5.0', '5.0'), null, R('6.5', '6.5')]),
      dh(['MedianFinder', 'addNum', 'findMedian', 'addNum', 'findMedian', 'addNum', 'findMedian', 'addNum', 'findMedian', 'addNum', 'findMedian'],
        [[], [-1], [], [-2], [], [-3], [], [-4], [], [-5], []],
        [null, null, R('-1.0', '-1.0'), null, R('-1.5', '-1.5'), null, R('-2.0', '-2.0'), null, R('-2.5', '-2.5'), null, R('-3.0', '-3.0')])
    ]
  });

  /* ------------------------------------------------------------ greedy */
  P({
    n: 121, title: 'Best Time to Buy and Sell Stock', diff: 'Easy',
    desc: '<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>th day. You want to maximize your profit by choosing a single day to buy and a different, later day to sell. Return the maximum profit you can achieve, or <code>0</code> if no profit is possible.</p>',
    ex: [['prices = [7,1,5,3,6,4]', '5', 'Buy on day 2 (price 1) and sell on day 5 (price 6).'], ['prices = [7,6,4,3,1]', '0']],
    sig: 'int maxProfit(int[] prices)',
    tests: [
      t([[7, 1, 5, 3, 6, 4]], 5), t([[7, 6, 4, 3, 1]], 0),
      h([[1]], 0), h([[2, 4, 1]], 2), h([[3, 2, 6, 5, 0, 3]], 4),
      h([R('JKRT.range(1,100000)', '[1..100000]')], 99999, 'prices = [1..100000]'),
      h([R('JKRT.rangeDesc(100000,1)', '[100000..1]')], 0, 'prices = [100000..1]')
    ]
  });

  P({
    n: 55, title: 'Jump Game', diff: 'Medium',
    desc: '<p>You are given an integer array <code>nums</code>. You are initially positioned at the array\'s first index, and each element represents your maximum jump length at that position. Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.</p>',
    ex: [['nums = [2,3,1,1,4]', 'true'], ['nums = [3,2,1,0,4]', 'false']],
    sig: 'boolean canJump(int[] nums)',
    tests: [
      t([[2, 3, 1, 1, 4]], true), t([[3, 2, 1, 0, 4]], false),
      h([[0]], true), h([[0, 1]], false), h([[2, 0, 0]], true), h([[1, 1, 1, 1, 0]], true)
    ]
  });

  P({
    n: 45, title: 'Jump Game II', diff: 'Medium',
    desc: '<p>You are given a 0-indexed array of integers <code>nums</code> of length <code>n</code>. You are initially positioned at <code>nums[0]</code>. Each element <code>nums[i]</code> represents the maximum length of a forward jump from index <code>i</code>. Return the minimum number of jumps to reach <code>nums[n - 1]</code>. The test cases are generated such that you can reach <code>nums[n - 1]</code>.</p>',
    ex: [['nums = [2,3,1,1,4]', '2'], ['nums = [2,3,0,1,4]', '2']],
    sig: 'int jump(int[] nums)',
    tests: [
      t([[2, 3, 1, 1, 4]], 2), t([[2, 3, 0, 1, 4]], 2),
      h([[1]], 0), h([[1, 2]], 1), h([[1, 1, 1, 1]], 3), h([[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 0]], 2)
    ]
  });

  P({
    n: 763, title: 'Partition Labels', diff: 'Medium',
    desc: '<p>You are given a string <code>s</code>. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.</p>',
    ex: [['s = "ababcbacadefegdehijhklij"', '[9,7,8]'], ['s = "eccbbbbdec"', '[10]']],
    sig: 'List<Integer> partitionLabels(String s)',
    tests: [
      t(['ababcbacadefegdehijhklij'], [9, 7, 8]), t(['eccbbbbdec'], [10]),
      h(['a'], [1]), h(['abc'], [1, 1, 1]), h(['caedbdedda'], [1, 9])
    ]
  });

  /* ------------------------------------------------------------ dynamic programming */
  P({
    n: 70, title: 'Climbing Stairs', diff: 'Easy',
    desc: '<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?</p>',
    ex: [['n = 2', '2'], ['n = 3', '3']],
    sig: 'int climbStairs(int n)',
    tests: [t([2], 2), t([3], 3), t([5], 8), h([1], 1), h([10], 89), h([45], 1836311903)]
  });

  P({
    n: 118, title: "Pascal's Triangle", diff: 'Easy',
    desc: '<p>Given an integer <code>numRows</code>, return the first <code>numRows</code> rows of Pascal\'s triangle. In Pascal\'s triangle, each number is the sum of the two numbers directly above it.</p>',
    ex: [['numRows = 5', '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]'], ['numRows = 1', '[[1]]']],
    sig: 'List<List<Integer>> generate(int numRows)',
    tests: [
      t([5], [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]), t([1], [[1]]), t([2], [[1], [1, 1]]),
      h([6], [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]]), h([3], [[1], [1, 1], [1, 2, 1]])
    ]
  });

  P({
    n: 198, title: 'House Robber', diff: 'Medium',
    desc: '<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed; adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses are broken into on the same night. Given an integer array <code>nums</code> representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.</p>',
    ex: [['nums = [1,2,3,1]', '4'], ['nums = [2,7,9,3,1]', '12']],
    sig: 'int rob(int[] nums)',
    tests: [
      t([[1, 2, 3, 1]], 4), t([[2, 7, 9, 3, 1]], 12),
      h([[5]], 5), h([[2, 1]], 2), h([[2, 1, 1, 2]], 4), h([[100, 1, 1, 100]], 200)
    ]
  });

  P({
    n: 279, title: 'Perfect Squares', diff: 'Medium',
    desc: '<p>Given an integer <code>n</code>, return the least number of perfect square numbers that sum to <code>n</code>. A perfect square is an integer that is the square of an integer (1, 4, 9, 16, ...).</p>',
    ex: [['n = 12', '3', '12 = 4 + 4 + 4'], ['n = 13', '2', '13 = 4 + 9']],
    sig: 'int numSquares(int n)',
    tests: [t([12], 3), t([13], 2), h([1], 1), h([7], 4), h([43], 3), h([100], 1)]
  });

  P({
    n: 322, title: 'Coin Change', diff: 'Medium',
    desc: '<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money. Return the fewest number of coins needed to make up that amount. If that amount cannot be made up by any combination of the coins, return <code>-1</code>. You may assume you have an infinite number of each kind of coin.</p>',
    ex: [['coins = [1,2,5], amount = 11', '3', '11 = 5 + 5 + 1'], ['coins = [2], amount = 3', '-1'], ['coins = [1], amount = 0', '0']],
    sig: 'int coinChange(int[] coins, int amount)',
    tests: [
      t([[1, 2, 5], 11], 3), t([[2], 3], -1), t([[1], 0], 0),
      h([[186, 419, 83, 408], 6249], 20), h([[1, 2, 5], 100], 20), h([[2, 5, 10, 1], 27], 4), h([[5], 10000], 2000)
    ]
  });

  P({
    n: 139, title: 'Word Break', diff: 'Medium',
    desc: '<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words. The same word in the dictionary may be reused multiple times in the segmentation.</p>',
    ex: [['s = "leetcode", wordDict = ["leet","code"]', 'true'], ['s = "applepenapple", wordDict = ["apple","pen"]', 'true'], ['s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', 'false']],
    sig: 'boolean wordBreak(String s, List<String> wordDict)',
    tests: [
      t(['leetcode', ['leet', 'code']], true), t(['applepenapple', ['apple', 'pen']], true), t(['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], false),
      h(['a', ['a']], true), h(['aaaaaaa', ['aaaa', 'aaa']], true), h([rep('a', 30) + 'b', ['a', 'aa', 'aaa']], false)
    ]
  });

  P({
    n: 300, title: 'Longest Increasing Subsequence', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code>, return the length of the longest strictly increasing subsequence.</p>',
    ex: [['nums = [10,9,2,5,3,7,101,18]', '4', 'The longest increasing subsequence is [2,3,7,101].'], ['nums = [0,1,0,3,2,3]', '4'], ['nums = [7,7,7,7,7,7,7]', '1']],
    sig: 'int lengthOfLIS(int[] nums)',
    tests: [
      t([[10, 9, 2, 5, 3, 7, 101, 18]], 4), t([[0, 1, 0, 3, 2, 3]], 4), t([[7, 7, 7, 7, 7, 7, 7]], 1),
      h([[1]], 1), h([[4, 10, 4, 3, 8, 9]], 3),
      h([R('JKRT.range(1,2000)', '[1..2000]')], 2000, 'nums = [1..2000]')
    ]
  });

  P({
    n: 152, title: 'Maximum Product Subarray', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code>, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer fits in a 32-bit integer.</p>',
    ex: [['nums = [2,3,-2,4]', '6'], ['nums = [-2,0,-1]', '0']],
    sig: 'int maxProduct(int[] nums)',
    tests: [
      t([[2, 3, -2, 4]], 6), t([[-2, 0, -1]], 0),
      h([[-2]], -2), h([[-2, 3, -4]], 24), h([[0, 2]], 2), h([[2, -5, -2, -4, 3]], 24)
    ]
  });

  P({
    n: 416, title: 'Partition Equal Subset Sum', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code>, return <code>true</code> if you can partition the array into two subsets such that the sum of the elements in both subsets is equal, or <code>false</code> otherwise.</p>',
    ex: [['nums = [1,5,11,5]', 'true', 'The array can be partitioned as [1, 5, 5] and [11].'], ['nums = [1,2,3,5]', 'false']],
    sig: 'boolean canPartition(int[] nums)',
    tests: [
      t([[1, 5, 11, 5]], true), t([[1, 2, 3, 5]], false),
      h([[1, 1]], true), h([[100]], false), h([[1, 2, 5]], false), h([[2, 2, 3, 5]], false), h([[3, 3, 3, 4, 5]], true)
    ]
  });

  P({
    n: 32, title: 'Longest Valid Parentheses', diff: 'Hard',
    desc: '<p>Given a string containing just the characters <code>\'(\'</code> and <code>\')\'</code>, return the length of the longest valid (well-formed) parentheses substring.</p>',
    ex: [['s = "(()"', '2'], ['s = ")()())"', '4'], ['s = ""', '0']],
    sig: 'int longestValidParentheses(String s)',
    tests: [
      t(['(()'], 2), t([')()())'], 4), t([''], 0),
      h(['()(()'], 2), h(['()(())'], 6), h(['(()(((()'], 2), h(['()()'], 4)
    ]
  });

  /* ------------------------------------------------------------ multidimensional DP */
  P({
    n: 62, title: 'Unique Paths', diff: 'Medium',
    desc: '<p>There is a robot on an <code>m x n</code> grid. The robot is initially located at the top-left corner and tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. Given the two integers <code>m</code> and <code>n</code>, return the number of possible unique paths.</p>',
    ex: [['m = 3, n = 7', '28'], ['m = 3, n = 2', '3']],
    sig: 'int uniquePaths(int m, int n)',
    tests: [t([3, 7], 28), t([3, 2], 3), h([1, 1], 1), h([3, 3], 6), h([23, 12], 193536720)]
  });

  P({
    n: 64, title: 'Minimum Path Sum', diff: 'Medium',
    desc: '<p>Given an <code>m x n</code> grid filled with non-negative numbers, find a path from the top-left to the bottom-right corner which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.</p>',
    ex: [['grid = [[1,3,1],[1,5,1],[4,2,1]]', '7'], ['grid = [[1,2,3],[4,5,6]]', '12']],
    sig: 'int minPathSum(int[][] grid)',
    tests: [
      t([[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], 7), t([[[1, 2, 3], [4, 5, 6]]], 12),
      h([[[5]]], 5), h([[[1, 2], [1, 1]]], 3), h([[[1, 2, 5], [3, 2, 1]]], 6)
    ]
  });

  P({
    n: 5, title: 'Longest Palindromic Substring', diff: 'Medium',
    desc: '<p>Given a string <code>s</code>, return the longest palindromic substring in <code>s</code>. (If several answers exist, any of them is valid on LeetCode; the tests here only use inputs with a unique answer.)</p>',
    ex: [['s = "babad"', '"bab"', '"aba" is also a valid answer.'], ['s = "cbbd"', '"bb"']],
    sig: 'String longestPalindrome(String s)',
    tests: [
      t(['cbbd'], 'bb'), t(['a'], 'a'), t(['racecar'], 'racecar'),
      h(['xabbay'], 'abba'), h(['forgeeksskeegfor'], 'geeksskeeg'), h(['bb'], 'bb'), h(['abacdfgdcaba'], 'aba')
    ]
  });

  P({
    n: 1143, title: 'Longest Common Subsequence', diff: 'Medium',
    desc: '<p>Given two strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence. If there is no common subsequence, return <code>0</code>. A subsequence is a string generated from the original string by deleting some characters (possibly none) without changing the relative order of the remaining characters.</p>',
    ex: [['text1 = "abcde", text2 = "ace"', '3'], ['text1 = "abc", text2 = "abc"', '3'], ['text1 = "abc", text2 = "def"', '0']],
    sig: 'int longestCommonSubsequence(String text1, String text2)',
    tests: [
      t(['abcde', 'ace'], 3), t(['abc', 'abc'], 3), t(['abc', 'def'], 0),
      h(['a', 'a'], 1), h(['bl', 'yby'], 1), h(['AGGTAB', 'GXTXAYB'], 4), h([rep('a', 1000), rep('a', 1000)], 1000)
    ]
  });

  P({
    n: 72, title: 'Edit Distance', diff: 'Medium',
    desc: '<p>Given two strings <code>word1</code> and <code>word2</code>, return the minimum number of operations required to convert <code>word1</code> to <code>word2</code>. You have the following three operations permitted on a word: insert a character, delete a character, replace a character.</p>',
    ex: [['word1 = "horse", word2 = "ros"', '3'], ['word1 = "intention", word2 = "execution"', '5']],
    sig: 'int minDistance(String word1, String word2)',
    tests: [
      t(['horse', 'ros'], 3), t(['intention', 'execution'], 5),
      h(['', 'a'], 1), h(['a', 'a'], 0), h(['abc', 'yabd'], 2), h(['sea', 'eat'], 2)
    ]
  });

  /* ------------------------------------------------------------ tricks */
  P({
    n: 136, title: 'Single Number', diff: 'Easy',
    desc: '<p>Given a non-empty array of integers <code>nums</code>, every element appears twice except for one. Find that single one. You must implement a solution with linear runtime complexity and use only constant extra space.</p>',
    ex: [['nums = [2,2,1]', '1'], ['nums = [4,1,2,1,2]', '4'], ['nums = [1]', '1']],
    sig: 'int singleNumber(int[] nums)',
    tests: [t([[2, 2, 1]], 1), t([[4, 1, 2, 1, 2]], 4), t([[1]], 1), h([[-1, -1, -2]], -2), h([[7, 3, 7]], 3)]
  });

  P({
    n: 169, title: 'Majority Element', diff: 'Easy',
    desc: '<p>Given an array <code>nums</code> of size <code>n</code>, return the majority element. The majority element is the element that appears more than <code>⌊n / 2⌋</code> times. You may assume that the majority element always exists in the array.</p>',
    ex: [['nums = [3,2,3]', '3'], ['nums = [2,2,1,1,1,2,2]', '2']],
    sig: 'int majorityElement(int[] nums)',
    tests: [t([[3, 2, 3]], 3), t([[2, 2, 1, 1, 1, 2, 2]], 2), h([[1]], 1), h([[6, 6, 6, 7, 7]], 6), h([[-1, -1, -1, 2]], -1)]
  });

  P({
    n: 75, title: 'Sort Colors', diff: 'Medium',
    desc: '<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue (represented by <code>0</code>, <code>1</code> and <code>2</code>), sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. You must solve this problem without using the library\'s sort function.</p>',
    ex: [['nums = [2,0,2,1,1,0]', '[0,0,1,1,2,2]'], ['nums = [2,0,1]', '[0,1,2]']],
    sig: 'void sortColors(int[] nums)', inPlace: 0, ret: 'int[]',
    tests: [
      t([[2, 0, 2, 1, 1, 0]], [0, 0, 1, 1, 2, 2]), t([[2, 0, 1]], [0, 1, 2]),
      h([[0]], [0]), h([[1, 1, 1]], [1, 1, 1]), h([[2, 2, 1, 1, 0, 0]], [0, 0, 1, 1, 2, 2])
    ]
  });

  P({
    n: 31, title: 'Next Permutation', diff: 'Medium',
    desc: '<p>The next permutation of an array of integers is the next lexicographically greater permutation of its integer arrangement. If no such arrangement is possible, the array must be rearranged as the lowest possible order (sorted in ascending order). Modify <code>nums</code> in-place and use only constant extra memory.</p>',
    ex: [['nums = [1,2,3]', '[1,3,2]'], ['nums = [3,2,1]', '[1,2,3]'], ['nums = [1,1,5]', '[1,5,1]']],
    sig: 'void nextPermutation(int[] nums)', inPlace: 0, ret: 'int[]',
    tests: [
      t([[1, 2, 3]], [1, 3, 2]), t([[3, 2, 1]], [1, 2, 3]), t([[1, 1, 5]], [1, 5, 1]),
      h([[1]], [1]), h([[1, 3, 2]], [2, 1, 3]), h([[2, 3, 1]], [3, 1, 2]), h([[5, 4, 7, 5, 3, 2]], [5, 5, 2, 3, 4, 7])
    ]
  });

  P({
    n: 287, title: 'Find the Duplicate Number', diff: 'Medium',
    desc: '<p>Given an array of integers <code>nums</code> containing <code>n + 1</code> integers where each integer is in the range <code>[1, n]</code> inclusive, there is only one repeated number in <code>nums</code>. Return this repeated number. You must solve the problem without modifying the array and using only constant extra space.</p>',
    ex: [['nums = [1,3,4,2,2]', '2'], ['nums = [3,1,3,4,2]', '3'], ['nums = [3,3,3,3,3]', '3']],
    sig: 'int findDuplicate(int[] nums)',
    tests: [
      t([[1, 3, 4, 2, 2]], 2), t([[3, 1, 3, 4, 2]], 3), t([[3, 3, 3, 3, 3]], 3),
      h([[1, 1]], 1), h([[1, 1, 2]], 1), h([[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]], 9)
    ]
  });

  /* ------------------------------------------------------------ classics */
  P({
    n: 217, title: 'Contains Duplicate', diff: 'Easy',
    desc: '<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice in the array, and return <code>false</code> if every element is distinct.</p>',
    ex: [['nums = [1,2,3,1]', 'true'], ['nums = [1,2,3,4]', 'false'], ['nums = [1,1,1,3,3,4,3,2,4,2]', 'true']],
    sig: 'boolean containsDuplicate(int[] nums)',
    tests: [
      t([[1, 2, 3, 1]], true), t([[1, 2, 3, 4]], false), t([[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], true),
      h([[1]], false), h([[-1, -1]], true), h([[0, 4, 5, 0, 3, 6]], true),
      h([R('JKRT.range(1,100000)', '[1..100000]')], false, 'nums = [1..100000]')
    ]
  });

  P({
    n: 242, title: 'Valid Anagram', diff: 'Easy',
    desc: '<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.</p>',
    ex: [['s = "anagram", t = "nagaram"', 'true'], ['s = "rat", t = "car"', 'false']],
    sig: 'boolean isAnagram(String s, String t)',
    tests: [
      t(['anagram', 'nagaram'], true), t(['rat', 'car'], false),
      h(['a', 'ab'], false), h(['aacc', 'ccac'], false), h(['listen', 'silent'], true)
    ]
  });

  P({
    n: 704, title: 'Binary Search', diff: 'Easy',
    desc: '<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, return its index. Otherwise, return <code>-1</code>. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>',
    ex: [['nums = [-1,0,3,5,9,12], target = 9', '4'], ['nums = [-1,0,3,5,9,12], target = 2', '-1']],
    sig: 'int search(int[] nums, int target)',
    tests: [
      t([[-1, 0, 3, 5, 9, 12], 9], 4), t([[-1, 0, 3, 5, 9, 12], 2], -1),
      h([[5], 5], 0), h([[5], -5], -1), h([[1, 3], 3], 1), h([[2, 5], 0], -1)
    ]
  });
})();
