/* Problems 1/5: hashing, two pointers, sliding window, arrays, matrix. */
(function () {
  var P = JK.P, t = JK.t, h = JK.h, R = JK.R;

  P({
    n: 1, title: 'Two Sum', diff: 'Easy',
    desc: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to <code>target</code>.</p><p>Each input has exactly one solution, and you may not use the same element twice. The answer can be returned in any order.</p>',
    ex: [['nums = [2,7,11,15], target = 9', '[0,1]', 'nums[0] + nums[1] == 9'], ['nums = [3,2,4], target = 6', '[1,2]'], ['nums = [3,3], target = 6', '[0,1]']],
    sig: 'int[] twoSum(int[] nums, int target)', cmp: 'unordered',
    tests: [
      t([[2, 7, 11, 15], 9], [0, 1]), t([[3, 2, 4], 6], [1, 2]), t([[3, 3], 6], [0, 1]),
      h([[-1, -2, -3, -4, -5], -8], [2, 4]), h([[0, 4, 3, 0], 0], [0, 3]),
      h([[1000000000, 5, -1000000000, 7], 12], [1, 3]),
      h([R('JKRT.range(1,100000)', '[1..100000]'), 199999], [99998, 99999], 'nums = [1..100000], target = 199999')
    ]
  });

  P({
    n: 49, title: 'Group Anagrams', diff: 'Medium',
    desc: '<p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the groups in any order.</p>',
    ex: [['strs = ["eat","tea","tan","ate","nat","bat"]', '[["bat"],["nat","tan"],["ate","eat","tea"]]'], ['strs = [""]', '[[""]]'], ['strs = ["a"]', '[["a"]]']],
    sig: 'List<List<String>> groupAnagrams(String[] strs)', cmp: 'unordered',
    tests: [
      t([['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]),
      t([['']], [['']]), t([['a']], [['a']]),
      h([['ab', 'ba', 'abc']], [['ab', 'ba'], ['abc']]),
      h([['abc', 'bca', 'cab', 'xyz']], [['abc', 'bca', 'cab'], ['xyz']]),
      h([['', '']], [['', '']]),
      h([['listen', 'silent', 'enlist', 'google', 'gogole']], [['listen', 'silent', 'enlist'], ['google', 'gogole']])
    ]
  });

  P({
    n: 128, title: 'Longest Consecutive Sequence', diff: 'Medium',
    desc: '<p>Given an unsorted array of integers <code>nums</code>, return the length of the longest consecutive elements sequence.</p><p>You must write an algorithm that runs in <code>O(n)</code> time.</p>',
    ex: [['nums = [100,4,200,1,3,2]', '4', 'The longest sequence is [1, 2, 3, 4].'], ['nums = [0,3,7,2,5,8,4,6,0,1]', '9']],
    sig: 'int longestConsecutive(int[] nums)',
    tests: [
      t([[100, 4, 200, 1, 3, 2]], 4), t([[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], 9), t([[]], 0),
      h([[1, 0, 1, 2]], 3), h([[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], 7), h([[-5]], 1),
      h([R('JKRT.range(1,100000)', '[1..100000]')], 100000, 'nums = [1..100000]')
    ]
  });

  P({
    n: 283, title: 'Move Zeroes', diff: 'Easy',
    desc: '<p>Given an integer array <code>nums</code>, move all <code>0</code>s to the end of it while maintaining the relative order of the non-zero elements.</p><p>You must do this in-place without making a copy of the array.</p>',
    ex: [['nums = [0,1,0,3,12]', '[1,3,12,0,0]'], ['nums = [0]', '[0]']],
    sig: 'void moveZeroes(int[] nums)', inPlace: 0, ret: 'int[]',
    tests: [
      t([[0, 1, 0, 3, 12]], [1, 3, 12, 0, 0]), t([[0]], [0]), t([[1, 0, 1]], [1, 1, 0]),
      h([[0, 0, 1]], [1, 0, 0]), h([[4, 2, 4, 0, 0, 3, 0, 5, 1, 0]], [4, 2, 4, 3, 5, 1, 0, 0, 0, 0]),
      h([[1, 2, 3]], [1, 2, 3]),
      h([R('JKRT.fill(100000,0)', '[0] x 100000')], R('JKRT.fill(100000,0)', '[0] x 100000'), 'nums = [0] x 100000')
    ]
  });

  P({
    n: 11, title: 'Container With Most Water', diff: 'Medium',
    desc: '<p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i</code>th line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p><p>Find two lines that together with the x-axis form a container that holds the most water, and return that maximum amount of water.</p>',
    ex: [['height = [1,8,6,2,5,4,8,3,7]', '49'], ['height = [1,1]', '1']],
    sig: 'int maxArea(int[] height)',
    tests: [
      t([[1, 8, 6, 2, 5, 4, 8, 3, 7]], 49), t([[1, 1]], 1), t([[4, 3, 2, 1, 4]], 16),
      h([[1, 2, 1]], 2), h([[2, 3, 4, 5, 18, 17, 6]], 17), h([[0, 0]], 0),
      h([R('JKRT.fill(100000,1)', '[1] x 100000')], 99999, 'height = [1] x 100000')
    ]
  });

  P({
    n: 15, title: '3Sum', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p><p>The solution set must not contain duplicate triplets. The order of the triplets, and of the numbers inside a triplet, does not matter.</p>',
    ex: [['nums = [-1,0,1,2,-1,-4]', '[[-1,-1,2],[-1,0,1]]'], ['nums = [0,1,1]', '[]'], ['nums = [0,0,0]', '[[0,0,0]]']],
    sig: 'List<List<Integer>> threeSum(int[] nums)', cmp: 'unordered',
    tests: [
      t([[-1, 0, 1, 2, -1, -4]], [[-1, -1, 2], [-1, 0, 1]]), t([[0, 1, 1]], []), t([[0, 0, 0]], [[0, 0, 0]]),
      h([[0, 0, 0, 0]], [[0, 0, 0]]), h([[-2, 0, 1, 1, 2]], [[-2, 0, 2], [-2, 1, 1]]),
      h([[3, 0, -2, -1, 1, 2]], [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]]), h([[1, 2, -2, -1]], []),
      h([R('JKRT.fill(3000,0)', '[0] x 3000')], [[0, 0, 0]], 'nums = [0] x 3000')
    ]
  });

  P({
    n: 42, title: 'Trapping Rain Water', diff: 'Hard',
    desc: '<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>',
    ex: [['height = [0,1,0,2,1,0,1,3,2,1,2,1]', '6'], ['height = [4,2,0,3,2,5]', '9']],
    sig: 'int trap(int[] height)',
    tests: [
      t([[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], 6), t([[4, 2, 0, 3, 2, 5]], 9), t([[1]], 0),
      h([[3, 0, 3]], 3), h([[2, 0, 2]], 2), h([[5, 4, 1, 2]], 1), h([[0, 0, 0]], 0), h([[1, 2, 3, 4, 5]], 0),
      h([R('JKRT.fill(100000,3)', '[3] x 100000')], 0, 'height = [3] x 100000')
    ]
  });

  P({
    n: 3, title: 'Longest Substring Without Repeating Characters', diff: 'Medium',
    desc: '<p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>',
    ex: [['s = "abcabcbb"', '3', 'The answer is "abc", with the length of 3.'], ['s = "bbbbb"', '1'], ['s = "pwwkew"', '3', '"wke" is a substring; "pwke" is a subsequence, not a substring.']],
    sig: 'int lengthOfLongestSubstring(String s)',
    tests: [
      t(['abcabcbb'], 3), t(['bbbbb'], 1), t(['pwwkew'], 3),
      h(['']  , 0), h([' '], 1), h(['dvdf'], 3), h(['abba'], 2), h(['tmmzuxt'], 5),
      h([R('"abcdefghij".repeat(10000)', '"abcdefghij" x 10000')], 10, 's = "abcdefghij" x 10000')
    ]
  });

  P({
    n: 438, title: 'Find All Anagrams in a String', diff: 'Medium',
    desc: '<p>Given two strings <code>s</code> and <code>p</code>, return an array of all the start indices of <code>p</code>\'s anagrams in <code>s</code>. You may return the answer in ascending order.</p>',
    ex: [['s = "cbaebabacd", p = "abc"', '[0,6]'], ['s = "abab", p = "ab"', '[0,1,2]']],
    sig: 'List<Integer> findAnagrams(String s, String p)',
    tests: [
      t(['cbaebabacd', 'abc'], [0, 6]), t(['abab', 'ab'], [0, 1, 2]), t(['a', 'ab'], []),
      h(['baa', 'aa'], [1]), h(['aaaaaaaaaa', 'aaaaaaaaaaaaa'], []), h(['abacbabc', 'abc'], [1, 2, 3, 5]),
      h([R('"ab".repeat(50000)', '"ab" x 50000'), 'ba'], R('JKRT.rangeList(0,99998)', '[0..99998]'), 's = "ab" x 50000, p = "ba"')
    ]
  });

  P({
    n: 560, title: 'Subarray Sum Equals K', diff: 'Medium',
    desc: '<p>Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of subarrays whose sum equals <code>k</code>.</p><p>A subarray is a contiguous non-empty sequence of elements within an array.</p>',
    ex: [['nums = [1,1,1], k = 2', '2'], ['nums = [1,2,3], k = 3', '2']],
    sig: 'int subarraySum(int[] nums, int k)',
    tests: [
      t([[1, 1, 1], 2], 2), t([[1, 2, 3], 3], 2), t([[1], 0], 0),
      h([[1, -1, 0], 0], 3), h([[-1, -1, 1], 0], 1), h([[3, 4, 7, 2, -3, 1, 4, 2], 7], 4),
      h([R('JKRT.fill(100000,1)', '[1] x 100000'), 1], 100000, 'nums = [1] x 100000, k = 1')
    ]
  });

  P({
    n: 239, title: 'Sliding Window Maximum', diff: 'Hard',
    desc: '<p>You are given an array of integers <code>nums</code>. There is a sliding window of size <code>k</code> which moves from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window, and each time the window moves right by one position.</p><p>Return the max sliding window (the maximum of each window position).</p>',
    ex: [['nums = [1,3,-1,-3,5,3,6,7], k = 3', '[3,3,5,5,6,7]'], ['nums = [1], k = 1', '[1]']],
    sig: 'int[] maxSlidingWindow(int[] nums, int k)',
    tests: [
      t([[1, 3, -1, -3, 5, 3, 6, 7], 3], [3, 3, 5, 5, 6, 7]), t([[1], 1], [1]), t([[1, -1], 1], [1, -1]),
      h([[9, 11], 2], [11]), h([[4, 3, 2, 1], 2], [4, 3, 2]), h([[7, 2, 4], 2], [7, 4]),
      h([R('JKRT.range(1,100000)', '[1..100000]'), 99999], [99999, 100000], 'nums = [1..100000], k = 99999')
    ]
  });

  P({
    n: 76, title: 'Minimum Window Substring', diff: 'Hard',
    desc: '<p>Given two strings <code>s</code> and <code>t</code>, return the minimum window substring of <code>s</code> such that every character in <code>t</code> (including duplicates) is included in the window. If there is no such substring, return the empty string <code>""</code>.</p><p>The test cases are generated such that the answer is unique.</p>',
    ex: [['s = "ADOBECODEBANC", t = "ABC"', '"BANC"'], ['s = "a", t = "a"', '"a"'], ['s = "a", t = "aa"', '""', 'Both \'a\'s from t must be included in the window.']],
    sig: 'String minWindow(String s, String t)',
    tests: [
      t(['ADOBECODEBANC', 'ABC'], 'BANC'), t(['a', 'a'], 'a'), t(['a', 'aa'], ''),
      h(['ab', 'b'], 'b'), h(['aa', 'aa'], 'aa'), h(['cabwefgewcwaefgcf', 'cae'], 'cwae'), h(['bba', 'ab'], 'ba'),
      h([R('"a".repeat(50000) + "b"', '"a" x 50000 + "b"'), 'ab'], 'ab', 's = "a" x 50000 + "b", t = "ab"')
    ]
  });

  P({
    n: 53, title: 'Maximum Subarray', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return its sum.</p>',
    ex: [['nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', 'The subarray [4,-1,2,1] has the largest sum 6.'], ['nums = [1]', '1'], ['nums = [5,4,-1,7,8]', '23']],
    sig: 'int maxSubArray(int[] nums)',
    tests: [
      t([[-2, 1, -3, 4, -1, 2, 1, -5, 4]], 6), t([[1]], 1), t([[5, 4, -1, 7, 8]], 23),
      h([[-1]], -1), h([[-2, -1]], -1), h([[-3, -2, -5]], -2), h([[8, -19, 5, -4, 20]], 21),
      h([R('JKRT.fill(100000,1)', '[1] x 100000')], 100000, 'nums = [1] x 100000')
    ]
  });

  P({
    n: 56, title: 'Merge Intervals', diff: 'Medium',
    desc: '<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start, end]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input, sorted by start.</p>',
    ex: [['intervals = [[1,3],[2,6],[8,10],[15,18]]', '[[1,6],[8,10],[15,18]]'], ['intervals = [[1,4],[4,5]]', '[[1,5]]', 'Intervals [1,4] and [4,5] are considered overlapping.']],
    sig: 'int[][] merge(int[][] intervals)',
    tests: [
      t([[[1, 3], [2, 6], [8, 10], [15, 18]]], [[1, 6], [8, 10], [15, 18]]), t([[[1, 4], [4, 5]]], [[1, 5]]), t([[[1, 4], [0, 4]]], [[0, 4]]),
      h([[[1, 4], [2, 3]]], [[1, 4]]), h([[[1, 4], [0, 0]]], [[0, 0], [1, 4]]),
      h([[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], [[1, 10]]), h([[[1, 3]]], [[1, 3]]), h([[[5, 6], [1, 2], [3, 4]]], [[1, 2], [3, 4], [5, 6]])
    ]
  });

  P({
    n: 189, title: 'Rotate Array', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code>, rotate the array to the right by <code>k</code> steps, where <code>k</code> is non-negative. Do it in-place.</p>',
    ex: [['nums = [1,2,3,4,5,6,7], k = 3', '[5,6,7,1,2,3,4]'], ['nums = [-1,-100,3,99], k = 2', '[3,99,-1,-100]']],
    sig: 'void rotate(int[] nums, int k)', inPlace: 0, ret: 'int[]',
    tests: [
      t([[1, 2, 3, 4, 5, 6, 7], 3], [5, 6, 7, 1, 2, 3, 4]), t([[-1, -100, 3, 99], 2], [3, 99, -1, -100]), t([[1], 5], [1]),
      h([[1, 2], 3], [2, 1]), h([[1, 2, 3], 0], [1, 2, 3]), h([[1, 2, 3, 4, 5, 6], 4], [3, 4, 5, 6, 1, 2])
    ]
  });

  P({
    n: 238, title: 'Product of Array Except Self', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.</p><p>You must write an algorithm that runs in <code>O(n)</code> time and without using the division operation.</p>',
    ex: [['nums = [1,2,3,4]', '[24,12,8,6]'], ['nums = [-1,1,0,-3,3]', '[0,0,9,0,0]']],
    sig: 'int[] productExceptSelf(int[] nums)',
    tests: [
      t([[1, 2, 3, 4]], [24, 12, 8, 6]), t([[-1, 1, 0, -3, 3]], [0, 0, 9, 0, 0]), t([[2, 3]], [3, 2]),
      h([[0, 0]], [0, 0]), h([[1, 1, 1]], [1, 1, 1]), h([[5, 0, 2]], [0, 10, 0]),
      h([R('JKRT.fill(100000,1)', '[1] x 100000')], R('JKRT.fill(100000,1)', '[1] x 100000'), 'nums = [1] x 100000')
    ]
  });

  P({
    n: 41, title: 'First Missing Positive', diff: 'Hard',
    desc: '<p>Given an unsorted integer array <code>nums</code>, return the smallest missing positive integer.</p><p>You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.</p>',
    ex: [['nums = [1,2,0]', '3'], ['nums = [3,4,-1,1]', '2'], ['nums = [7,8,9,11,12]', '1']],
    sig: 'int firstMissingPositive(int[] nums)',
    tests: [
      t([[1, 2, 0]], 3), t([[3, 4, -1, 1]], 2), t([[7, 8, 9, 11, 12]], 1),
      h([[1]], 2), h([[2, 1]], 3), h([[0]], 1), h([[1, 1]], 2),
      h([R('JKRT.range(1,100000)', '[1..100000]')], 100001, 'nums = [1..100000]')
    ]
  });

  P({
    n: 73, title: 'Set Matrix Zeroes', diff: 'Medium',
    desc: '<p>Given an <code>m x n</code> integer matrix <code>matrix</code>, if an element is <code>0</code>, set its entire row and column to <code>0</code>\'s. You must do it in place.</p>',
    ex: [['matrix = [[1,1,1],[1,0,1],[1,1,1]]', '[[1,0,1],[0,0,0],[1,0,1]]'], ['matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]']],
    sig: 'void setZeroes(int[][] matrix)', inPlace: 0, ret: 'int[][]',
    tests: [
      t([[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], [[1, 0, 1], [0, 0, 0], [1, 0, 1]]),
      t([[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]),
      t([[[1]]], [[1]]), h([[[0]]], [[0]]), h([[[1, 0]]], [[0, 0]]), h([[[1, 2], [3, 0]]], [[1, 0], [0, 0]])
    ]
  });

  P({
    n: 54, title: 'Spiral Matrix', diff: 'Medium',
    desc: '<p>Given an <code>m x n</code> matrix, return all elements of the matrix in spiral order.</p>',
    ex: [['matrix = [[1,2,3],[4,5,6],[7,8,9]]', '[1,2,3,6,9,8,7,4,5]'], ['matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', '[1,2,3,4,8,12,11,10,9,5,6,7]']],
    sig: 'List<Integer> spiralOrder(int[][] matrix)',
    tests: [
      t([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], [1, 2, 3, 6, 9, 8, 7, 4, 5]),
      t([[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]),
      t([[[1]]], [1]), h([[[1, 2], [3, 4]]], [1, 2, 4, 3]), h([[[1], [2], [3]]], [1, 2, 3]), h([[[1, 2, 3]]], [1, 2, 3]),
      h([[[2, 5], [8, 4], [0, -1]]], [2, 5, 4, -1, 0, 8])
    ]
  });

  P({
    n: 48, title: 'Rotate Image', diff: 'Medium',
    desc: '<p>You are given an <code>n x n</code> 2D matrix representing an image. Rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.</p>',
    ex: [['matrix = [[1,2,3],[4,5,6],[7,8,9]]', '[[7,4,1],[8,5,2],[9,6,3]]'], ['matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]']],
    sig: 'void rotate(int[][] matrix)', inPlace: 0, ret: 'int[][]',
    tests: [
      t([[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]),
      t([[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]),
      h([[[1]]], [[1]]), h([[[1, 2], [3, 4]]], [[3, 1], [4, 2]])
    ]
  });

  P({
    n: 240, title: 'Search a 2D Matrix II', diff: 'Medium',
    desc: '<p>Write an efficient algorithm that searches for a value <code>target</code> in an <code>m x n</code> integer matrix. This matrix has the following properties: integers in each row are sorted in ascending order from left to right, and integers in each column are sorted in ascending order from top to bottom.</p>',
    ex: [['matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5', 'true'], ['matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20', 'false']],
    sig: 'boolean searchMatrix(int[][] matrix, int target)',
    tests: [
      t([[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5], true),
      t([[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20], false),
      h([[[-1]], -1], true), h([[[1, 1]], 2], false), h([[[1, 3, 5]], 3], true), h([[[1], [3], [5]], 4], false), h([[[1, 2, 3, 4, 5]], 6], false)
    ]
  });
})();
