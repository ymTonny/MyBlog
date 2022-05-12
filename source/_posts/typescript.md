---
title: typescript分享
date: 2022-05-11
categories:
  - 技术
tags:
  - js
---
## 前言
`typescript`是`javascript`的超集, 具有可选的类型，并且可以编译为纯`javascript`运行。可以看作`typescript`是`javascript`的`Lint`，能为`javascript`增加规范。
<!--more-->
为什么要使用`typescript`?
  - `js`为动态类型语言，实例化之前我们都不知道变量具体的类型是什么，使用`ts`可以避免如:`Uncaught TypeError：'xxx' is not a function`
  - 规范方便，不易出错，提示友好,增强了编辑器功能如：`提示`、`代码补全`、`接口提示`、`跳转到定义`等
  - 对函数参数类型限制，对数组对象类型限制，避免定义出错，如数据解构复杂较多时。
  - 可读性和维护性，如: 看后端接口返回值需到network或接口文档看, 而使用`ts`，在编辑器中就会直接提醒
  - 编译阶段发现大部分错误
## 缺点
  - 有学习成本，需理解接口`interface`、泛型、类、枚举类型等
  - 会增加一些`开发成本`, 不过只是前期
  - 编译`typescript`需要时间，意味着项目大了过后开发和生产环境编译速度成了考验
## ts类型
  - 常用: boolean、string、number、array、enum、any、void
  - 不常用: tuple、null、undefined、never
元组：已知元素数量和类型的数组、各元素类型可以不相同、但是位置上的类型必须相同
```
const test: [string, number] = ["1", 2]
```
undefined,null：属于所有基本类型的子类，所以可以赋值给其他已定义的类型
```
const test: string = undefined
```
object: 是`javascript`的常规对象类型,并不是基础数据类型
```
const test = (val: object) => {}
test(null), test(undefined) // error
```
对象类型，首先理解下`interface`和`type`的区别：`type`(类型别名)更强,右侧可以是任意类型, 凡是可以用interface来定义的type也可以，type可以声明元组、联合类型、基本类型别名,`interface`(接口)可以进行声明合并`type`不行。使用中一般`interface`偏多,需要用到其他类型时会使用`type`。

```
interface Test {
  name: string;
  age: number;
}
interface TestChild extends Test {
  sex: string;
}
```
unknown,any
```
// unknown可以表示任意类型，同时也告诉TS开发者也不知道具体类型
const test: unknown
test.toFixed(1) // error
if (typeof test === 'number') {
  test.toFixed(1) // ok
}
```
联合类型: 由两个或多个其他类型组成，表示可能为其中任何一个值，类型间使用'|'隔开，较多时可使用type声明
```
type Test = string | number
// 联合类型的隐式推到可能会导致错误, 访问不共同具有的属性
function test(value: Test): number {
  return value.length; // number类型不具备length会报错，可通过tyepof value === 'string'判断下
}
```
never: 是其他类型包括(null和undefined)的子类型，代表从不会出现的值
```
使用情况: 当有个联合类型type
interface One {
  type: 'One'
}
interface Two {
  type: 'Two'
}
type Test = One | Two;
function Test(type: Test) {
  // switch中,ts是可以收窄类型
  switch(type) {
    'One': break // type为One类型
    'Two': break // type为Two类型
    default:
      let val: never = type
  }
}
当type新增一个类型Three时，Test中switch忘记针对新类型处理时，进入default此时type收窄为Three类型，无法赋值给never导致编译错误
第二种: 当函数返回值是抛出异常的时候
function Test(msg: string): never {
  throw new Error(msg)
}
```
void: 表示对函数的返回值并不在意或者该函数无返回值
```
interface Props {
  fun: () => void;
}
```
enum: 枚举,底层为number的实现
```
普通枚举
enum Test {
  a,
  b,
  c
}
const test: Test = Test.a // 0
字符串枚举
enum Test {
  a = 'a',
  b = 'b'
}
混合枚举
enum Test {
  a = 'a',
  b = 2
}
//=====
enum Test {
  a,
  b,
  c = 4,
  d
}
//=======
const getValue = () => return 4;
enum Test {
  a = getValue(),
  b,
  c
}
```
泛型: 通过传入的参数类型来得到具体的类型
```
基础样式
function Test<T>(value: T): T {
  return value
}
Test<string>('a') // 代表返回类型为string，参数也为string类型

当把泛型理解为一种方法实现时，会想到方法有多个参数、默认值；泛型也可以
type Test<T, U = string> = {
  a: T,
  b: U
}
type A = Test<number> // A = { a: number, b: string }
type B = Test<number, number> // B = { a: number, b: number }
//==========
是函数的话，就会有一些限制约束
1. Readonly: 构造一个所有属性为只读，无法重新分配所构造的类型的属性
interface Test {
  a: string
}
const test: Readonly<Test> = {
  a: 'a'
}
test.a = 'b' // Cannot assign to 'title' because it is a read-only property
2. Pick<T, K>: 从T中挑选出一些K属性来构造一个类型
interface Test {
  a: string;
  b: string;
  c: string;
}
type TestPick = Pick<Test, 'a' | 'b'>
const test: TestPick = {
  a: 'a',
  b: 'b'
}
3. Omit<T, K>: 从T中排除一些K属性来构造一个类型
type TestOmit = Omit<Test, 'a'>
const test: TestOmit = {
  b: 'b',
  c: 'c'
}
4. Record: 约束键类型为keys, 值类型为values的对象类型
enum Test {
  a = 'name',
  b = 'age'
}
const test: Record<Test, string> = {
  [Test.a]: 'a'
}
// error: 类型中缺少属性'age', 但类型Record中需要该属性，因此也可以做全面性检查
keyof 关键字可以用来获取一个对象的所有key
type Test = {
  id: string;
  name: string;
}
type TestKeys = keyof Test // 'id' | 'name'
5. Extract<T, U>: 从T和U中提取相同的类型
interface Test {
  a: string;
  b: string;
}
interface Uest {
  b: string;
  c: string;
}
type TestExtra = Extract<Test, Uest>;
const test: TestExtra = {
  b: 'b'
}
6.Partial: 所有属性可选
interface Test {
  a: string;
  b: string;
}
type PartialTest = Partial<Test> // { a?: string; b?: string }
7. Required: 所有属性必选
type Test = {
  a?: string;
  b: string;
}
type RequiredTest = Required<Test> // { a: string; b: string }
```
索引签名: 可以来定义任意key为string,value为number的类型
```
interface Test {
  [key: string]: number;
}
```
TS的断言: 类型断言不是类型转换,断言成一个联合类型中不存在的类型是不允许的
```
断言写法
1. <类型>值: <string>test
2. value as string
3. 非空断言: 用于从类型中删除null, undefined不进行检查. 在表达式之后写入代表该值不是null和undefined // test!.toFixed()
```