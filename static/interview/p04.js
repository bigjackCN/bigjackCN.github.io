/* Problems 4/5: backtracking, binary search, stack. */
(function () {
  var P = JK.P, t = JK.t, h = JK.h, R = JK.R, dt = JK.dt, dh = JK.dh;

  P({
    n: 46, title: 'Permutations', diff: 'Medium',
    desc: '<p>Given an array <code>nums</code> of distinct integers, return all the possible permutations. You can return the answer in any order.</p>',
    ex: [['nums = [1,2,3]', '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'], ['nums = [0,1]', '[[0,1],[1,0]]'], ['nums = [1]', '[[1]]']],
    sig: 'List<List<Integer>> permute(int[] nums)', cmp: 'setOuter',
    tests: [
      t([[1, 2, 3]], [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]), t([[0, 1]], [[0, 1], [1, 0]]), t([[1]], [[1]]),
      h([[-1, 0, 1]], [[-1, 0, 1], [-1, 1, 0], [0, -1, 1], [0, 1, -1], [1, -1, 0], [1, 0, -1]]),
      h([[4, 5]], [[4, 5], [5, 4]]),
      h([[1, 2, 3, 4]], [[1, 2, 3, 4], [1, 2, 4, 3], [1, 3, 2, 4], [1, 3, 4, 2], [1, 4, 2, 3], [1, 4, 3, 2], [2, 1, 3, 4], [2, 1, 4, 3], [2, 3, 1, 4], [2, 3, 4, 1], [2, 4, 1, 3], [2, 4, 3, 1], [3, 1, 2, 4], [3, 1, 4, 2], [3, 2, 1, 4], [3, 2, 4, 1], [3, 4, 1, 2], [3, 4, 2, 1], [4, 1, 2, 3], [4, 1, 3, 2], [4, 2, 1, 3], [4, 2, 3, 1], [4, 3, 1, 2], [4, 3, 2, 1]])
    ]
  });

  P({
    n: 78, title: 'Subsets', diff: 'Medium',
    desc: '<p>Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.</p>',
    ex: [['nums = [1,2,3]', '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]'], ['nums = [0]', '[[],[0]]']],
    sig: 'List<List<Integer>> subsets(int[] nums)', cmp: 'unordered',
    tests: [
      t([[1, 2, 3]], [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]), t([[0]], [[], [0]]), t([[1, 2]], [[], [1], [2], [1, 2]]),
      h([[5]], [[], [5]]),
      h([[1, 2, 3, 4]], [[], [1], [2], [3], [4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4], [1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4], [1, 2, 3, 4]])
    ]
  });

  P({
    n: 17, title: 'Letter Combinations of a Phone Number', diff: 'Medium',
    desc: '<p>Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent, using the mapping of a telephone keypad (2 = abc, 3 = def, 4 = ghi, 5 = jkl, 6 = mno, 7 = pqrs, 8 = tuv, 9 = wxyz). Return the answer in any order.</p>',
    ex: [['digits = "23"', '["ad","ae","af","bd","be","bf","cd","ce","cf"]'], ['digits = ""', '[]'], ['digits = "2"', '["a","b","c"]']],
    sig: 'List<String> letterCombinations(String digits)', cmp: 'setOuter',
    tests: [
      t(['23'], ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']), t([''], []), t(['2'], ['a', 'b', 'c']),
      h(['22'], ['aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc']),
      h(['79'], ['pw', 'px', 'py', 'pz', 'qw', 'qx', 'qy', 'qz', 'rw', 'rx', 'ry', 'rz', 'sw', 'sx', 'sy', 'sz'])
    ]
  });

  P({
    n: 39, title: 'Combination Sum', diff: 'Medium',
    desc: '<p>Given an array of distinct integers <code>candidates</code> and a target integer <code>target</code>, return a list of all unique combinations of <code>candidates</code> where the chosen numbers sum to <code>target</code>. You may return the combinations in any order.</p><p>The same number may be chosen from <code>candidates</code> an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.</p>',
    ex: [['candidates = [2,3,6,7], target = 7', '[[2,2,3],[7]]'], ['candidates = [2,3,5], target = 8', '[[2,2,2,2],[2,3,3],[3,5]]'], ['candidates = [2], target = 1', '[]']],
    sig: 'List<List<Integer>> combinationSum(int[] candidates, int target)', cmp: 'unordered',
    tests: [
      t([[2, 3, 6, 7], 7], [[2, 2, 3], [7]]), t([[2, 3, 5], 8], [[2, 2, 2, 2], [2, 3, 3], [3, 5]]), t([[2], 1], []),
      h([[1], 2], [[1, 1]]), h([[2, 3, 5], 5], [[5], [2, 3]]), h([[8, 7, 4, 3], 11], [[8, 3], [7, 4], [4, 4, 3]])
    ]
  });

  P({
    n: 22, title: 'Generate Parentheses', diff: 'Medium',
    desc: '<p>Given <code>n</code> pairs of parentheses, write a function to generate all combinations of well-formed parentheses. Return the answer in any order.</p>',
    ex: [['n = 3', '["((()))","(()())","(())()","()(())","()()()"]'], ['n = 1', '["()"]']],
    sig: 'List<String> generateParenthesis(int n)', cmp: 'setOuter',
    tests: [
      t([3], ['((()))', '(()())', '(())()', '()(())', '()()()']), t([1], ['()']), t([2], ['(())', '()()']),
      h([1], ['()']), h([2], ['(())', '()()']),
      h([4], ['(((())))', '((()()))', '((())())', '((()))()', '(()(()))', '(()()())', '(()())()', '(())(())', '(())()()', '()((()))', '()(()())', '()(())()', '()()(())', '()()()()'])
    ]
  });

  P({
    n: 79, title: 'Word Search', diff: 'Medium',
    desc: '<p>Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> if <code>word</code> exists in the grid.</p><p>The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once. The board is shown as an array of row strings.</p>',
    ex: [['board = ["ABCE","SFCS","ADEE"], word = "ABCCED"', 'true'], ['board = ["ABCE","SFCS","ADEE"], word = "SEE"', 'true'], ['board = ["ABCE","SFCS","ADEE"], word = "ABCB"', 'false']],
    sig: 'boolean exist(char[][] board, String word)',
    tests: [
      t([['ABCE', 'SFCS', 'ADEE'], 'ABCCED'], true), t([['ABCE', 'SFCS', 'ADEE'], 'SEE'], true), t([['ABCE', 'SFCS', 'ADEE'], 'ABCB'], false),
      h([['A'], 'A'], true), h([['AB', 'CD'], 'ACDB'], true), h([['AA'], 'AAA'], false), h([['ABCE', 'SFES', 'ADEE'], 'ABCESEEEFS'], true)
    ]
  });

  P({
    n: 131, title: 'Palindrome Partitioning', diff: 'Medium',
    desc: '<p>Given a string <code>s</code>, partition <code>s</code> such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of <code>s</code>. You may return the partitions in any order.</p>',
    ex: [['s = "aab"', '[["a","a","b"],["aa","b"]]'], ['s = "a"', '[["a"]]']],
    sig: 'List<List<String>> partition(String s)', cmp: 'setOuter',
    tests: [
      t(['aab'], [['a', 'a', 'b'], ['aa', 'b']]), t(['a'], [['a']]), t(['aba'], [['a', 'b', 'a'], ['aba']]),
      h(['ab'], [['a', 'b']]), h(['aaa'], [['a', 'a', 'a'], ['a', 'aa'], ['aa', 'a'], ['aaa']]), h(['abba'], [['a', 'b', 'b', 'a'], ['a', 'bb', 'a'], ['abba']])
    ]
  });

  P({
    n: 51, title: 'N-Queens', diff: 'Hard',
    desc: '<p>The n-queens puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.</p><p>Given an integer <code>n</code>, return all distinct solutions to the n-queens puzzle. You may return the answer in any order. Each solution contains a distinct board configuration where <code>\'Q\'</code> and <code>\'.\'</code> both indicate a queen and an empty space, respectively.</p>',
    ex: [['n = 4', '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]'], ['n = 1', '[["Q"]]']],
    sig: 'List<List<String>> solveNQueens(int n)', cmp: 'setOuter',
    tests: [
      t([4], [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']]), t([1], [['Q']]), t([2], []),
      h([3], []),
      h([6], [['.Q....', '...Q..', '.....Q', 'Q.....', '..Q...', '....Q.'], ['..Q...', '.....Q', '.Q....', '....Q.', 'Q.....', '...Q..'], ['...Q..', 'Q.....', '....Q.', '.Q....', '.....Q', '..Q...'], ['....Q.', '..Q...', 'Q.....', '.....Q', '...Q..', '.Q....']])
    ]
  });

  P({
    n: 35, title: 'Search Insert Position', diff: 'Easy',
    desc: '<p>Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.</p><p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>',
    ex: [['nums = [1,3,5,6], target = 5', '2'], ['nums = [1,3,5,6], target = 2', '1'], ['nums = [1,3,5,6], target = 7', '4']],
    sig: 'int searchInsert(int[] nums, int target)',
    tests: [
      t([[1, 3, 5, 6], 5], 2), t([[1, 3, 5, 6], 2], 1), t([[1, 3, 5, 6], 7], 4),
      h([[1], 0], 0), h([[1, 3], 3], 1), h([[1, 3, 5, 6], 0], 0),
      h([R('JKRT.range(1,100000)', '[1..100000]'), 100001], 100000, 'nums = [1..100000], target = 100001')
    ]
  });

  P({
    n: 74, title: 'Search a 2D Matrix', diff: 'Medium',
    desc: '<p>You are given an <code>m x n</code> integer matrix <code>matrix</code> with the following two properties: each row is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row.</p><p>Given an integer <code>target</code>, return <code>true</code> if <code>target</code> is in <code>matrix</code> or <code>false</code> otherwise. You must write a solution in <code>O(log(m * n))</code> time complexity.</p>',
    ex: [['matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', 'true'], ['matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', 'false']],
    sig: 'boolean searchMatrix(int[][] matrix, int target)',
    tests: [
      t([[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], true), t([[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], false),
      h([[[1]], 1], true), h([[[1]], 2], false), h([[[1, 3]], 3], true), h([[[1], [3]], 3], true)
    ]
  });

  P({
    n: 34, title: 'Find First and Last Position of Element in Sorted Array', diff: 'Medium',
    desc: '<p>Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value. If <code>target</code> is not found in the array, return <code>[-1, -1]</code>.</p><p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>',
    ex: [['nums = [5,7,7,8,8,10], target = 8', '[3,4]'], ['nums = [5,7,7,8,8,10], target = 6', '[-1,-1]'], ['nums = [], target = 0', '[-1,-1]']],
    sig: 'int[] searchRange(int[] nums, int target)',
    tests: [
      t([[5, 7, 7, 8, 8, 10], 8], [3, 4]), t([[5, 7, 7, 8, 8, 10], 6], [-1, -1]), t([[], 0], [-1, -1]),
      h([[1], 1], [0, 0]), h([[2, 2], 2], [0, 1]), h([[1, 2, 3], 2], [1, 1]),
      h([R('JKRT.fill(100000,5)', '[5] x 100000'), 5], [0, 99999], 'nums = [5] x 100000, target = 5')
    ]
  });

  P({
    n: 33, title: 'Search in Rotated Sorted Array', diff: 'Medium',
    desc: '<p>There is an integer array <code>nums</code> sorted in ascending order (with distinct values). Prior to being passed to your function, <code>nums</code> is possibly rotated at an unknown pivot index, e.g. <code>[0,1,2,4,5,6,7]</code> might become <code>[4,5,6,7,0,1,2]</code>.</p><p>Given the array after the possible rotation and an integer <code>target</code>, return the index of <code>target</code> if it is in <code>nums</code>, or <code>-1</code> if it is not. You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>',
    ex: [['nums = [4,5,6,7,0,1,2], target = 0', '4'], ['nums = [4,5,6,7,0,1,2], target = 3', '-1'], ['nums = [1], target = 0', '-1']],
    sig: 'int search(int[] nums, int target)',
    tests: [
      t([[4, 5, 6, 7, 0, 1, 2], 0], 4), t([[4, 5, 6, 7, 0, 1, 2], 3], -1), t([[1], 0], -1),
      h([[1], 1], 0), h([[3, 1], 1], 1), h([[5, 1, 3], 5], 0), h([[4, 5, 6, 7, 0, 1, 2], 4], 0),
      h([R('JKRT.concat(JKRT.range(50001,100000), JKRT.range(1,50000))', 'rotated [1..100000]'), 77], 50076, 'nums = [1..100000] rotated, target = 77')
    ]
  });

  P({
    n: 153, title: 'Find Minimum in Rotated Sorted Array', diff: 'Medium',
    desc: '<p>Suppose an array of length <code>n</code> sorted in ascending order (with unique elements) is rotated between <code>1</code> and <code>n</code> times. Given the sorted rotated array <code>nums</code>, return the minimum element of this array.</p><p>You must write an algorithm that runs in <code>O(log n)</code> time.</p>',
    ex: [['nums = [3,4,5,1,2]', '1'], ['nums = [4,5,6,7,0,1,2]', '0'], ['nums = [11,13,15,17]', '11']],
    sig: 'int findMin(int[] nums)',
    tests: [
      t([[3, 4, 5, 1, 2]], 1), t([[4, 5, 6, 7, 0, 1, 2]], 0), t([[11, 13, 15, 17]], 11),
      h([[1]], 1), h([[2, 1]], 1), h([[5, 1, 2, 3, 4]], 1),
      h([R('JKRT.concat(JKRT.range(50001,100000), JKRT.range(1,50000))', 'rotated [1..100000]')], 1, 'nums = [1..100000] rotated')
    ]
  });

  P({
    n: 4, title: 'Median of Two Sorted Arrays', diff: 'Hard',
    desc: '<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.</p><p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>',
    ex: [['nums1 = [1,3], nums2 = [2]', '2.0', 'merged = [1,2,3], median = 2'], ['nums1 = [1,2], nums2 = [3,4]', '2.5', 'merged = [1,2,3,4], median = (2 + 3) / 2']],
    sig: 'double findMedianSortedArrays(int[] nums1, int[] nums2)', cmp: 'approx',
    tests: [
      t([[1, 3], [2]], 2.0), t([[1, 2], [3, 4]], 2.5), t([[0, 0], [0, 0]], 0.0),
      h([[], [1]], 1.0), h([[2], []], 2.0), h([[1, 3], [2, 7]], 2.5), h([[1], [2, 3, 4, 5, 6]], 3.5), h([[4, 5, 6, 8, 9], []], 6.0),
      h([R('JKRT.range(1,50000)', '[1..50000]'), R('JKRT.range(50001,100000)', '[50001..100000]')], 50000.5, 'nums1 = [1..50000], nums2 = [50001..100000]')
    ]
  });

  P({
    n: 20, title: 'Valid Parentheses', diff: 'Easy',
    desc: '<p>Given a string <code>s</code> containing just the characters <code>\'(\'</code>, <code>\')\'</code>, <code>\'{\'</code>, <code>\'}\'</code>, <code>\'[\'</code> and <code>\']\'</code>, determine if the input string is valid.</p><p>An input string is valid if open brackets are closed by the same type of bracket, and in the correct order. Every close bracket has a corresponding open bracket of the same type.</p>',
    ex: [['s = "()"', 'true'], ['s = "()[]{}"', 'true'], ['s = "(]"', 'false']],
    sig: 'boolean isValid(String s)',
    tests: [
      t(['()'], true), t(['()[]{}'], true), t(['(]'], false),
      h(['([)]'], false), h(['{[]}'], true), h(['('], false), h([']'], false),
      h([R('"(".repeat(50000) + ")".repeat(50000)', '"(" x 50000 + ")" x 50000')], true, 's = "(" x 50000 + ")" x 50000')
    ]
  });

  P({
    n: 155, title: 'Min Stack', diff: 'Medium',
    desc: '<p>Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.</p><p>Implement <code>MinStack()</code>; <code>void push(int val)</code> pushes the element onto the stack; <code>void pop()</code> removes the element on the top; <code>int top()</code> gets the top element; <code>int getMin()</code> retrieves the minimum element in the stack. Each function must run in <code>O(1)</code> time.</p>',
    ex: [['["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', '[null,null,null,null,-3,null,0,-2]']],
    design: { ctor: 'MinStack()', methods: ['void push(int val)', 'void pop()', 'int top()', 'int getMin()'] },
    tests: [
      dt(['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [[], [-2], [0], [-3], [], [], [], []], [null, null, null, null, -3, null, 0, -2]),
      dt(['MinStack', 'push', 'push', 'getMin', 'top', 'pop', 'getMin'], [[], [5], [3], [], [], [], []], [null, null, null, 3, 3, null, 5]),
      dh(['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin'], [[], [2], [2], [1], [], [], [], [], []], [null, null, null, null, 1, null, 2, null, 2]),
      dh(['MinStack', 'push', 'getMin', 'top', 'push', 'getMin', 'top'], [[], [-5], [], [], [7], [], []], [null, null, -5, -5, null, -5, 7])
    ]
  });

  P({
    n: 394, title: 'Decode String', diff: 'Medium',
    desc: '<p>Given an encoded string, return its decoded string.</p><p>The encoding rule is: <code>k[encoded_string]</code>, where the <code>encoded_string</code> inside the square brackets is being repeated exactly <code>k</code> times. Note that <code>k</code> is guaranteed to be a positive integer, the input is always valid, and the original data does not contain any digits (digits are only for repeat numbers <code>k</code>).</p>',
    ex: [['s = "3[a]2[bc]"', '"aaabcbc"'], ['s = "3[a2[c]]"', '"accaccacc"'], ['s = "2[abc]3[cd]ef"', '"abcabccdcdcdef"']],
    sig: 'String decodeString(String s)',
    tests: [
      t(['3[a]2[bc]'], 'aaabcbc'), t(['3[a2[c]]'], 'accaccacc'), t(['2[abc]3[cd]ef'], 'abcabccdcdcdef'),
      h(['abc'], 'abc'), h(['10[a]'], 'aaaaaaaaaa'), h(['a2[b]c'], 'abbc'), h(['2[2[2[a]]]'], 'aaaaaaaa')
    ]
  });

  P({
    n: 739, title: 'Daily Temperatures', diff: 'Medium',
    desc: '<p>Given an array of integers <code>temperatures</code> that represents the daily temperatures, return an array <code>answer</code> such that <code>answer[i]</code> is the number of days you have to wait after the <code>i</code>th day to get a warmer temperature. If there is no future day for which this is possible, keep <code>answer[i] == 0</code> instead.</p>',
    ex: [['temperatures = [73,74,75,71,69,72,76,73]', '[1,1,4,2,1,1,0,0]'], ['temperatures = [30,40,50,60]', '[1,1,1,0]'], ['temperatures = [30,60,90]', '[1,1,0]']],
    sig: 'int[] dailyTemperatures(int[] temperatures)',
    tests: [
      t([[73, 74, 75, 71, 69, 72, 76, 73]], [1, 1, 4, 2, 1, 1, 0, 0]), t([[30, 40, 50, 60]], [1, 1, 1, 0]), t([[30, 60, 90]], [1, 1, 0]),
      h([[90, 80, 70]], [0, 0, 0]), h([[55]], [0]), h([[30, 30, 30]], [0, 0, 0]),
      h([R('JKRT.rangeDesc(100000,1)', '[100000..1]')], R('JKRT.fill(100000,0)', '[0] x 100000'), 'temperatures = [100000..1]')
    ]
  });

  P({
    n: 84, title: 'Largest Rectangle in Histogram', diff: 'Hard',
    desc: '<p>Given an array of integers <code>heights</code> representing the histogram\'s bar height where the width of each bar is <code>1</code>, return the area of the largest rectangle in the histogram.</p>',
    ex: [['heights = [2,1,5,6,2,3]', '10', 'The largest rectangle spans the bars of height 5 and 6.'], ['heights = [2,4]', '4']],
    sig: 'int largestRectangleArea(int[] heights)',
    tests: [
      t([[2, 1, 5, 6, 2, 3]], 10), t([[2, 4]], 4), t([[1]], 1),
      h([[2, 1, 2]], 3), h([[6, 2, 5, 4, 5, 1, 6]], 12), h([[1, 1, 1, 1]], 4), h([[0, 9]], 9), h([[5, 4, 3, 2, 1]], 9),
      h([R('JKRT.fill(100000,2)', '[2] x 100000')], 200000, 'heights = [2] x 100000')
    ]
  });
})();
