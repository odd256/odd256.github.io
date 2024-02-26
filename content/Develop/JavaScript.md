---
title: JavaScript
tags:
  - JavaScript
publish: true
created: 2023-03-28T20:55
updated: 2024-02-26T12:38
---

[JavaScript学习指南：JS入门教程（非常详细） (biancheng.net)](http://c.biancheng.net/js/)

# 变量提升

JavaScript在预编译期会预处理声明的变量，但是变量的赋值操作发生在JavaScript执行期。
```javascript
	document.write(str); // undefined
	str = '123';         
	document.write(str); // '123'
	var str;             // 声明变量
```

虽然在这段代码中`str`变量是后声明的，但是在预编译阶段会直接提到最前面执行

# let和const关键字

在ECMAScript6中，新增了`let`和`const`两个关键字声明变量，其中：
1. `let`只在代码块内有效（类似局部变量），且代码块内不允许重复声明
	![Pasted image 20221119140624](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221119140624.png)
2. `const`和`let`用法基本一致，但const为常量，声明时就要赋初值
	![Pasted image 20221119141047](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221119141047.png)

# JS数据类型

- 基本数据类型：String、Number、Boolean、Null、Undefined、Symbol
- 引用数据类型：Object、Array、Function

使用`typeof()函数`可以轻松查看数据类型：
```javascript
	<script>
	    let str = '123'
	    console.log(typeof(str)); // out: string
	</script>
```

## 基本数据类型

- Number
	**注意**：`Number`类型所能定义的数值并不是无限的，JavaScript 中的`Number`类型只能表示 $-(2^{53} - 1)$ 到 $(2^{53} -1)$ 之间的数值。
- Null
	表示空值，但其实是特殊的Object对象，Null也代表空对象
- Undefined
	当我们声明对象，但未初始化的时候就是Undefined
- Symbol
	**表示独一无二的值**
	需要使用`symbol函数`生成
 ```javascript
	<script>
        let a = '999'
        let a1 = Symbol(a)
        let a2 = Symbol(a)
        console.log(a1==a2) // out: false
     </script>
  ```


## 引用数据类型

- Object
	`Object`是一组键值对的集合
```javascript
	let person = {
	    name: 'odd',
	    age:12,
	    tags: [
	        'sleep', 'study'
	    ],
	}
	console.log(person.tags); // out: ['sleep', 'study']
```

- Array
	按顺序排列的一组数据，数组中可以包含任意类型
```javascript
	console.log([1,2,'123']);         // 第一种创建方式，out: [1,2,'123']
	const a = new Array(1,2,'123')    // 第二种创建方式
	console.log(a);                   // out: [1,2,'123']
	console.log(a[1]);                // 也可以按index找元素
```

- Function
	具有特定功能的代码块，函数本身不会运行，在需要被调用时运行
```javascript
    function hello(){ // 一个最基本的函数
        console.log('hello world');
    }
    const fun = hello;
    fun(); // out: 'hello world'

	// 函数还可以作为参数被调用
	function glue(a, b){
        a(1,2,3)
        b()
    }

    function fun1(a, b, c){
        console.log(a, b, c);
    }

    function fun2(){
        console.log('This is fun2');
    }

    const fun = glue;
    fun(fun1, fun2); // out: 1 2 3; 'This is fun2'
```

# JS运算符

## 比较运算符

比较运算符用来比较运算符左右两侧的表达式，比较运算符的运算结果是一个布尔值，结果只有两种，不是 true 就是 false。

-` ==`和`===`的区别
	`==`为`true`只要满足值相等，`===`为`true`需要满足值相等，且类型相同
```javascript
    let a = '1'
    let b = 1
    let c = 1
    console.log(a==b);  // true
    console.log(a===b); // false
    console.log(b==c);  // true
    console.log(b===c); // true
```

# JS的结构化语句

- [x] if-else
- [x] switch-case
- [x] while
- [x] do-while
- [x] switch-case
- [x] for
- [x] for in
- [x] for of
- [x] break

常用的不说了，只记录重点的

## switch-case

```javascript
    let cond = 999
    switch(cond){
        case 9:
            console.log('hello world1');
            break;                         // break在每个case结束一定要加
        case '999':
            console.log('hello world2');
            break;
        case 999:
            console.log('hello world3');  // out: hello world3
            break;
        default:
            console.log('bye world')
    }
```

每个分支最多执行一次

**注意**：`switch`语句采用`===`来匹配`case`

## for in
- 主要用来遍历对象，==不适用于带键值对的类型==，例如`Array`
```javascript
    let person = ['xiaowang', 'xiaofang', 'xiaoli']
    for(let i in person){
        console.log(i); // out: 0\n 1\n 2\n，这里返回的是索引，不是元素值
    }
```

## for of
- ES6中新增加的一种for变体，可以用来遍历Array
```javascript
    let person = ['xiaowang', 'xiaofang', 'xiaoli']
    for(let i of person){
        console.log(i); // out: 'xiaowang', 'xiaofang', 'xiaoli'，这里返回的是索引，不是元素值
    }
```

## JavaScript标签

- 作用：用来跳转到指定位置
- 使用：用`tagname:`的形式，放在任意代码块/语句之前

- 代码示例
```javascript
    outerloop:
    for (let i = 0; i < 5; i++) {
        console.log('Enter outerloop'+i);
        innerloop:       // 定义一个标签
        for (let j = 0; j < 5; j++) {
            console.log('Enter innerloop'+j);
            if (j > 3) break;           // 跳出内层循环
            if (i == 2) break innerloop;  // 跳出内层循环
            if (i == 4) break outerloop;  // 跳出外层循环
        }
    }
    console.log('End!');
```

- 结果截图
![Pasted image 20221119171339](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221119171339.png)

# JS函数

## 基本定义和使用

```javascript
    function hello(towhat) { //定义一个函数
        console.log('hello '+towhat);
    }
    hello('world')   // out: hello world，在这里使用它
```

## 带默认参数的函数

```javascript
    function hello(towhat='world2') {
        console.log('hello '+towhat);
    }
    hello()         // out: hello world2
```

## JS函数返回值

返回值可以是任意类型（数组、数字、字符串、对象都可以），我们可以声明一个变量接收它

```javascript
    function hello(towhat = 'world') {
        console.log('hello ' + towhat);
        return towhat
    }
    let obj = hello() // out: hello world
    console.log(obj); // out: world
```

当然，你也可以一次性返回多个值，但是需要用数组包装一下：
```javascript
    function hello(a = 'hello', b = 123) {
        console.log(a+' '+b);
        return [a, b]
    }
    let obj = hello()    // out: hello 123
    console.log(obj);    // out: [hello, 123]
```

## 匿名函数

```javascript
    let fun = function (params) { // 这里是一个匿名函数，函数本身名称，但是赋予的变量有名称，因此调用变量就可以使用函数
        console.log('hello world');
    }

    fun() // out: hello world
```

**注意**：匿名函数只有先定义才能调用，但是函数声明可以先调用再定义，因为函数声明会在预编译期就得到声明，因此可以直接调用（类似变量提升），但是变量初始化是顺序执行的，因此不会被提升
```javascript
    hello1() // out: hello world
    hello2() // out: Uncaught ReferenceError: Cannot access 'hello2' before initialization

    function hello1(params) {
        console.log('hello world1');
    }

    let hello2 = function (params) {
        console.log('hello world2');
    }
```

# JS事件处理

1. 可以与html元素绑定
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button type="button" id="btn" onclick="hello()">click me</button>
    <!-- 直接绑定标签元素 -->
</body>
</html>
<script>
    function hello() {
        console.log('hello world');
    }
</script>
```
2. 可以使用JavaScript内置函数
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button type="button" id="btn">click me</button>
</body>
</html>
<script>
    function hello() {
        console.log('hello world');
    }
    document.getElementById('btn').onclick = hello // 通过js内置函数绑定元素
</script>
```

# JS作用域

## 全局作用域

全局作用域是指变量可以在当前脚本的任意位置访问，拥有全局作用域的变量也被称为“全局变量”，一般情况下拥有以下特征的变量具有全局作用域：  

-   最外层的函数和在最外层函数外面定义的变量拥有全局作用域；
-   所有未定义直接赋值的变量拥有全局作用域；
-   所有 window 对象的属性拥有全局作用域，例如 window.name、window.location、window.top 等。

```javascript
    let a = 'test'
    function hello(params) {
        console.log(a);
    }
    hello() // out: 
    console.log(a);
```

所有具有全局作用域的对象都会被绑定到window对象内，var会绑定，但是let不会绑定：

1. 当变量是`var`类型
```javascript
    var a = 'test'                // 这里的变量是var类型
    console.log(a);               // out: test
    console.log(window.a);        // out: test
    console.log(a === window.a);  // out: true
```

2. 当变量是`let`类型
```javascript
    let a = 'test'                // 这里变量是let类型
    console.log(a);               // out: test
    console.log(window.a);        // out: undefined
    console.log(a === window.a);  // out: false
```

## 局部作用域

在函数内部声明的变量具有局部作用域，拥有局部作用域的变量也被称为“局部变量”，局部变量只能在其作用域中（函数内部）使用：

```javascript
    function hello(){
        var a = 'test'
        console.log(a);
    }
    hello()              // out: test
    console.log(a);      // out: Uncaught ReferenceError: a is not defined
```

# JS对象
JavaScript是一个面向对象编程的语言，因此JavaScript中都是对象

## 创建对象

可以使用花括号`{ }`来创建对象，`{ }`中用来定义对象中的属性。属性是一个个`键:值`对的组合，其中键（属性名称）始终是字符串类型的，而值（属性值）则可以是任意类型，例如字符串、数组、函数或其它对象等

```javascript
    let person = {
        name: 'xiaozhang'
        , age: 12
        , displayInfo: function () {
            console.log(this.name, ',', this.age);
        }
    }
    person.displayInfo()  // out: xiaozhang, 12
```

在定义对象时，属性名称虽然是字符串类型，但通常不需要使用引号来定义，但是以下三种情况则需要为属性名添加引号：  

-   属性名为 JavaScript 中的保留字
-   属性名中包含空格或特殊字符（除字母、数字、_ 和 $ 以外的任何字符）
-   属性名以数字开头

```javascript
    let person = {
        'my name': 'xiaozhang'
        , 'my age': 12
    }
```

## 访问对象属性

1. 使用`对象名.属性名`
2. 使用`对象名["属性名"]`
```javascript
    let person = {
        'name': 'xiaozhang'
        , 'age': 12
    }
    console.log(person.name);
    console.log(person['age']);
```

## 修改对象属性

```JS
    let person = {
        'name': 'xiaozhang'
        , 'age': 12
    }
    person.name = 'xiaowang'
    person.age = 17
    console.log(person.name);    // out: xiaowang
    console.log(person.age);     // out: 17

    // 还可以遍历对象属性，然后修改

    for(i in person){
        person[i] = '123'
    }
    console.log(person.name);    // out: 123
    console.log(person.age);     // out: 123
```

## 删除对象属性

使用`delete`语句来删除对象中的属性：
```JS
    let person = {
        'name': 'xiaozhang'
        , 'age': 12
    }
    delete person.age
    console.log(person.age);    // out: undefined
```

## JS 调用对象的方法

```JS
    let person = {
        'name': 'xiaozhang'
        , 'age': 12
        , displayName: function () {
            console.log(this.name);
            console.log(this.age);
        }
    }

    person.displayName()         // out: xiaozhang 12
    person['displayName']()      // out: xiaozhang 12
```

## JS正则表达式

### 创建正则表达式

```JS
    let patt1 = new RegExp(pattern, modifiers)
    let patt2 = /pattern/modifiers
```

- `pattern` 是正则表达式
- `modifier`是修饰符，用来设置匹配模式

| 修饰符 | 描述                                       |
| ------ | ------------------------------------------ |
| i      | 执行对大小写不敏感的操作                   |
| g      | 执行全局匹配                               |
| m      | 执行多行匹配                               |
| s      | 允许使用`.`换行                            |
| u      | 使用Unicode码模式进行匹配                  |
| y      | “粘性”搜索，匹配从目标字符串的当前位置开始 | 

### 定义正则表达式
| 特殊字符 | 含义                                                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| \\       | 转义字符                                                                                                                                        |
| ^        | 匹配字符串开头                                                                                                                                  |
| $        | 匹配字符串末尾                                                                                                                                  |
| *        | 匹配前一个表达式0或多次，例如“/bo*/”能够匹配“A ghost boooooed”中的“booooo”和“A bird warbled”中的“b”，但是在“A goat grunted”中不会匹配任何内容。 |
| +        | 匹配前面一个表达式 1 次或者多次                                                                                                                 |
| ？       | 匹配前面一个表达式 0 次或者 1 次                                                                                                                |
| .        | 匹配除换行符之外的任何单个字符                                                                                                                  |
| \[xyz]   | 转义序列，匹配 x、y 或 z，可以使用破折号`-`来指定一个字符范围，例如“\[abcd]”和“\[a-d]”是一样的                                                    |
| \[^xyz]  | 反向字符集，匹配除 x、y、z 以外的任何字符                                                                                                       |
| \[\b]    | 匹配一个退格符                                                                                                                                  |
| \b       | 匹配一个单词的边界，即单词的开始或末尾                                                                                                          |
| \B       | 匹配一个非单词边界                                                                                                                              |
| \d       | 匹配一个数字，等价于“\[0-9]”                                                                                                                     |
| \D       | 匹配一个非数字字符，等价于“\[^0-9]”                                                                                                             |

### 使用正则表达式

偷懒ing :)
![Pasted image 20221120200656](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221120200656.png)

