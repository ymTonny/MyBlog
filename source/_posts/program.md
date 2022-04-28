---
title: js编程题
date: 2022-04-08
categories:
 - 算法
tags:
 - js
---
日常js编程开发, 不定期编写
<!--more-->
## 链表相加
```
class ListNode {
  constructor(val, next) {
    this.val = val ?? "";
    this.next = next ?? "";
  }
}

function generatorListNode(arr) {
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1, len = arr.length; i < len; i++) {
    cur.next = new ListNode(arr[i]);
    cur = cur.next;
  }
  return head;
}
const s1 = generatorListNode([1, 15, 3]),
  s2 = generatorListNode([2, 15, 4]);
function sum(s1, s2) {
  // head固定指针，tail移动指针
  let head = null,
    tail = null;
  // 进位值
  let county = 0;
  while (s1 || s2) {
    const n1 = s1 ? s1.val : null;
    const n2 = s2 ? s2.val : null;
    const sum = n1 + n2 + county;
    if (!head) {
      head = tail = new ListNode(sum % 10);
    } else {
      tail.next = new ListNode(sum % 10);
      tail = tail.next;
    }
    county = Math.floor(sum / 10);
    if (s1) s1 = s1.next;
    if (s2) s2 = s2.next;
  }
  if (county > 0) {
    tail.next = new ListNode(county);
  }
  return head;
}
console.log(sum(s1, s2));
```
## 无重复字串最大长度
```
function noRepeatLen(str) {
  const list = new Set();
  let left = -1,
    ans = 0;
  for (let i = 0; i < str.length; i++) {
    if (i != 0) {
      list.delete(str.charAt(i - 1));
    }
    while (!list.has(str.charAt(left + 1)) && left + 1 < str.length) {
      list.add(str.charAt(left + 1));
      left++;
    }
    ans = Math.max(ans, left - i + 1);
  }
  return ans;
}
console.log(noRepeatLen("abcabcbb"));
```
## 获取数组中任意两个元素相加等于提供的数的下标
```
const arr = [1, 2, 3, 4,6],
  sum = 9;
const list = new Map();
for (let i = 0; i < arr.length; i++) {
  const target = sum - arr[i];
  if (!list.has(target)) {
    list.set(arr[i], i);
  } else {
    console.log([i, list.get(target)])
  }
}
```
## 最长回文子串
```
const str = "sabcbas";
function getResult(s) {
  if (!s || s.length === 1) return s;
  const len = s.length;
  let res = s[0];
  for (let i = 0; i < len; i++) {
    let j = 1;
    let tempStr1 = "",
      tempStr2 = "";
    if (s[i] === s[i + 1] && s[i + 1]) {
      const doubleStr = `${s[i]}${s[i + 1]}`;
      res = res.length > doubleStr.length ? res : doubleStr;
    }
    tempStr1 = s[i];
    while (s[i + j] === s[i - j] && s[i + j] && s[i - j]) {
      tempStr1 = s[i - j] + tempStr1 + s[i + j];
      j++;
    }
    j = 1;
    while (s[i - j] === s[i + j + 1] && s[i - j] && s[i + j - 1]) {
      tempStr2 = s[i - j] + tempStr2 + s[i + j - 1];
      j++;
    }
    const temp = tempStr1.length > tempStr2.length ? tempStr1 : tempStr2;
    res = temp.length > res.length ? temp : res;
  }
  return res;
}
console.log(getResult(str))
```
## 广度优先tree展平
```
const tree = [{"id":1,"pid":"-1","children":[{"id":2,"pid":"1","children":[]},{"id":3,"pid":"1","children":[]}]}];
function treeToList(tree) {
  let queen = [];
  let result = [];
  queen = queen.concat(tree);
  while(queen.length) {
    let first = queen.shift();
    if (first.children) {
      queen = queen.concat(first.children);  //深度优先使用unshift
      delete first['children'];
    }
    result.push(first);
  }
  return result;
}
console.log(treeToList(tree))
```
## 树节点路径查找
```
const tree = [
  {
    id: 1,
    pid: "-1",
    name: "1",
    children: [
      {
        id: "101",
        pid: "1",
        name: "1-1",
        children: [{ id: "1001", pid: "1", name: "1-1-1" }],
      },
      {
        id: "102",
        pid: "1",
        name: "1-2",
        children: [{ id: "1002", pid: "2", name: "1-2-2" }],
      },
    ],
  },
  {
    id: 2,
    pid: "-1",
    name: "2",
    children: [
      {
        id: "201",
        pid: "1",
        name: "2-1",
        children: [{ id: "2001", pid: "1", name: "2-1-1" }],
      },
      {
        id: "202",
        pid: "1",
        name: "2-2",
        children: [{ id: "2002", pid: "2", name: "2-2-2" }],
      },
    ],
  },
];
function findTreePath(tree, func, path = []) {
  if(!tree.length) return [];
  for (const data of tree) {
    path.push(data.id);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = findTreePath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  retur [];
}
findTreePath(tree, node=>node.id==='');
//========多路径查找
function findTreePath(tree, func, path = [], result = []) {
  if(!tree.path) return [];
  for(const data of tree) {
    path.push(data.id);
    if(func(data)) result.push([...path]);
    if (data.children) findTreePath(data.children, func, path, result);
    path.pop();
  }
  return result;
}
findTreePath(tree, node=>node.id==='' || node.name==='test')
```
## 列表转树
```
function listTotree(tree) {
  const mapArr = tree.reduce((map, node) => (map[node.id] = node, node.children = [], map), {});
  const result = tree.filter(item=>{
    if(item.pid) mapArr[item.pid].children.push(item);
    return !item.pid
  })
}
// 一次循环
function listTotree(tree) {
  const map = {};
  const result = [];
  for(const data of tree) {
    map[data.id] = data;
    map[data.id].children = [];
    const parentRoot = map[data.pid];
    if (!parentRoot) {
      result.push(data)
    } else {
      !parentRoot.children && (parentRoot.children = []);
      parentRoot.children.push(data)
    }
  }
  return result;
}
```
## 洗牌算法
```
function fisheYete(arr) {
  const list = arr.slice(0);
  for(let i=list.length - 1;i>0;i--) {
    const randIdx = Math.floor(Math.random()*(i+1));
    [list[i], list[randIdx]] = [list[randIdx], list[i]]
  }
  return list;
}
```