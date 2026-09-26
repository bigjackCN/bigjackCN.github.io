/*
 * problems.js - the problem bank.
 *
 * To add a problem, append an object to JK_PROBLEMS. Fields:
 *   id, title, difficulty ('Easy'|'Medium'|'Hard'), tags[]
 *   desc         HTML paragraph(s)
 *   examples     [{in, out, note?}]   (display only)
 *   constraints  [string]
 *   pre          optional comment block shown at the top of the starter code
 *   sig          {method, params:[[javaType, name], ...], ret: javaType}
 *   compare      'exact' (default) | 'unordered' (ignore list/array order, at every level) | 'approx' (doubles)
 *   tests        [{a:[arg values as JSON], e:expected, h:true if hidden}]
 *                an arg / expected may be {java:'JKRT.range(1,100000)', show:'text to display'}
 *   solution     reference solution (revealed on demand, also used by scripts/verify-interview.js)
 *
 * Supported types: int long double boolean String char, int[] long[] double[] boolean[] String[] char[]
 * int[][] char[][] (JSON = array of row strings), List<Integer> List<String>, ListNode, ListNode[],
 * TreeNode (JSON = level-order array with nulls), and nested List<List<...>> for return values.
 *
 * Run `node scripts/verify-interview.js` after editing to check every reference solution passes.
 */