# Web相关对象 
## JS DOM
> 当网页加载时，浏览器就会自动创建当前页面的文档对象模型（DOM）。在 DOM 中，文档的所有部分（例如元素、属性、文本等）都会被组织成一个逻辑树结构（类似于族谱），树中每一个分支的终点称为一个节点，每个节点都是一个对象。

### Document对象
> 当浏览器加载一个 HTML 文档时，会创建一个 Document 对象，Document 对象是 DOM 树中所有节点的根节点。通过 Document 对象我们可以访问 HTML 文档中的所有元素

## JS Element对象

在DOM中每个分支都有一个节点，每个节点都有一个对象，这个对象就是Element对象

通过Element对象可以操作元素

## JS attributes对象

> 在 HTML DOM 中，通过 attributes 对象来表示 HTML 属性，在 attributes 对象中提供了多种添加、修改和删除 HTML 属性的方法

## JS BOM

> 浏览器对象模型（Browser Object Model，简称 BOM）是 JavaScript 的组成部分之一，BOM 赋予了 JavaScript 程序与浏览器交互的能力。  

window 对象是 BOM 的核心，用来表示当前浏览器窗口，其中提供了一系列用来操作或访问浏览器的方法和属性。另外，JavaScript 中的所有全局对象、函数以及变量也都属于 window 对象，甚至前面介绍的 document 对象也属于 window 对象。

