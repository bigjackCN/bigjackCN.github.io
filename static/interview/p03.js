/* Problems 3/5: binary trees, graphs, trie. Trees are given in level-order with null for missing children. */
(function () {
  var P = JK.P, t = JK.t, h = JK.h, R = JK.R, dt = JK.dt, dh = JK.dh;
  var TREE = 'The tree is given in level-order with <code>null</code> for missing children.';

  P({
    n: 94, title: 'Binary Tree Inorder Traversal', diff: 'Easy',
    desc: '<p>Given the <code>root</code> of a binary tree, return the inorder traversal of its nodes\' values.</p><p>' + TREE + '</p>',
    ex: [['root = [1,null,2,3]', '[1,3,2]'], ['root = []', '[]'], ['root = [1]', '[1]']],
    sig: 'List<Integer> inorderTraversal(TreeNode root)',
    tests: [
      t([[1, null, 2, 3]], [1, 3, 2]), t([[]], []), t([[1]], [1]),
      h([[1, 2]], [2, 1]), h([[1, null, 2]], [1, 2]), h([[3, 1, 2]], [1, 3, 2]),
      h([R('JKT.rightChain(5000)', 'right-skewed tree with 5000 nodes')], R('JKRT.filledList(5000,1)', '[1] x 5000'), 'root = right-skewed tree with 5000 nodes')
    ]
  });

  P({
    n: 104, title: 'Maximum Depth of Binary Tree', diff: 'Easy',
    desc: '<p>Given the <code>root</code> of a binary tree, return its maximum depth: the number of nodes along the longest path from the root node down to the farthest leaf node.</p><p>' + TREE + '</p>',
    ex: [['root = [3,9,20,null,null,15,7]', '3'], ['root = [1,null,2]', '2']],
    sig: 'int maxDepth(TreeNode root)',
    tests: [
      t([[3, 9, 20, null, null, 15, 7]], 3), t([[1, null, 2]], 2), t([[]], 0),
      h([[1]], 1), h([[1, 2, 3, 4, null, null, 5]], 3),
      h([R('JKT.rightChain(5000)', 'right-skewed tree with 5000 nodes')], 5000, 'root = right-skewed tree with 5000 nodes')
    ]
  });

  P({
    n: 226, title: 'Invert Binary Tree', diff: 'Easy',
    desc: '<p>Given the <code>root</code> of a binary tree, invert the tree, and return its root.</p><p>' + TREE + '</p>',
    ex: [['root = [4,2,7,1,3,6,9]', '[4,7,2,9,6,3,1]'], ['root = [2,1,3]', '[2,3,1]'], ['root = []', '[]']],
    sig: 'TreeNode invertTree(TreeNode root)',
    tests: [
      t([[4, 2, 7, 1, 3, 6, 9]], [4, 7, 2, 9, 6, 3, 1]), t([[2, 1, 3]], [2, 3, 1]), t([[]], []),
      h([[1]], [1]), h([[1, 2]], [1, null, 2]), h([[1, null, 2]], [1, 2]), h([[1, 2, 3, 4, 5]], [1, 3, 2, null, null, 5, 4])
    ]
  });

  P({
    n: 101, title: 'Symmetric Tree', diff: 'Easy',
    desc: '<p>Given the <code>root</code> of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).</p><p>' + TREE + '</p>',
    ex: [['root = [1,2,2,3,4,4,3]', 'true'], ['root = [1,2,2,null,3,null,3]', 'false']],
    sig: 'boolean isSymmetric(TreeNode root)',
    tests: [
      t([[1, 2, 2, 3, 4, 4, 3]], true), t([[1, 2, 2, null, 3, null, 3]], false), t([[1]], true),
      h([[1, 2, 3]], false), h([[1, 2, 2, null, 3, 3]], true), h([[1, 2, 2, 2, null, 2]], false)
    ]
  });

  P({
    n: 543, title: 'Diameter of Binary Tree', diff: 'Easy',
    desc: '<p>Given the <code>root</code> of a binary tree, return the length of the diameter of the tree.</p><p>The diameter is the length of the longest path between any two nodes in a tree (measured in number of edges). This path may or may not pass through the root.</p><p>' + TREE + '</p>',
    ex: [['root = [1,2,3,4,5]', '3', 'The path [4,2,1,3] or [5,2,1,3].'], ['root = [1,2]', '1']],
    sig: 'int diameterOfBinaryTree(TreeNode root)',
    tests: [
      t([[1, 2, 3, 4, 5]], 3), t([[1, 2]], 1), t([[1]], 0),
      h([[1, null, 2, null, 3]], 2), h([[1, 2, 3, 4, 5, null, null, 6, null, null, 7]], 4),
      h([R('JKT.rightChain(5000)', 'right-skewed tree with 5000 nodes')], 4999, 'root = right-skewed tree with 5000 nodes')
    ]
  });

  P({
    n: 102, title: 'Binary Tree Level Order Traversal', diff: 'Medium',
    desc: '<p>Given the <code>root</code> of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).</p><p>' + TREE + '</p>',
    ex: [['root = [3,9,20,null,null,15,7]', '[[3],[9,20],[15,7]]'], ['root = [1]', '[[1]]'], ['root = []', '[]']],
    sig: 'List<List<Integer>> levelOrder(TreeNode root)',
    tests: [
      t([[3, 9, 20, null, null, 15, 7]], [[3], [9, 20], [15, 7]]), t([[1]], [[1]]), t([[]], []),
      h([[1, 2, 3, 4, 5]], [[1], [2, 3], [4, 5]]), h([[1, null, 2]], [[1], [2]]), h([[1, 2, null, 3]], [[1], [2], [3]])
    ]
  });

  P({
    n: 108, title: 'Convert Sorted Array to Binary Search Tree', diff: 'Easy',
    desc: '<p>Given an integer array <code>nums</code> where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.</p><p>Any valid height-balanced BST is accepted: the tests check that the in-order traversal of your tree equals <code>nums</code> and that the depths of the two subtrees of every node never differ by more than one.</p>',
    ex: [['nums = [-10,-3,0,5,9]', 'true', 'e.g. [0,-3,9,-10,null,5] is one valid answer.'], ['nums = [1,3]', 'true']],
    sig: 'TreeNode sortedArrayToBST(int[] nums)', args: 'int[] nums', ret: 'boolean',
    body: 'return JKT.balancedBstOf((TreeNode) JKRT.call(a0), a0);',
    tests: [
      t([[-10, -3, 0, 5, 9]], true), t([[1, 3]], true), t([[1]], true),
      h([[1, 2, 3, 4, 5, 6, 7]], true), h([[-1, 0, 1, 2]], true),
      h([R('JKRT.range(1,100000)', '[1..100000]')], true, 'nums = [1..100000]')
    ]
  });

  P({
    n: 98, title: 'Validate Binary Search Tree', diff: 'Medium',
    desc: '<p>Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST): the left subtree of a node contains only nodes with keys strictly less than the node\'s key, the right subtree only keys strictly greater, and both subtrees must also be BSTs.</p><p>' + TREE + '</p>',
    ex: [['root = [2,1,3]', 'true'], ['root = [5,1,4,null,null,3,6]', 'false', 'The root\'s right child is 4 but its left child is 3, which is less than 5.']],
    sig: 'boolean isValidBST(TreeNode root)',
    tests: [
      t([[2, 1, 3]], true), t([[5, 1, 4, null, null, 3, 6]], false), t([[1]], true),
      h([[2, 2, 2]], false), h([[5, 4, 6, null, null, 3, 7]], false), h([[2147483647]], true),
      h([[-2147483648, null, 2147483647]], true), h([[0, -1]], true)
    ]
  });

  P({
    n: 230, title: 'Kth Smallest Element in a BST', diff: 'Medium',
    desc: '<p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return the <code>k</code>th smallest value (1-indexed) of all the values of the nodes in the tree.</p><p>' + TREE + '</p>',
    ex: [['root = [3,1,4,null,2], k = 1', '1'], ['root = [5,3,6,2,4,null,null,1], k = 3', '3']],
    sig: 'int kthSmallest(TreeNode root, int k)',
    tests: [
      t([[3, 1, 4, null, 2], 1], 1), t([[5, 3, 6, 2, 4, null, null, 1], 3], 3), t([[1], 1], 1),
      h([[2, 1, 3], 2], 2), h([[5, 3, 6, 2, 4, null, null, 1], 6], 6), h([[5, 3, 6, 2, 4, null, null, 1], 1], 1)
    ]
  });

  P({
    n: 199, title: 'Binary Tree Right Side View', diff: 'Medium',
    desc: '<p>Given the <code>root</code> of a binary tree, imagine yourself standing on the right side of it, and return the values of the nodes you can see ordered from top to bottom.</p><p>' + TREE + '</p>',
    ex: [['root = [1,2,3,null,5,null,4]', '[1,3,4]'], ['root = [1,null,3]', '[1,3]'], ['root = []', '[]']],
    sig: 'List<Integer> rightSideView(TreeNode root)',
    tests: [
      t([[1, 2, 3, null, 5, null, 4]], [1, 3, 4]), t([[1, null, 3]], [1, 3]), t([[]], []),
      h([[1, 2, 3, 4, null, null, null, 5]], [1, 3, 4, 5]), h([[1, 2]], [1, 2]), h([[1]], [1])
    ]
  });

  P({
    n: 114, title: 'Flatten Binary Tree to Linked List', diff: 'Medium',
    desc: '<p>Given the <code>root</code> of a binary tree, flatten the tree into a "linked list" in-place: the "linked list" uses the same <code>TreeNode</code> class where the <code>right</code> child pointer points to the next node and the <code>left</code> child pointer is always <code>null</code>. The list must be in the same order as a pre-order traversal.</p><p>' + TREE + '</p>',
    ex: [['root = [1,2,5,3,4,null,6]', '[1,null,2,null,3,null,4,null,5,null,6]'], ['root = []', '[]'], ['root = [0]', '[0]']],
    sig: 'void flatten(TreeNode root)', inPlace: 0, ret: 'TreeNode',
    tests: [
      t([[1, 2, 5, 3, 4, null, 6]], [1, null, 2, null, 3, null, 4, null, 5, null, 6]), t([[]], []), t([[0]], [0]),
      h([[1, 2]], [1, null, 2]), h([[1, null, 2]], [1, null, 2]), h([[1, 2, 3]], [1, null, 2, null, 3])
    ]
  });

  P({
    n: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', diff: 'Medium',
    desc: '<p>Given two integer arrays <code>preorder</code> and <code>inorder</code> where <code>preorder</code> is the preorder traversal of a binary tree and <code>inorder</code> is the inorder traversal of the same tree, construct and return the binary tree. All values are unique.</p>',
    ex: [['preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', '[3,9,20,null,null,15,7]'], ['preorder = [-1], inorder = [-1]', '[-1]']],
    sig: 'TreeNode buildTree(int[] preorder, int[] inorder)',
    tests: [
      t([[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], [3, 9, 20, null, null, 15, 7]), t([[-1], [-1]], [-1]), t([[1, 2], [2, 1]], [1, 2]),
      h([[1, 2], [1, 2]], [1, null, 2]), h([[1, 2, 3], [2, 1, 3]], [1, 2, 3]),
      h([R('JKRT.range(1,5000)', '[1..5000]'), R('JKRT.range(1,5000)', '[1..5000]')], R('JKT.rightChainVals(5000)', 'right-skewed tree 1..5000'), 'preorder = [1..5000], inorder = [1..5000]')
    ]
  });

  P({
    n: 437, title: 'Path Sum III', diff: 'Medium',
    desc: '<p>Given the <code>root</code> of a binary tree and an integer <code>targetSum</code>, return the number of paths where the sum of the values along the path equals <code>targetSum</code>.</p><p>The path does not need to start or end at the root or a leaf, but it must go downwards (i.e., traveling only from parent nodes to child nodes).</p><p>' + TREE + '</p>',
    ex: [['root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8', '3'], ['root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22', '3']],
    sig: 'int pathSum(TreeNode root, int targetSum)',
    tests: [
      t([[10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], 8], 3), t([[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22], 3), t([[1], 1], 1),
      h([[1, 2], 3], 1), h([[0, 1, 1], 1], 4), h([[], 0], 0),
      h([R('JKT.rightChain(5000)', 'right-skewed tree of 1s, 5000 nodes'), 1], 5000, 'root = right-skewed tree of 1s, 5000 nodes, targetSum = 1')
    ]
  });

  P({
    n: 236, title: 'Lowest Common Ancestor of a Binary Tree', diff: 'Medium',
    desc: '<p>Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.</p><p>The LCA of two nodes <code>p</code> and <code>q</code> is the lowest node that has both <code>p</code> and <code>q</code> as descendants (a node can be a descendant of itself). All values are unique and both nodes exist in the tree. In the tests <code>p</code> and <code>q</code> are given as values, and the expected output is the value of the LCA node.</p><p>' + TREE + '</p>',
    ex: [['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', '3'], ['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', '5'], ['root = [1,2], p = 1, q = 2', '1']],
    sig: 'TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q)', args: 'TreeNode root, int p, int q', ret: 'Integer',
    body: 'TreeNode r = (TreeNode) JKRT.call(a0, JKT.find(a0, a1), JKT.find(a0, a2)); return r == null ? null : Integer.valueOf(r.val);',
    tests: [
      t([[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], 3), t([[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], 5), t([[1, 2], 1, 2], 1),
      h([[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4], 5), h([[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 7, 8], 3), h([[2, 1], 2, 1], 2),
      h([R('JKT.rightChainVals(5000)', 'right-skewed tree 1..5000'), 4999, 5000], 4999, 'root = right-skewed tree 1..5000, p = 4999, q = 5000')
    ]
  });

  P({
    n: 124, title: 'Binary Tree Maximum Path Sum', diff: 'Hard',
    desc: '<p>A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once, and the path does not need to pass through the root.</p><p>The path sum of a path is the sum of the node\'s values in the path. Given the <code>root</code> of a binary tree, return the maximum path sum of any non-empty path.</p><p>' + TREE + '</p>',
    ex: [['root = [1,2,3]', '6'], ['root = [-10,9,20,null,null,15,7]', '42', 'The path 15 -> 20 -> 7 has sum 42.']],
    sig: 'int maxPathSum(TreeNode root)',
    tests: [
      t([[1, 2, 3]], 6), t([[-10, 9, 20, null, null, 15, 7]], 42), t([[-3]], -3),
      h([[2, -1]], 2), h([[1, -2, 3]], 4), h([[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], 48),
      h([R('JKT.rightChain(5000)', 'right-skewed tree of 1s, 5000 nodes')], 5000, 'root = right-skewed tree of 1s, 5000 nodes')
    ]
  });

  P({
    n: 200, title: 'Number of Islands', diff: 'Medium',
    desc: '<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>\'1\'</code>s (land) and <code>\'0\'</code>s (water), return the number of islands.</p><p>An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water. The grid is shown as an array of row strings.</p>',
    ex: [['grid = ["11110","11010","11000","00000"]', '1'], ['grid = ["11000","11000","00100","00011"]', '3']],
    sig: 'int numIslands(char[][] grid)',
    tests: [
      t([['11110', '11010', '11000', '00000']], 1), t([['11000', '11000', '00100', '00011']], 3),
      h([['1']], 1), h([['0']], 0), h([['101', '010', '101']], 5), h([['111', '010', '111']], 1),
      h([R("JKRT.grid(200,200,'1')", '200 x 200 grid of "1"')], 1, 'grid = 200 x 200 grid of "1"')
    ]
  });

  P({
    n: 994, title: 'Rotting Oranges', diff: 'Medium',
    desc: '<p>You are given an <code>m x n</code> grid where each cell can have one of three values: <code>0</code> (empty), <code>1</code> (a fresh orange) or <code>2</code> (a rotten orange).</p><p>Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return <code>-1</code>.</p>',
    ex: [['grid = [[2,1,1],[1,1,0],[0,1,1]]', '4'], ['grid = [[2,1,1],[0,1,1],[1,0,1]]', '-1'], ['grid = [[0,2]]', '0']],
    sig: 'int orangesRotting(int[][] grid)',
    tests: [
      t([[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], 4), t([[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], -1), t([[[0, 2]]], 0),
      h([[[0]]], 0), h([[[1]]], -1), h([[[2, 2], [1, 1], [0, 0], [2, 0]]], 1), h([[[1, 2]]], 1)
    ]
  });

  P({
    n: 207, title: 'Course Schedule', diff: 'Medium',
    desc: '<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [a, b]</code> indicates that you must take course <code>b</code> first if you want to take course <code>a</code>.</p><p>Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>.</p>',
    ex: [['numCourses = 2, prerequisites = [[1,0]]', 'true'], ['numCourses = 2, prerequisites = [[1,0],[0,1]]', 'false']],
    sig: 'boolean canFinish(int numCourses, int[][] prerequisites)',
    tests: [
      t([2, [[1, 0]]], true), t([2, [[1, 0], [0, 1]]], false), t([1, []], true),
      h([3, [[1, 0], [2, 1]]], true), h([3, [[0, 1], [1, 2], [2, 0]]], false), h([4, [[1, 0], [2, 0], [3, 1], [3, 2]]], true), h([2, []], true)
    ]
  });

  P({
    n: 208, title: 'Implement Trie (Prefix Tree)', diff: 'Medium',
    desc: '<p>A trie (pronounced "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.</p><p>Implement the <code>Trie</code> class: <code>Trie()</code> initializes the trie object; <code>void insert(String word)</code> inserts the string <code>word</code> into the trie; <code>boolean search(String word)</code> returns <code>true</code> if <code>word</code> is in the trie; <code>boolean startsWith(String prefix)</code> returns <code>true</code> if a previously inserted word has the prefix <code>prefix</code>.</p>',
    ex: [['["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', '[null,null,true,false,true,null,true]']],
    design: { ctor: 'Trie()', methods: ['void insert(String word)', 'boolean search(String word)', 'boolean startsWith(String prefix)'] },
    tests: [
      dt(['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'], [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']], [null, null, true, false, true, null, true]),
      dt(['Trie', 'search', 'startsWith', 'insert', 'startsWith', 'search'], [[], ['a'], ['a'], ['ab'], ['a'], ['a']], [null, false, false, null, true, false]),
      dh(['Trie', 'insert', 'insert', 'search', 'search', 'startsWith', 'startsWith'], [[], ['hello'], ['help'], ['hel'], ['help'], ['hel'], ['hex']], [null, null, null, false, true, true, false]),
      dh(['Trie', 'insert', 'search', 'search', 'startsWith'], [[], ['a'], ['a'], ['aa'], ['aa']], [null, null, true, false, false])
    ]
  });
})();
