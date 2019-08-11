---
title: js数组去重多一种选择
date: 2019-08-11
categories:
 - 面试
tags:
 - js
---
数组去重，一般在面试的时候都会被问到，要求现场写去重代码，那么你知道有多少去重的方法呢？如果你能答出多种的话，面试官一定会对你刮目相看的。

数组去重的方法：
## 一、利用ES6 Set去重
``` breach
function uniq(arr){
  return Array.from(new Set(arr))
}
let arr = [1,1,2,2,3,3];
console.log(uniq(arr));
```
<!--more-->
如果不考虑兼容性的话，此方法代码最少。

## 二、利用splice去重。
``` breach
 function uniq(arr){
   if(!Array.isArray(arr)){
      console.log("no array");
      return
   }
   for(let i=0;i<arr.length;i++){
     for(let j=i+1;j<arr.length;j++){
        if(arr[i]==arr[j]){
          arr.splice(j,1);
        }
     }
   }
   return arr;
 }
 let arr=[1,1,2,2,3,3];
 console.log(uniq(arr));
```
双重for循环，外层循环元素，内层判断值，值相等就通过`splice`删除。
## 三、利用indexOf去重
```breach
function uniq(arr){
  if(!Array.isArray(arr)){
     console.log("no array");
     return
  }
  let array=[];
  for(let i=0;i<arr.length;i++){
     if(array.indexOf(arr[i])==-1){
       array.push(arr[i]);
     }
  }
  return array;
}
let arr=[1,1,2,2,3,3];
console.log(uniq(arr))
```
通过新建一个空数组，for循环判断空数组中是否存在当前元素，如果不存在就`push`进去，如果存在就跳过。
## 四、利用sort()
``` breach
function uniq(arr){
 if(!Array.isArray(arr)){
   console.log("no array");
   return
 }
 arr = arr.sort();
 let array = [];
 for(let i=0;i<arr.length;i++){
   if(arr[i]!=arr[i+1]){
     array.push(arr[i]);
   }
 }
 return array;
}
let arr = [1,2,3,6,4,2,1];
console.log(uniq(arr))
```
通过`sort()`排序过后，再用for循环遍历比较相邻元素。
## 五、利用对象的属性不能相同去重
``` breach
function uniq(arr){
  if(!Array.isArray(arr)){
    console.log("no array");
    return
  }
  let array=[],obj={};
  for(let i=0;i<arr.length;i++){
    if(!obj[arr[i]]){
      array.push(arr[i]);
      obj[arr[i]]=1;
    }else{
      obj[arr[i]]++;
    }
  }
  return array;
}
let arr = [1,2,3,4,2,3,1];
console.log(uniq(arr))
```
## 六、利用includes
``` breach
function uniq(arr){
 if(!Array.isArray(arr)){
   console.log("no array");
   return;
 }
 let array = [];
 for(let i=0;i<arr.length;i++){
   if(!array.includes(arr[i])){ //array中是否存在arr[i]元素
     array.push(arr[i]);
   }
 }
 return array;
}
let arr = [1,2,3,5,2,1];
console.log(uniq(arr));
```
## 七、利用hasOwnProperty
``` breach
function uniq(arr){
 let obj = {};
 return arr.filter((item,index,arr)=>{
   return obj.hasOwnProperty(typeof item+item) ? false:(obj[typeof item+item]=true)
 })
}
let arr = [1,2,3,5,2,1];
console.log(uniq(arr));
```
## 八、利用filter
``` breach
function uniq(arr){
 return arr.filter((item,index,arr)=>{
   //当前元素，在原数组中的第一个索引 === 当前索引值,否则返回当前元素
   return arr.indexOf(item,0) === index;
 })
}
let arr = [1,2,3,5,2,1];
console.log(uniq(arr));
```