## JS Navigator

> JavaScript navigator 对象中存储了与浏览器相关的信息，例如名称、版本等，我们可以通过 window 对象的 navigator 属性（即 window.navigator）来引用 navigator 对象，并通过它来获取浏览器的基本信息。

## JS Screen
> JavaScript screen 对象中包含了有关计算机屏幕的信息，例如分辨率、宽度、高度等，我们可以通过 window 对象的 screen 属性来获取它

## JS Location对象

> JavaScript location 对象中包含了有关当前页面链接（URL）的信息，例如当前页面的完整 URL、端口号等，我们可以通过 window 对象中的 location 属性来获取 location 对象

## JS History对象

> JavaScript history 对象中包含了用户在浏览器中访问过的历史记录，其中包括通过浏览器浏览过的页面，以及当前页面中通过`<iframe>`加载的页面。我们可以通过 window 对象中的 history 属性来获取 history 对象

# # JS定时器

## setTimeout()

`setTimeout`在计时结束后执行

```JS
    setTimeout(function(a){
        console.log(a);
    }, 1500, 'hello world') // 1.5s后，out: hello world
```

## setInterval()

可以定义一个能够重复执行的定时器，每次执行需要等待指定的时间间隔

```JS
    setInterval(function(a) {
        console.log(a);
    }, 1500, 'hello world') // 每隔1.5s，out: hello world
```

