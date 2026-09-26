/* Problems 2/5: linked lists and LRU cache. */
(function () {
  var P = JK.P, t = JK.t, h = JK.h, R = JK.R, dt = JK.dt, dh = JK.dh;

  P({
    n: 160, title: 'Intersection of Two Linked Lists', diff: 'Easy',
    desc: '<p>Given the heads of two singly linked lists <code>headA</code> and <code>headB</code>, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return <code>null</code>.</p><p>In the tests the lists are described by <code>listA</code>, <code>listB</code> and how many nodes come before the shared part (<code>skipA</code>, <code>skipB</code>). The expected output is the value of the intersecting node, or <code>null</code>. The intersection is by node reference, not by value.</p>',
    ex: [['listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3', '8'], ['listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1', '2'], ['listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2', 'null']],
    sig: 'ListNode getIntersectionNode(ListNode headA, ListNode headB)',
    args: 'int[] listA, int[] listB, int skipA, int skipB', ret: 'Integer',
    body: 'ListNode[] p = JKL.intersect(a0, a1, a2, a3); ListNode r = new Solution().getIntersectionNode(p[0], p[1]); return r == null ? null : Integer.valueOf(r.val);',
    tests: [
      t([[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3], 8), t([[1, 9, 1, 2, 4], [3, 2, 4], 3, 1], 2), t([[2, 6, 4], [1, 5], 3, 2], null),
      h([[1], [1], 0, 0], 1), h([[1, 2, 3], [2, 3], 1, 0], 2), h([[1, 2], [3, 4, 5], 2, 3], null),
      h([R('JKRT.range(1,100000)', '[1..100000]'), R('JKRT.range(1,100000)', '[1..100000]'), 50000, 70000], 50001, 'listA = [1..100000], listB = [1..100000], skipA = 50000, skipB = 70000')
    ]
  });

  P({
    n: 206, title: 'Reverse Linked List', diff: 'Easy',
    desc: '<p>Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.</p><p>Follow-up: can you do it both iteratively and recursively?</p>',
    ex: [['head = [1,2,3,4,5]', '[5,4,3,2,1]'], ['head = [1,2]', '[2,1]'], ['head = []', '[]']],
    sig: 'ListNode reverseList(ListNode head)',
    tests: [
      t([[1, 2, 3, 4, 5]], [5, 4, 3, 2, 1]), t([[1, 2]], [2, 1]), t([[]], []),
      h([[7]], [7]), h([[-1, 0, 1]], [1, 0, -1]),
      h([R('JKL.list(JKRT.range(1,100000))', '[1..100000]')], R('JKL.list(JKRT.rangeDesc(100000,1))', '[100000..1]'), 'head = [1..100000]')
    ]
  });

  P({
    n: 234, title: 'Palindrome Linked List', diff: 'Easy',
    desc: '<p>Given the <code>head</code> of a singly linked list, return <code>true</code> if it is a palindrome or <code>false</code> otherwise.</p><p>Follow-up: could you do it in <code>O(n)</code> time and <code>O(1)</code> space?</p>',
    ex: [['head = [1,2,2,1]', 'true'], ['head = [1,2]', 'false']],
    sig: 'boolean isPalindrome(ListNode head)',
    tests: [
      t([[1, 2, 2, 1]], true), t([[1, 2]], false), t([[1]], true),
      h([[1, 2, 3, 2, 1]], true), h([[1, 0, 0]], false),
      h([R('JKL.list(JKRT.fill(100000,7))', '[7] x 100000')], true, 'head = [7] x 100000'),
      h([R('JKL.list(JKRT.range(1,100000))', '[1..100000]')], false, 'head = [1..100000]')
    ]
  });

  P({
    n: 141, title: 'Linked List Cycle', diff: 'Easy',
    desc: '<p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it. A cycle exists if some node can be reached again by continuously following the <code>next</code> pointer.</p><p>In the tests <code>pos</code> is the index of the node that the tail\'s <code>next</code> pointer connects to (<code>-1</code> means no cycle). Follow-up: can you solve it using <code>O(1)</code> memory?</p>',
    ex: [['head = [3,2,0,-4], pos = 1', 'true'], ['head = [1,2], pos = 0', 'true'], ['head = [1], pos = -1', 'false']],
    sig: 'boolean hasCycle(ListNode head)', args: 'int[] head, int pos', ret: 'boolean',
    body: 'return new Solution().hasCycle(JKL.cycleList(a0, a1));',
    tests: [
      t([[3, 2, 0, -4], 1], true), t([[1, 2], 0], true), t([[1], -1], false),
      h([[1, 2, 3], -1], false), h([[1], 0], true),
      h([R('JKRT.range(1,100000)', '[1..100000]'), -1], false, 'head = [1..100000], pos = -1'),
      h([R('JKRT.range(1,100000)', '[1..100000]'), 99999], true, 'head = [1..100000], pos = 99999')
    ]
  });

  P({
    n: 142, title: 'Linked List Cycle II', diff: 'Medium',
    desc: '<p>Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return <code>null</code>.</p><p>In the tests <code>pos</code> is the index of the node the tail connects to (<code>-1</code> means no cycle) and the expected output is the index of the node your method returns (<code>-1</code> for <code>null</code>). Do not modify the linked list.</p>',
    ex: [['head = [3,2,0,-4], pos = 1', '1'], ['head = [1,2], pos = 0', '0'], ['head = [1], pos = -1', '-1']],
    sig: 'ListNode detectCycle(ListNode head)', args: 'int[] head, int pos', ret: 'int',
    body: 'ListNode hd = JKL.cycleList(a0, a1); return JKL.indexOf(hd, new Solution().detectCycle(hd));',
    tests: [
      t([[3, 2, 0, -4], 1], 1), t([[1, 2], 0], 0), t([[1], -1], -1),
      h([[1, 2, 3, 4, 5], 2], 2), h([[1], 0], 0), h([[1, 2, 3], -1], -1),
      h([R('JKRT.range(1,100000)', '[1..100000]'), 54321], 54321, 'head = [1..100000], pos = 54321')
    ]
  });

  P({
    n: 21, title: 'Merge Two Sorted Lists', diff: 'Easy',
    desc: '<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists into one sorted list by splicing together the nodes of the first two lists, and return the head of the merged list.</p>',
    ex: [['list1 = [1,2,4], list2 = [1,3,4]', '[1,1,2,3,4,4]'], ['list1 = [], list2 = []', '[]'], ['list1 = [], list2 = [0]', '[0]']],
    sig: 'ListNode mergeTwoLists(ListNode list1, ListNode list2)',
    tests: [
      t([[1, 2, 4], [1, 3, 4]], [1, 1, 2, 3, 4, 4]), t([[], []], []), t([[], [0]], [0]),
      h([[5], [1, 2, 4]], [1, 2, 4, 5]), h([[1, 3, 5], [2, 4, 6]], [1, 2, 3, 4, 5, 6]), h([[1, 2], [1, 2, 3]], [1, 1, 2, 2, 3]),
      h([R('JKL.list(JKRT.fill(50000,1))', '[1] x 50000'), R('JKL.list(JKRT.fill(50000,2))', '[2] x 50000')], R('JKL.list(JKRT.concat(JKRT.fill(50000,1), JKRT.fill(50000,2)))', '[1] x 50000 then [2] x 50000'), 'list1 = [1] x 50000, list2 = [2] x 50000')
    ]
  });

  P({
    n: 2, title: 'Add Two Numbers', diff: 'Medium',
    desc: '<p>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p><p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>',
    ex: [['l1 = [2,4,3], l2 = [5,6,4]', '[7,0,8]', '342 + 465 = 807.'], ['l1 = [0], l2 = [0]', '[0]'], ['l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', '[8,9,9,9,0,0,0,1]']],
    sig: 'ListNode addTwoNumbers(ListNode l1, ListNode l2)',
    tests: [
      t([[2, 4, 3], [5, 6, 4]], [7, 0, 8]), t([[0], [0]], [0]), t([[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], [8, 9, 9, 9, 0, 0, 0, 1]),
      h([[5], [5]], [0, 1]), h([[1], [9, 9]], [0, 0, 1]), h([[2, 4, 9], [5, 6, 4, 9]], [7, 0, 4, 0, 1])
    ]
  });

  P({
    n: 19, title: 'Remove Nth Node From End of List', diff: 'Medium',
    desc: '<p>Given the <code>head</code> of a linked list, remove the <code>n</code>th node from the end of the list and return its head.</p><p>Follow-up: could you do this in one pass?</p>',
    ex: [['head = [1,2,3,4,5], n = 2', '[1,2,3,5]'], ['head = [1], n = 1', '[]'], ['head = [1,2], n = 1', '[1]']],
    sig: 'ListNode removeNthFromEnd(ListNode head, int n)',
    tests: [
      t([[1, 2, 3, 4, 5], 2], [1, 2, 3, 5]), t([[1], 1], []), t([[1, 2], 1], [1]),
      h([[1, 2], 2], [2]), h([[1, 2, 3], 3], [2, 3]), h([[1, 2, 3, 4], 1], [1, 2, 3])
    ]
  });

  P({
    n: 24, title: 'Swap Nodes in Pairs', diff: 'Medium',
    desc: '<p>Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list\'s nodes (i.e., only nodes themselves may be changed).</p>',
    ex: [['head = [1,2,3,4]', '[2,1,4,3]'], ['head = []', '[]'], ['head = [1]', '[1]']],
    sig: 'ListNode swapPairs(ListNode head)',
    tests: [
      t([[1, 2, 3, 4]], [2, 1, 4, 3]), t([[]], []), t([[1]], [1]),
      h([[1, 2, 3]], [2, 1, 3]), h([[1, 2, 3, 4, 5]], [2, 1, 4, 3, 5]), h([[1, 2]], [2, 1])
    ]
  });

  P({
    n: 25, title: 'Reverse Nodes in k-Group', diff: 'Hard',
    desc: '<p>Given the head of a linked list, reverse the nodes of the list <code>k</code> at a time, and return the modified list.</p><p><code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then the left-out nodes at the end should remain as they are. You may not alter the values in the list\'s nodes, only nodes themselves may be changed.</p>',
    ex: [['head = [1,2,3,4,5], k = 2', '[2,1,4,3,5]'], ['head = [1,2,3,4,5], k = 3', '[3,2,1,4,5]']],
    sig: 'ListNode reverseKGroup(ListNode head, int k)',
    tests: [
      t([[1, 2, 3, 4, 5], 2], [2, 1, 4, 3, 5]), t([[1, 2, 3, 4, 5], 3], [3, 2, 1, 4, 5]), t([[1], 1], [1]),
      h([[1, 2], 2], [2, 1]), h([[1, 2, 3, 4, 5, 6], 3], [3, 2, 1, 6, 5, 4]), h([[1, 2, 3], 1], [1, 2, 3]), h([[1, 2, 3, 4, 5], 5], [5, 4, 3, 2, 1])
    ]
  });

  P({
    n: 138, title: 'Copy List with Random Pointer', diff: 'Medium',
    desc: '<p>A linked list of length <code>n</code> is given such that each node contains an additional random pointer, which could point to any node in the list, or <code>null</code>. Construct a deep copy of the list. The deep copy must consist of exactly <code>n</code> brand new nodes; none of the pointers in the new list may point to nodes in the original list.</p><p>Lists are shown as <code>[[val, randomIndex], ...]</code> where <code>randomIndex</code> is the index of the node the random pointer points to (or <code>null</code>).</p>',
    ex: [['head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', '[[7,null],[13,0],[11,4],[10,2],[1,0]]'], ['head = [[1,1],[2,1]]', '[[1,1],[2,1]]'], ['head = [[3,null],[3,0],[3,null]]', '[[3,null],[3,0],[3,null]]']],
    sig: 'Node copyRandomList(Node head)', args: 'Node head', ret: 'Node',
    body: 'Node c = new Solution().copyRandomList(a0); return JKN.shares(a0, c) ? (Object) "your copy reuses nodes of the original list" : (Object) c;',
    tests: [
      t([[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]], [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]),
      t([[[1, 1], [2, 1]]], [[1, 1], [2, 1]]),
      t([[[3, null], [3, 0], [3, null]]], [[3, null], [3, 0], [3, null]]),
      h([[]], []), h([[[1, null]]], [[1, null]]), h([[[5, 0]]], [[5, 0]]), h([[[1, 1], [2, 0], [3, 2]]], [[1, 1], [2, 0], [3, 2]])
    ]
  });

  P({
    n: 148, title: 'Sort List', diff: 'Medium',
    desc: '<p>Given the <code>head</code> of a linked list, return the list after sorting it in ascending order.</p><p>Follow-up: can you sort the linked list in <code>O(n log n)</code> time?</p>',
    ex: [['head = [4,2,1,3]', '[1,2,3,4]'], ['head = [-1,5,3,4,0]', '[-1,0,3,4,5]'], ['head = []', '[]']],
    sig: 'ListNode sortList(ListNode head)',
    tests: [
      t([[4, 2, 1, 3]], [1, 2, 3, 4]), t([[-1, 5, 3, 4, 0]], [-1, 0, 3, 4, 5]), t([[]], []),
      h([[1]], [1]), h([[2, 1]], [1, 2]), h([[3, 3, 1, 1]], [1, 1, 3, 3]),
      h([R('JKL.list(JKRT.rangeDesc(100000,1))', '[100000..1]')], R('JKL.list(JKRT.range(1,100000))', '[1..100000]'), 'head = [100000..1]')
    ]
  });

  P({
    n: 23, title: 'Merge k Sorted Lists', diff: 'Hard',
    desc: '<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p><p>Merge all the linked-lists into one sorted linked-list and return it.</p>',
    ex: [['lists = [[1,4,5],[1,3,4],[2,6]]', '[1,1,2,3,4,4,5,6]'], ['lists = []', '[]'], ['lists = [[]]', '[]']],
    sig: 'ListNode mergeKLists(ListNode[] lists)',
    tests: [
      t([[[1, 4, 5], [1, 3, 4], [2, 6]]], [1, 1, 2, 3, 4, 4, 5, 6]), t([[]], []), t([[[]]], []),
      h([[[1], [0]]], [0, 1]), h([[[], [1]]], [1]), h([[[-2, -1, -1, -1], []]], [-2, -1, -1, -1]), h([[[5], [1, 2, 3], [4]]], [1, 2, 3, 4, 5]),
      h([R('JKL.singles(5000)', '5000 lists of one node each')], R('JKL.list(JKRT.range(1,5000))', '[1..5000]'), 'lists = 5000 lists of one node each (values 5000..1)')
    ]
  });

  P({
    n: 146, title: 'LRU Cache', diff: 'Medium',
    desc: '<p>Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.</p><p>Implement <code>LRUCache(int capacity)</code>; <code>int get(int key)</code> returns the value of the key if it exists, otherwise <code>-1</code>; <code>void put(int key, int value)</code> updates the value if the key exists, otherwise adds the pair, and when the number of keys exceeds the capacity evicts the least recently used key. Both operations must run in <code>O(1)</code> average time.</p>',
    ex: [['["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', '[null,null,null,1,null,-1,null,-1,3,4]']],
    design: { ctor: 'LRUCache(int capacity)', methods: ['int get(int key)', 'void put(int key, int value)'] },
    tests: [
      dt(['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]], [null, null, null, 1, null, -1, null, -1, 3, 4]),
      dt(['LRUCache', 'put', 'get', 'put', 'get', 'get'], [[1], [2, 1], [2], [3, 2], [2], [3]], [null, null, 1, null, -1, 2]),
      dh(['LRUCache', 'get', 'put', 'get', 'put', 'put', 'get', 'get'], [[2], [2], [2, 6], [1], [1, 5], [1, 2], [1], [2]], [null, -1, null, -1, null, null, 2, 6]),
      dh(['LRUCache', 'put', 'put', 'get', 'put', 'put', 'get'], [[2], [2, 1], [2, 2], [2], [1, 1], [4, 1], [2]], [null, null, null, 2, null, null, -1])
    ]
  });
})();