(function (root) {
  var LIST_PRE = '// ListNode is provided:\n// class ListNode { int val; ListNode next; ListNode() {} ListNode(int val) {...} ListNode(int val, ListNode next) {...} }\n';
  var TREE_PRE = '// TreeNode is provided:\n// class TreeNode { int val; TreeNode left, right; TreeNode() {} TreeNode(int val) {...} TreeNode(int val, TreeNode left, TreeNode right) {...} }\n';

  root.JK_PROBLEMS = [

  /* ================================================================ EASY */
  {
    id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'],
    desc: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to <code>target</code>.</p><p>You may assume that each input has <b>exactly one solution</b>, and you may not use the same element twice. You can return the answer in any order.</p>',
    examples: [
      { in: 'nums = [2,7,11,15], target = 9', out: '[0,1]', note: 'nums[0] + nums[1] == 9' },
      { in: 'nums = [3,2,4], target = 6', out: '[1,2]' },
      { in: 'nums = [3,3], target = 6', out: '[0,1]' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists.'],
    sig: { method: 'twoSum', params: [['int[]', 'nums'], ['int', 'target']], ret: 'int[]' },
    compare: 'unordered',
    tests: [
      { a: [[2, 7, 11, 15], 9], e: [0, 1] },
      { a: [[3, 2, 4], 6], e: [1, 2] },
      { a: [[3, 3], 6], e: [0, 1] },
      { a: [[-1, -2, -3, -4, -5], -8], e: [2, 4], h: true },
      { a: [[0, 4, 3, 0], 0], e: [0, 3], h: true },
      { a: [[1000000000, 5, -1000000000, 7], 12], e: [1, 3], h: true },
      { a: [{ java: 'JKRT.range(1,100000)', show: 'nums = [1..100000]' }, 199999], e: [99998, 99999], h: true, show: 'nums = [1..100000], target = 199999' }
    ],
    solution: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            Integer j = seen.get(target - nums[i]);\n            if (j != null) return new int[]{j, i};\n            seen.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}\n'
  },
  {
    id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', tags: ['String', 'Stack'],
    desc: '<p>Given a string <code>s</code> containing just the characters <code>\'(\'</code>, <code>\')\'</code>, <code>\'{\'</code>, <code>\'}\'</code>, <code>\'[\'</code> and <code>\']\'</code>, determine if the input string is valid.</p><p>An input string is valid if open brackets are closed by the same type of bracket, and in the correct order. Every close bracket has a corresponding open bracket of the same type.</p>',
    examples: [
      { in: 's = "()"', out: 'true' },
      { in: 's = "()[]{}"', out: 'true' },
      { in: 's = "(]"', out: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^5', 's consists of parentheses only \'()[]{}\'.'],
    sig: { method: 'isValid', params: [['String', 's']], ret: 'boolean' },
    tests: [
      { a: ['()'], e: true },
      { a: ['()[]{}'], e: true },
      { a: ['(]'], e: false },
      { a: ['([)]'], e: false, h: true },
      { a: ['{[]}'], e: true, h: true },
      { a: ['('], e: false, h: true },
      { a: [']'], e: false, h: true },
      { a: [{ java: '"(".repeat(50000) + ")".repeat(50000)', show: '"(" x 50000 + ")" x 50000' }], e: true, h: true, show: 's = "(" x 50000 + ")" x 50000' }
    ],
    solution: 'class Solution {\n    public boolean isValid(String s) {\n        Deque<Character> st = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\') st.push(\')\');\n            else if (c == \'[\') st.push(\']\');\n            else if (c == \'{\') st.push(\'}\');\n            else if (st.isEmpty() || st.pop() != c) return false;\n        }\n        return st.isEmpty();\n    }\n}\n'
  },
  {
    id: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', tags: ['Array', 'Greedy'],
    desc: '<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i</code>-th day.</p><p>You want to maximize your profit by choosing a <b>single day</b> to buy one stock and choosing a <b>different day in the future</b> to sell it. Return the maximum profit you can achieve. If you cannot achieve any profit, return <code>0</code>.</p>',
    examples: [
      { in: 'prices = [7,1,5,3,6,4]', out: '5', note: 'Buy on day 2 (price 1), sell on day 5 (price 6).' },
      { in: 'prices = [7,6,4,3,1]', out: '0', note: 'No profitable transaction exists.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    sig: { method: 'maxProfit', params: [['int[]', 'prices']], ret: 'int' },
    tests: [
      { a: [[7, 1, 5, 3, 6, 4]], e: 5 },
      { a: [[7, 6, 4, 3, 1]], e: 0 },
      { a: [[1]], e: 0 },
      { a: [[2, 4, 1]], e: 2, h: true },
      { a: [[3, 2, 6, 5, 0, 3]], e: 4, h: true },
      { a: [[1, 2]], e: 1, h: true },
      { a: [{ java: 'JKRT.range(1,100000)', show: '[1..100000]' }], e: 99999, h: true, show: 'prices = [1..100000]' }
    ],
    solution: 'class Solution {\n    public int maxProfit(int[] prices) {\n        int min = Integer.MAX_VALUE, best = 0;\n        for (int p : prices) {\n            min = Math.min(min, p);\n            best = Math.max(best, p - min);\n        }\n        return best;\n    }\n}\n'
  },
  {
    id: 'contains-duplicate', title: 'Contains Duplicate', difficulty: 'Easy', tags: ['Array', 'Hash Table'],
    desc: '<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <b>at least twice</b> in the array, and return <code>false</code> if every element is distinct.</p>',
    examples: [
      { in: 'nums = [1,2,3,1]', out: 'true' },
      { in: 'nums = [1,2,3,4]', out: 'false' },
      { in: 'nums = [1,1,1,3,3,4,3,2,4,2]', out: 'true' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    sig: { method: 'containsDuplicate', params: [['int[]', 'nums']], ret: 'boolean' },
    tests: [
      { a: [[1, 2, 3, 1]], e: true },
      { a: [[1, 2, 3, 4]], e: false },
      { a: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], e: true },
      { a: [[1]], e: false, h: true },
      { a: [[-1, -1]], e: true, h: true },
      { a: [[1000000000, -1000000000, 0]], e: false, h: true },
      { a: [{ java: 'JKRT.range(1,100000)', show: '[1..100000]' }], e: false, h: true, show: 'nums = [1..100000]' }
    ],
    solution: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int x : nums) if (!seen.add(x)) return true;\n        return false;\n    }\n}\n'
  },
  {
    id: 'valid-anagram', title: 'Valid Anagram', difficulty: 'Easy', tags: ['String', 'Hash Table', 'Sorting'],
    desc: '<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.</p><p>An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.</p>',
    examples: [
      { in: 's = "anagram", t = "nagaram"', out: 'true' },
      { in: 's = "rat", t = "car"', out: 'false' }
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    sig: { method: 'isAnagram', params: [['String', 's'], ['String', 't']], ret: 'boolean' },
    tests: [
      { a: ['anagram', 'nagaram'], e: true },
      { a: ['rat', 'car'], e: false },
      { a: ['a', 'ab'], e: false },
      { a: ['aacc', 'ccac'], e: false, h: true },
      { a: ['listen', 'silent'], e: true, h: true },
      { a: ['a', 'a'], e: true, h: true },
      { a: [{ java: '"ab".repeat(25000)', show: '"ab" x 25000' }, { java: '"ba".repeat(25000)', show: '"ba" x 25000' }], e: true, h: true, show: 's = "ab" x 25000, t = "ba" x 25000' }
    ],
    solution: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] cnt = new int[26];\n        for (int i = 0; i < s.length(); i++) { cnt[s.charAt(i) - \'a\']++; cnt[t.charAt(i) - \'a\']--; }\n        for (int c : cnt) if (c != 0) return false;\n        return true;\n    }\n}\n'
  },
  {
    id: 'reverse-linked-list', title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List'],
    desc: '<p>Given the <code>head</code> of a singly linked list, reverse the list, and return <i>the reversed list</i>.</p><p><b>Follow-up:</b> can you do it both iteratively and recursively?</p>',
    examples: [
      { in: 'head = [1,2,3,4,5]', out: '[5,4,3,2,1]' },
      { in: 'head = [1,2]', out: '[2,1]' },
      { in: 'head = []', out: '[]' }
    ],
    constraints: ['The number of nodes in the list is in the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    pre: LIST_PRE,
    sig: { method: 'reverseList', params: [['ListNode', 'head']], ret: 'ListNode' },
    tests: [
      { a: [[1, 2, 3, 4, 5]], e: [5, 4, 3, 2, 1] },
      { a: [[1, 2]], e: [2, 1] },
      { a: [[]], e: [] },
      { a: [[7]], e: [7], h: true },
      { a: [[-1, 0, 1]], e: [1, 0, -1], h: true },
      { a: [{ java: 'JKRT.list(JKRT.range(1,100000))', show: '[1..100000]' }], e: { java: 'JKRT.list(JKRT.rangeDesc(100000,1))', show: '[100000..1]' }, h: true, show: 'head = [1..100000]' }
    ],
    solution: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        while (head != null) {\n            ListNode next = head.next;\n            head.next = prev;\n            prev = head;\n            head = next;\n        }\n        return prev;\n    }\n}\n'
  },
  {
    id: 'maximum-depth-of-binary-tree', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', tags: ['Tree', 'DFS', 'BFS'],
    desc: '<p>Given the <code>root</code> of a binary tree, return its <b>maximum depth</b>.</p><p>A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.</p><p>The tree is given in level-order with <code>null</code> for missing children.</p>',
    examples: [
      { in: 'root = [3,9,20,null,null,15,7]', out: '3' },
      { in: 'root = [1,null,2]', out: '2' }
    ],
    constraints: ['The number of nodes is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    pre: TREE_PRE,
    sig: { method: 'maxDepth', params: [['TreeNode', 'root']], ret: 'int' },
    tests: [
      { a: [[3, 9, 20, null, null, 15, 7]], e: 3 },
      { a: [[1, null, 2]], e: 2 },
      { a: [[]], e: 0 },
      { a: [[1]], e: 1, h: true },
      { a: [[1, 2, 3, 4, null, null, 5]], e: 3, h: true },
      { a: [{ java: 'JKRT.rightChain(5000)', show: 'right-skewed tree with 5000 nodes' }], e: 5000, h: true, show: 'root = right-skewed tree with 5000 nodes' }
    ],
    solution: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}\n'
  },
  {
    id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', tags: ['Dynamic Programming', 'Math'],
    desc: '<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p><p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>',
    examples: [
      { in: 'n = 2', out: '2', note: '1 + 1, or 2' },
      { in: 'n = 3', out: '3', note: '1+1+1, 1+2, 2+1' }
    ],
    constraints: ['1 <= n <= 45'],
    sig: { method: 'climbStairs', params: [['int', 'n']], ret: 'int' },
    tests: [
      { a: [2], e: 2 },
      { a: [3], e: 3 },
      { a: [1], e: 1 },
      { a: [5], e: 8, h: true },
      { a: [10], e: 89, h: true },
      { a: [30], e: 1346269, h: true },
      { a: [45], e: 1836311903, h: true }
    ],
    solution: 'class Solution {\n    public int climbStairs(int n) {\n        int a = 1, b = 1;\n        for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }\n        return b;\n    }\n}\n'
  },
  {
    id: 'binary-search', title: 'Binary Search', difficulty: 'Easy', tags: ['Array', 'Binary Search'],
    desc: '<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, return the index of <code>target</code> in <code>nums</code>, or <code>-1</code> if it does not exist.</p><p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>',
    examples: [
      { in: 'nums = [-1,0,3,5,9,12], target = 9', out: '4' },
      { in: 'nums = [-1,0,3,5,9,12], target = 2', out: '-1' }
    ],
    constraints: ['1 <= nums.length <= 10^5', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
    sig: { method: 'search', params: [['int[]', 'nums'], ['int', 'target']], ret: 'int' },
    tests: [
      { a: [[-1, 0, 3, 5, 9, 12], 9], e: 4 },
      { a: [[-1, 0, 3, 5, 9, 12], 2], e: -1 },
      { a: [[5], 5], e: 0 },
      { a: [[5], -5], e: -1, h: true },
      { a: [[1, 3], 3], e: 1, h: true },
      { a: [[2, 5], 2], e: 0, h: true },
      { a: [{ java: 'JKRT.range(1,100000)', show: '[1..100000]' }, 77777], e: 77776, h: true, show: 'nums = [1..100000], target = 77777' },
      { a: [{ java: 'JKRT.range(1,100000)', show: '[1..100000]' }, 0], e: -1, h: true, show: 'nums = [1..100000], target = 0' }
    ],
    solution: 'class Solution {\n    public int search(int[] nums, int target) {\n        int lo = 0, hi = nums.length - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n        }\n        return -1;\n    }\n}\n'
  },

  /* ================================================================ MEDIUM */
  {
    id: 'product-of-array-except-self', title: 'Product of Array Except Self', difficulty: 'Medium', tags: ['Array', 'Prefix Sum'],
    desc: '<p>Given an integer array <code>nums</code>, return an array <code>answer</code> such that <code>answer[i]</code> is equal to the product of all the elements of <code>nums</code> except <code>nums[i]</code>.</p><p>The product of any prefix or suffix of <code>nums</code> is guaranteed to fit in a <b>32-bit</b> integer. You must write an algorithm that runs in <code>O(n)</code> time and <b>without using the division operation</b>.</p>',
    examples: [
      { in: 'nums = [1,2,3,4]', out: '[24,12,8,6]' },
      { in: 'nums = [-1,1,0,-3,3]', out: '[0,0,9,0,0]' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    sig: { method: 'productExceptSelf', params: [['int[]', 'nums']], ret: 'int[]' },
    tests: [
      { a: [[1, 2, 3, 4]], e: [24, 12, 8, 6] },
      { a: [[-1, 1, 0, -3, 3]], e: [0, 0, 9, 0, 0] },
      { a: [[2, 3]], e: [3, 2] },
      { a: [[0, 0]], e: [0, 0], h: true },
      { a: [[1, 1, 1]], e: [1, 1, 1], h: true },
      { a: [[5, 0, 2]], e: [0, 10, 0], h: true },
      { a: [{ java: 'JKRT.fill(100000,1)', show: '[1] x 100000' }], e: { java: 'JKRT.fill(100000,1)', show: '[1] x 100000' }, h: true, show: 'nums = [1] x 100000' }
    ],
    solution: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] ans = new int[n];\n        ans[0] = 1;\n        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];\n        int right = 1;\n        for (int i = n - 1; i >= 0; i--) { ans[i] *= right; right *= nums[i]; }\n        return ans;\n    }\n}\n'
  },
  {
    id: 'maximum-subarray', title: 'Maximum Subarray', difficulty: 'Medium', tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    desc: '<p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <i>its sum</i>.</p>',
    examples: [
      { in: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', out: '6', note: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { in: 'nums = [1]', out: '1' },
      { in: 'nums = [5,4,-1,7,8]', out: '23' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    sig: { method: 'maxSubArray', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { a: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], e: 6 },
      { a: [[1]], e: 1 },
      { a: [[5, 4, -1, 7, 8]], e: 23 },
      { a: [[-1]], e: -1, h: true },
      { a: [[-2, -1]], e: -1, h: true },
      { a: [[-3, -2, -5]], e: -2, h: true },
      { a: [[8, -19, 5, -4, 20]], e: 21, h: true },
      { a: [{ java: 'JKRT.fill(100000,1)', show: '[1] x 100000' }], e: 100000, h: true, show: 'nums = [1] x 100000' }
    ],
    solution: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        int cur = nums[0], best = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            cur = Math.max(nums[i], cur + nums[i]);\n            best = Math.max(best, cur);\n        }\n        return best;\n    }\n}\n'
  },
  {
    id: '3sum', title: '3Sum', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Sorting'],
    desc: '<p>Given an integer array <code>nums</code>, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p><p>The solution set must <b>not</b> contain duplicate triplets. The order of the triplets, and of the numbers inside a triplet, does not matter.</p>',
    examples: [
      { in: 'nums = [-1,0,1,2,-1,-4]', out: '[[-1,-1,2],[-1,0,1]]' },
      { in: 'nums = [0,1,1]', out: '[]' },
      { in: 'nums = [0,0,0]', out: '[[0,0,0]]' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    sig: { method: 'threeSum', params: [['int[]', 'nums']], ret: 'List<List<Integer>>' },
    compare: 'unordered',
    tests: [
      { a: [[-1, 0, 1, 2, -1, -4]], e: [[-1, -1, 2], [-1, 0, 1]] },
      { a: [[0, 1, 1]], e: [] },
      { a: [[0, 0, 0]], e: [[0, 0, 0]] },
      { a: [[0, 0, 0, 0]], e: [[0, 0, 0]], h: true },
      { a: [[-2, 0, 1, 1, 2]], e: [[-2, 0, 2], [-2, 1, 1]], h: true },
      { a: [[3, 0, -2, -1, 1, 2]], e: [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]], h: true },
      { a: [[1, 2, -2, -1]], e: [], h: true },
      { a: [{ java: 'JKRT.fill(3000,0)', show: '[0] x 3000' }], e: [[0, 0, 0]], h: true, show: 'nums = [0] x 3000' }
    ],
    solution: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s < 0) l++;\n                else if (s > 0) r--;\n                else {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    l++; r--;\n                    while (l < r && nums[l] == nums[l - 1]) l++;\n                    while (l < r && nums[r] == nums[r + 1]) r--;\n                }\n            }\n        }\n        return res;\n    }\n}\n'
  },
  {
    id: 'group-anagrams', title: 'Group Anagrams', difficulty: 'Medium', tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    desc: '<p>Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in <b>any order</b>.</p>',
    examples: [
      { in: 'strs = ["eat","tea","tan","ate","nat","bat"]', out: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { in: 'strs = [""]', out: '[[""]]' },
      { in: 'strs = ["a"]', out: '[["a"]]' }
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    sig: { method: 'groupAnagrams', params: [['String[]', 'strs']], ret: 'List<List<String>>' },
    compare: 'unordered',
    tests: [
      { a: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], e: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
      { a: [['']], e: [['']] },
      { a: [['a']], e: [['a']] },
      { a: [['ab', 'ba', 'abc']], e: [['ab', 'ba'], ['abc']], h: true },
      { a: [['abc', 'bca', 'cab', 'xyz']], e: [['abc', 'bca', 'cab'], ['xyz']], h: true },
      { a: [['', '']], e: [['', '']], h: true },
      { a: [['listen', 'silent', 'enlist', 'google', 'gogole']], e: [['listen', 'silent', 'enlist'], ['google', 'gogole']], h: true }
    ],
    solution: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] c = s.toCharArray();\n            Arrays.sort(c);\n            map.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}\n'
  },
  {
    id: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', tags: ['String', 'Sliding Window', 'Hash Table'],
    desc: '<p>Given a string <code>s</code>, find the length of the <b>longest substring</b> without repeating characters.</p>',
    examples: [
      { in: 's = "abcabcbb"', out: '3', note: 'The answer is "abc", with the length of 3.' },
      { in: 's = "bbbbb"', out: '1' },
      { in: 's = "pwwkew"', out: '3', note: '"wke" is a substring; "pwke" is a subsequence, not a substring.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    sig: { method: 'lengthOfLongestSubstring', params: [['String', 's']], ret: 'int' },
    tests: [
      { a: ['abcabcbb'], e: 3 },
      { a: ['bbbbb'], e: 1 },
      { a: ['pwwkew'], e: 3 },
      { a: [''], e: 0, h: true },
      { a: [' '], e: 1, h: true },
      { a: ['dvdf'], e: 3, h: true },
      { a: ['abba'], e: 2, h: true },
      { a: ['tmmzuxt'], e: 5, h: true },
      { a: [{ java: '"abcdefghij".repeat(10000)', show: '"abcdefghij" x 10000' }], e: 10, h: true, show: 's = "abcdefghij" x 10000' }
    ],
    solution: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> last = new HashMap<>();\n        int best = 0, left = 0;\n        for (int r = 0; r < s.length(); r++) {\n            char c = s.charAt(r);\n            if (last.containsKey(c) && last.get(c) >= left) left = last.get(c) + 1;\n            last.put(c, r);\n            best = Math.max(best, r - left + 1);\n        }\n        return best;\n    }\n}\n'
  },
  {
    id: 'coin-change', title: 'Coin Change', difficulty: 'Medium', tags: ['Dynamic Programming', 'BFS'],
    desc: '<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p><p>Return the <b>fewest number of coins</b> that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>. You may assume that you have an infinite number of each kind of coin.</p>',
    examples: [
      { in: 'coins = [1,2,5], amount = 11', out: '3', note: '11 = 5 + 5 + 1' },
      { in: 'coins = [2], amount = 3', out: '-1' },
      { in: 'coins = [1], amount = 0', out: '0' }
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    sig: { method: 'coinChange', params: [['int[]', 'coins'], ['int', 'amount']], ret: 'int' },
    tests: [
      { a: [[1, 2, 5], 11], e: 3 },
      { a: [[2], 3], e: -1 },
      { a: [[1], 0], e: 0 },
      { a: [[2, 5, 10, 1], 27], e: 4, h: true },
      { a: [[3, 7], 11], e: -1, h: true },
      { a: [[1, 2147483647], 2], e: 2, h: true },
      { a: [[186, 419, 83, 408], 6249], e: 20, h: true },
      { a: [[1, 5, 10, 25, 50], 10000], e: 200, h: true }
    ],
    solution: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int c : coins) {\n                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}\n'
  },
  {
    id: 'number-of-islands', title: 'Number of Islands', difficulty: 'Medium', tags: ['Matrix', 'DFS', 'BFS', 'Union Find'],
    desc: '<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>\'1\'</code>s (land) and <code>\'0\'</code>s (water), return <i>the number of islands</i>.</p><p>An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p><p>The grid is shown as an array of row strings.</p>',
    examples: [
      { in: 'grid = ["11110","11010","11000","00000"]', out: '1' },
      { in: 'grid = ["11000","11000","00100","00011"]', out: '3' }
    ],
    constraints: ['m == grid.length, n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    sig: { method: 'numIslands', params: [['char[][]', 'grid']], ret: 'int' },
    tests: [
      { a: [['11110', '11010', '11000', '00000']], e: 1 },
      { a: [['11000', '11000', '00100', '00011']], e: 3 },
      { a: [['1']], e: 1, h: true },
      { a: [['0']], e: 0, h: true },
      { a: [['101', '010', '101']], e: 5, h: true },
      { a: [['111', '010', '111']], e: 1, h: true },
      { a: [{ java: 'JKRT.grid(200,200,\'1\')', show: '200 x 200 grid of "1"' }], e: 1, h: true, show: 'grid = 200 x 200 grid of "1"' }
    ],
    solution: 'class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int i = 0; i < grid.length; i++)\n            for (int j = 0; j < grid[0].length; j++)\n                if (grid[i][j] == \'1\') { count++; sink(grid, i, j); }\n        return count;\n    }\n    private void sink(char[][] g, int i, int j) {\n        if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != \'1\') return;\n        g[i][j] = \'0\';\n        sink(g, i + 1, j); sink(g, i - 1, j); sink(g, i, j + 1); sink(g, i, j - 1);\n    }\n}\n'
  },
  {
    id: 'top-k-frequent-elements', title: 'Top K Frequent Elements', difficulty: 'Medium', tags: ['Array', 'Hash Table', 'Heap', 'Bucket Sort'],
    desc: '<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <i>the</i> <code>k</code> <i>most frequent elements</i>. You may return the answer in <b>any order</b>.</p><p><b>Follow-up:</b> your algorithm\'s time complexity must be better than <code>O(n log n)</code>.</p>',
    examples: [
      { in: 'nums = [1,1,1,2,2,3], k = 2', out: '[1,2]' },
      { in: 'nums = [1], k = 1', out: '[1]' }
    ],
    constraints: ['1 <= nums.length <= 10^5', 'k is in the range [1, the number of unique elements].', 'The answer is guaranteed to be unique.'],
    sig: { method: 'topKFrequent', params: [['int[]', 'nums'], ['int', 'k']], ret: 'int[]' },
    compare: 'unordered',
    tests: [
      { a: [[1, 1, 1, 2, 2, 3], 2], e: [1, 2] },
      { a: [[1], 1], e: [1] },
      { a: [[4, 1, -1, 2, -1, 2, 3], 2], e: [-1, 2] },
      { a: [[5, 5, 5, 6, 6, 7], 1], e: [5], h: true },
      { a: [[1, 2], 2], e: [1, 2], h: true },
      { a: [[3, 0, 1, 0], 1], e: [0], h: true },
      { a: [[-1, -1], 1], e: [-1], h: true }
    ],
    solution: 'class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int x : nums) freq.merge(x, 1, Integer::sum);\n        List<Integer>[] bucket = new List[nums.length + 1];\n        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {\n            if (bucket[e.getValue()] == null) bucket[e.getValue()] = new ArrayList<>();\n            bucket[e.getValue()].add(e.getKey());\n        }\n        int[] res = new int[k];\n        int idx = 0;\n        for (int f = bucket.length - 1; f >= 0 && idx < k; f--) {\n            if (bucket[f] == null) continue;\n            for (int x : bucket[f]) { if (idx < k) res[idx++] = x; }\n        }\n        return res;\n    }\n}\n'
  },
  {
    id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', tags: ['Array', 'Sorting'],
    desc: '<p>Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return <i>an array of the non-overlapping intervals that cover all the intervals in the input</i>.</p><p>Return the result <b>sorted by start</b>.</p>',
    examples: [
      { in: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', out: '[[1,6],[8,10],[15,18]]' },
      { in: 'intervals = [[1,4],[4,5]]', out: '[[1,5]]', note: 'Intervals [1,4] and [4,5] are considered overlapping.' }
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start<sub>i</sub> <= end<sub>i</sub> <= 10^4'],
    sig: { method: 'merge', params: [['int[][]', 'intervals']], ret: 'int[][]' },
    tests: [
      { a: [[[1, 3], [2, 6], [8, 10], [15, 18]]], e: [[1, 6], [8, 10], [15, 18]] },
      { a: [[[1, 4], [4, 5]]], e: [[1, 5]] },
      { a: [[[1, 4], [0, 4]]], e: [[0, 4]] },
      { a: [[[1, 4], [2, 3]]], e: [[1, 4]], h: true },
      { a: [[[1, 4], [0, 0]]], e: [[0, 0], [1, 4]], h: true },
      { a: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], e: [[1, 10]], h: true },
      { a: [[[1, 3]]], e: [[1, 3]], h: true },
      { a: [[[5, 6], [1, 2], [3, 4]]], e: [[1, 2], [3, 4], [5, 6]], h: true }
    ],
    solution: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> out = new ArrayList<>();\n        for (int[] cur : intervals) {\n            if (out.isEmpty() || out.get(out.size() - 1)[1] < cur[0]) out.add(new int[]{cur[0], cur[1]});\n            else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);\n        }\n        return out.toArray(new int[0][]);\n    }\n}\n'
  },
  {
    id: 'longest-consecutive-sequence', title: 'Longest Consecutive Sequence', difficulty: 'Medium', tags: ['Array', 'Hash Table', 'Union Find'],
    desc: '<p>Given an unsorted array of integers <code>nums</code>, return <i>the length of the longest consecutive elements sequence</i>.</p><p>You must write an algorithm that runs in <code>O(n)</code> time.</p>',
    examples: [
      { in: 'nums = [100,4,200,1,3,2]', out: '4', note: 'The longest sequence is [1, 2, 3, 4].' },
      { in: 'nums = [0,3,7,2,5,8,4,6,0,1]', out: '9' }
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    sig: { method: 'longestConsecutive', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { a: [[100, 4, 200, 1, 3, 2]], e: 4 },
      { a: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], e: 9 },
      { a: [[]], e: 0 },
      { a: [[1, 0, 1, 2]], e: 3, h: true },
      { a: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], e: 7, h: true },
      { a: [[-5]], e: 1, h: true },
      { a: [{ java: 'JKRT.range(1,100000)', show: '[1..100000]' }], e: 100000, h: true, show: 'nums = [1..100000]' }
    ],
    solution: 'class Solution {\n    public int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int x : nums) set.add(x);\n        int best = 0;\n        for (int x : set) {\n            if (set.contains(x - 1)) continue;\n            int len = 1;\n            while (set.contains(x + len)) len++;\n            best = Math.max(best, len);\n        }\n        return best;\n    }\n}\n'
  },
  {
    id: 'word-break', title: 'Word Break', difficulty: 'Medium', tags: ['String', 'Dynamic Programming', 'Trie'],
    desc: '<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.</p><p>Note that the same word in the dictionary may be reused multiple times in the segmentation.</p>',
    examples: [
      { in: 's = "leetcode", wordDict = ["leet","code"]', out: 'true' },
      { in: 's = "applepenapple", wordDict = ["apple","pen"]', out: 'true' },
      { in: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', out: 'false' }
    ],
    constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', 'All the strings of wordDict are unique.'],
    sig: { method: 'wordBreak', params: [['String', 's'], ['List<String>', 'wordDict']], ret: 'boolean' },
    tests: [
      { a: ['leetcode', ['leet', 'code']], e: true },
      { a: ['applepenapple', ['apple', 'pen']], e: true },
      { a: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], e: false },
      { a: ['a', ['a']], e: true, h: true },
      { a: ['cars', ['car', 'ca', 'rs']], e: true, h: true },
      { a: ['aaaaaaa', ['aaaa', 'aaa']], e: true, h: true },
      { a: [{ java: '"a".repeat(299) + "b"', show: '"a" x 299 + "b"' }, ['a', 'aa', 'aaa', 'aaaa']], e: false, h: true, show: 's = "a" x 299 + "b", wordDict = ["a","aa","aaa","aaaa"]' }
    ],
    solution: 'class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> dict = new HashSet<>(wordDict);\n        boolean[] dp = new boolean[s.length() + 1];\n        dp[0] = true;\n        for (int i = 1; i <= s.length(); i++)\n            for (int j = 0; j < i; j++)\n                if (dp[j] && dict.contains(s.substring(j, i))) { dp[i] = true; break; }\n        return dp[s.length()];\n    }\n}\n'
  },
  {
    id: 'house-robber', title: 'House Robber', difficulty: 'Medium', tags: ['Array', 'Dynamic Programming'],
    desc: '<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected: <b>it will automatically contact the police if two adjacent houses were broken into on the same night</b>.</p><p>Given an integer array <code>nums</code> representing the amount of money of each house, return <i>the maximum amount of money you can rob tonight without alerting the police</i>.</p>',
    examples: [
      { in: 'nums = [1,2,3,1]', out: '4', note: 'Rob house 1 (1) and house 3 (3).' },
      { in: 'nums = [2,7,9,3,1]', out: '12', note: 'Rob houses 1, 3 and 5: 2 + 9 + 1.' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    sig: { method: 'rob', params: [['int[]', 'nums']], ret: 'int' },
    tests: [
      { a: [[1, 2, 3, 1]], e: 4 },
      { a: [[2, 7, 9, 3, 1]], e: 12 },
      { a: [[2, 1, 1, 2]], e: 4 },
      { a: [[5]], e: 5, h: true },
      { a: [[1, 2]], e: 2, h: true },
      { a: [[0]], e: 0, h: true },
      { a: [[100, 1, 1, 100]], e: 200, h: true },
      { a: [{ java: 'JKRT.fill(100000,1)', show: '[1] x 100000' }], e: 50000, h: true, show: 'nums = [1] x 100000' }
    ],
    solution: 'class Solution {\n    public int rob(int[] nums) {\n        int take = 0, skip = 0;\n        for (int x : nums) {\n            int nt = skip + x;\n            skip = Math.max(skip, take);\n            take = nt;\n        }\n        return Math.max(take, skip);\n    }\n}\n'
  },

  /* ================================================================ HARD */
  {
    id: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard', tags: ['Array', 'Two Pointers', 'Stack'],
    desc: '<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>',
    examples: [
      { in: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', out: '6' },
      { in: 'height = [4,2,0,3,2,5]', out: '9' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    sig: { method: 'trap', params: [['int[]', 'height']], ret: 'int' },
    tests: [
      { a: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], e: 6 },
      { a: [[4, 2, 0, 3, 2, 5]], e: 9 },
      { a: [[1]], e: 0 },
      { a: [[3, 0, 3]], e: 3, h: true },
      { a: [[2, 0, 2]], e: 2, h: true },
      { a: [[5, 4, 1, 2]], e: 1, h: true },
      { a: [[0, 0, 0]], e: 0, h: true },
      { a: [[1, 2, 3, 4, 5]], e: 0, h: true },
      { a: [{ java: 'JKRT.fill(100000,3)', show: '[3] x 100000' }], e: 0, h: true, show: 'height = [3] x 100000' }
    ],
    solution: 'class Solution {\n    public int trap(int[] h) {\n        int l = 0, r = h.length - 1, lm = 0, rm = 0, water = 0;\n        while (l < r) {\n            if (h[l] < h[r]) {\n                if (h[l] >= lm) lm = h[l]; else water += lm - h[l];\n                l++;\n            } else {\n                if (h[r] >= rm) rm = h[r]; else water += rm - h[r];\n                r--;\n            }\n        }\n        return water;\n    }\n}\n'
  },
  {
    id: 'minimum-window-substring', title: 'Minimum Window Substring', difficulty: 'Hard', tags: ['String', 'Sliding Window', 'Hash Table'],
    desc: '<p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return <i>the minimum window substring</i> of <code>s</code> such that every character in <code>t</code> (<b>including duplicates</b>) is included in the window. If there is no such substring, return the empty string <code>""</code>.</p><p>The testcases are generated such that the answer is <b>unique</b>.</p>',
    examples: [
      { in: 's = "ADOBECODEBANC", t = "ABC"', out: '"BANC"' },
      { in: 's = "a", t = "a"', out: '"a"' },
      { in: 's = "a", t = "aa"', out: '""', note: 'Both \'a\'s from t must be included in the window.' }
    ],
    constraints: ['1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    sig: { method: 'minWindow', params: [['String', 's'], ['String', 't']], ret: 'String' },
    tests: [
      { a: ['ADOBECODEBANC', 'ABC'], e: 'BANC' },
      { a: ['a', 'a'], e: 'a' },
      { a: ['a', 'aa'], e: '' },
      { a: ['ab', 'b'], e: 'b', h: true },
      { a: ['aa', 'aa'], e: 'aa', h: true },
      { a: ['cabwefgewcwaefgcf', 'cae'], e: 'cwae', h: true },
      { a: ['bba', 'ab'], e: 'ba', h: true },
      { a: [{ java: '"a".repeat(50000) + "b"', show: '"a" x 50000 + "b"' }, 'ab'], e: 'ab', h: true, show: 's = "a" x 50000 + "b", t = "ab"' }
    ],
    solution: 'class Solution {\n    public String minWindow(String s, String t) {\n        int[] need = new int[128];\n        for (char c : t.toCharArray()) need[c]++;\n        int missing = t.length(), left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;\n        for (int r = 0; r < s.length(); r++) {\n            if (need[s.charAt(r)]-- > 0) missing--;\n            while (missing == 0) {\n                if (r - left + 1 < bestLen) { bestLen = r - left + 1; bestStart = left; }\n                if (++need[s.charAt(left++)] > 0) missing++;\n            }\n        }\n        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);\n    }\n}\n'
  },
  {
    id: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    desc: '<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <b>the median</b> of the two sorted arrays.</p><p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>',
    examples: [
      { in: 'nums1 = [1,3], nums2 = [2]', out: '2.0', note: 'merged = [1,2,3], median = 2' },
      { in: 'nums1 = [1,2], nums2 = [3,4]', out: '2.5', note: 'merged = [1,2,3,4], median = (2 + 3) / 2' }
    ],
    constraints: ['0 <= m, n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    sig: { method: 'findMedianSortedArrays', params: [['int[]', 'nums1'], ['int[]', 'nums2']], ret: 'double' },
    compare: 'approx',
    tests: [
      { a: [[1, 3], [2]], e: 2.0 },
      { a: [[1, 2], [3, 4]], e: 2.5 },
      { a: [[0, 0], [0, 0]], e: 0.0 },
      { a: [[], [1]], e: 1.0, h: true },
      { a: [[2], []], e: 2.0, h: true },
      { a: [[1, 3], [2, 7]], e: 2.5, h: true },
      { a: [[1], [2, 3, 4, 5, 6]], e: 3.5, h: true },
      { a: [[4, 5, 6, 8, 9], []], e: 6.0, h: true },
      { a: [{ java: 'JKRT.range(1,50000)', show: '[1..50000]' }, { java: 'JKRT.range(50001,100000)', show: '[50001..100000]' }], e: 50000.5, h: true, show: 'nums1 = [1..50000], nums2 = [50001..100000]' }
    ],
    solution: 'class Solution {\n    public double findMedianSortedArrays(int[] a, int[] b) {\n        if (a.length > b.length) return findMedianSortedArrays(b, a);\n        int m = a.length, n = b.length, lo = 0, hi = m, half = (m + n + 1) / 2;\n        while (lo <= hi) {\n            int i = (lo + hi) / 2, j = half - i;\n            int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1], aR = i == m ? Integer.MAX_VALUE : a[i];\n            int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1], bR = j == n ? Integer.MAX_VALUE : b[j];\n            if (aL <= bR && bL <= aR) {\n                if ((m + n) % 2 == 1) return Math.max(aL, bL);\n                return (Math.max(aL, bL) + (double) Math.min(aR, bR)) / 2.0;\n            } else if (aL > bR) hi = i - 1; else lo = i + 1;\n        }\n        return 0.0;\n    }\n}\n'
  },
  {
    id: 'merge-k-sorted-lists', title: 'Merge k Sorted Lists', difficulty: 'Hard', tags: ['Linked List', 'Heap', 'Divide and Conquer'],
    desc: '<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p><p><i>Merge all the linked-lists into one sorted linked-list and return it.</i></p>',
    examples: [
      { in: 'lists = [[1,4,5],[1,3,4],[2,6]]', out: '[1,1,2,3,4,4,5,6]' },
      { in: 'lists = []', out: '[]' },
      { in: 'lists = [[]]', out: '[]' }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order.'],
    pre: LIST_PRE,
    sig: { method: 'mergeKLists', params: [['ListNode[]', 'lists']], ret: 'ListNode' },
    tests: [
      { a: [[[1, 4, 5], [1, 3, 4], [2, 6]]], e: [1, 1, 2, 3, 4, 4, 5, 6] },
      { a: [[]], e: [] },
      { a: [[[]]], e: [] },
      { a: [[[1], [0]]], e: [0, 1], h: true },
      { a: [[[], [1]]], e: [1], h: true },
      { a: [[[-2, -1, -1, -1], []]], e: [-2, -1, -1, -1], h: true },
      { a: [[[5], [1, 2, 3], [4]]], e: [1, 2, 3, 4, 5], h: true },
      { a: [{ java: 'JKRT.singles(5000)', show: '5000 lists of one node each' }], e: { java: 'JKRT.list(JKRT.range(1,5000))', show: '[1..5000]' }, h: true, show: 'lists = 5000 lists, one node each (values 5000..1)' }
    ],
    solution: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));\n        for (ListNode l : lists) if (l != null) pq.add(l);\n        ListNode dummy = new ListNode(), tail = dummy;\n        while (!pq.isEmpty()) {\n            ListNode n = pq.poll();\n            tail.next = n;\n            tail = n;\n            if (n.next != null) pq.add(n.next);\n        }\n        return dummy.next;\n    }\n}\n'
  },
  {
    id: 'largest-rectangle-in-histogram', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', tags: ['Array', 'Stack', 'Monotonic Stack'],
    desc: '<p>Given an array of integers <code>heights</code> representing the histogram\'s bar height where the width of each bar is <code>1</code>, return <i>the area of the largest rectangle in the histogram</i>.</p>',
    examples: [
      { in: 'heights = [2,1,5,6,2,3]', out: '10', note: 'The largest rectangle spans the bars of height 5 and 6 (area = 5 x 2).' },
      { in: 'heights = [2,4]', out: '4' }
    ],
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    sig: { method: 'largestRectangleArea', params: [['int[]', 'heights']], ret: 'int' },
    tests: [
      { a: [[2, 1, 5, 6, 2, 3]], e: 10 },
      { a: [[2, 4]], e: 4 },
      { a: [[1]], e: 1 },
      { a: [[2, 1, 2]], e: 3, h: true },
      { a: [[6, 2, 5, 4, 5, 1, 6]], e: 12, h: true },
      { a: [[1, 1, 1, 1]], e: 4, h: true },
      { a: [[0, 9]], e: 9, h: true },
      { a: [[5, 4, 3, 2, 1]], e: 9, h: true },
      { a: [{ java: 'JKRT.fill(100000,2)', show: '[2] x 100000' }], e: 200000, h: true, show: 'heights = [2] x 100000' }
    ],
    solution: 'class Solution {\n    public int largestRectangleArea(int[] heights) {\n        Deque<Integer> st = new ArrayDeque<>();\n        int best = 0, n = heights.length;\n        for (int i = 0; i <= n; i++) {\n            int h = i == n ? 0 : heights[i];\n            while (!st.isEmpty() && heights[st.peek()] >= h) {\n                int height = heights[st.pop()];\n                int left = st.isEmpty() ? -1 : st.peek();\n                best = Math.max(best, height * (i - left - 1));\n            }\n            st.push(i);\n        }\n        return best;\n    }\n}\n'
  }

  ];
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined' && module.exports) module.exports = globalThis.JK_PROBLEMS;