## 取消定时器

每个定时器在创建的时候都会产生一个唯一的ID，使用`clearTimeout`和`clearInterval`取消定时器

```JS
	let id1 = setTimeout(function (a) {
        console.log(a);
    }, 1500, 'hello world1')

    let id2 = setInterval(function (a) {
        console.log(a);
    }, 1500, 'hello world2')

    console.log(id1);   // ID:1, out: 1
    console.log(id2);   // ID:2, out: 2
  
    document.getElementById('btn').onclick = function () {
        clearTimeout(id1)   // 取消定时器1
        clearInterval(id2)  // 取消定时器2
    }
```

# JS 异常处理

## try-catch-finally结构

可以使用`try catch`捕获异常

```JS
try {  
    // 可能会发生异常的代码  
} catch(error) {  
    // 发生异常时要执行的操作  
} finally{
    // 无论异常与否都要执行
}
```

## 抛出异常

```JS
    function onlyPositive(num) {
        if(num <= 0){
            throw new Error('不能小于0')  //小于0就抛出异常
        }
        console.log(num);
    }

    try {
        onlyPositive(1)
        onlyPositive(-1)
        onlyPositive(2)
    } catch (error) {
        console.log(error);    // 会打印抛出的异常
    }
```

## 异常类型

| 错误类型       | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| EvalError      | 使用 eval() 函数时发出错误，会抛出该错误                     |
| InternalError  | 由 JavaScript 引擎内部错误导致的异常，会抛出该错误           |
| RangeError     | 范围错误，当使用了超出允许范围的数值时，会抛出该错误         |
| SyntaxError    | 语法错误，当代码中存在任何语法错误时，会抛出该错误           |
| TypeError      | 类型错误，当使用的值不是预期类型时，会抛出该错误             |
| URIError       | URI 错误，当使用 URI 相关函数但传入 URI 参数时，会抛出该错误 |
| ReferenceError | 参数错误，当尝试使用未定义的变量、函数、对象时，会抛出该错误 | 


