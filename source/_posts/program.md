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