# JS闭包

## 什么是闭包？

闭包指的就是一个函数。当两个函数彼此嵌套时，**在外部调用内部的函数**的过程就是闭包。

**如何在外部调用内部的函数呢？**
用外部函数return内部函数
```JS
    function outerFun() {
        let num = 0
        function innerFun() {
            num++
            return num
        }
        return innerFun       // 将内部函数作为外部函数的返回值返回
    }

    let fun = outerFun()
    console.log(fun())       // out: 1
```

## 闭包的用途

在JavaScript中，如果一个对象不再被引用，那么这个对象就会被GC回收，否则这个对象会一直存在于内存中

在前面的代码示例中，`innerFun`在`outerFun`的内部，`innerFun`又被`fun`引用，因此`outerFun`间接被引用，其内部变量一直存在于内存中，如果我们反复调用`fun()`，`num`会一直增加，不会被初始化

```JS
    function outerFun() {
        let num = 0
        function innerFun() {
            num++
            return num
        }
        return innerFun
    }
    let fun = outerFun()

    console.log(fun());     // out: 1
    console.log(fun());     // out: 2
    console.log(fun());     // out: 3
```

因此，**当我们需要在函数中定义一些变量，并且希望这些变量能够一直保存在内存中，同时不影响函数外的全局变量时，就可以使用闭包**

## 闭包的常见用法

1. 在实际开发中，通常会将闭包与匿名函数结合使用，创造一个私有作用域，可以==有效减少全局变量污染==
```JS
    let fun = (function () {
        let num = 0
        return function () {
            return ++num
        }
    })()

    console.log(fun());  // out: 1
    console.log(fun());  // out: 2
    console.log(fun());  // out: 3
```

2. 同一个闭包，每次创建都会产生一个新的独立环境
```JS
function fun(i) {
    function innerFun(){
        return i;
    }
    return innerFun()
}
  
    console.log(fun(1));
    console.log(fun(2));
    console.log(fun(3));
```

# JS解析JSON

## JSON字符串转为JS对象

```JS
let json = '{"course": {"name": "JavaScript","author": "http://c.biancheng.net/","year": 2021,"genre": "Getting Started tutorial","bestseller": true},"fruits": ["Apple","Banana","Strawberry","Mango"]}';

let obj = JSON.parse(json)

console.log(json);             // 输出字符串
console.log(obj);              // 输出object对象
console.log(obj.course.name);  // out: JavaScript
```

## JS对象转为JSON字符串

```JS
let obj = {
    "name": "JavaScript",
    "author": "http://c.biancheng.net/",
    "year": 2021,
    "genre": "Getting Started tutorial",
    "bestseller": true
};

let str = JSON.stringify(obj)

console.log(obj);          // 输出对象
console.log(str);          // 输出字符串
```
