---
title: 从零开始的Rust
tags:
  - Rust
  - 从零开始系列
publish: true
created: 2023-08-25 19:00:00
updated: 2024-03-05 21:07:37
---

参考资料：

- Video:  [Rust编程语言入门教程（Rust语言/Rust权威指南配套）【已完结】](https://www.bilibili.com/video/BV1hp4y1k7SV)
- Cookbook: [Rust 程序设计语言 - Rust 程序设计语言 简体中文版 (kaisery.github.io)](https://kaisery.github.io/trpl-zh-cn/)

# 程序：猜数游戏

Rust 是一个强类型静态语言，意味着要想运行它需要先进行编译，可以使用命令 `Rustc filename.rs` 编译 Rust 源代码，通过 `./filename` 运行编译好的程序。

但这种方式仅适用于简单的源文件编译，Rust 中使用 cargo 来对项目进行管理，`cargo new project_name` 可以创建一个 Rust 工程项目，这个工程项目包含源代码、目标程序、cargo 配置项三个部分，并使用 git 工具进行版本管理

```toml
[package]
name = "rust_playground"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
rand = "0.8.5"
```

```Rust
use std::cmp::Ordering; // prelude
use std::io; // prelude
use rand::Rng; // trait

fn main() {
    println!("Welcome to the guessing game!");

    let secret_num = rand::thread_rng().gen_range(0..101);
    loop {
        let mut guess = String::new();
        println!("Please guess a number!");
        io::stdin().read_line(&mut guess).expect("wrong number!");
        let guess:i32 = match guess.trim().parse() {
            Ok(val) => val,
            Err(_) => continue,
        };

        match guess.cmp(&secret_num) {
            Ordering::Greater => println!("Too big!"),
            Ordering::Less => println!("Too small!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}

```

在 Rust 中，程序首先会导入一些标准库，这些标准库就称为 prelude，它可以保证你使用一些简单的数据结构和标准的输入输出等功能。

引入的各种 Rust 包通过 `cargo.toml` 进行管理，暴露的接口被称为 trait，cargo 包管理机制如下：

1. `cargo.toml` 文件中引入的包无法直接使用，需要进行 `cargo build`，并将具体的版本信息写入 `cargo.lock` 中（`cargo.lock` 中的包版本可能会和 `cargo.toml` 声明的不一致，因为 cargo 会自动选择当前大版本中的最新小版本写入 `cargo.lock` 中）
2. 在下次 `cargo build` 时会直接调用 `cargo.lock` 中的包，从而保证包的版本一致性
3. 当我们打算更新 cargo 包时，我们使用 `cargo update` 来更新，cargo 会自动重新计算依赖关系

# 通用编程规范

## 变量与常量

变量分为两种：不可变变量和可变变量

1. 不可变变量
```rust
fn main() {
    let x = String::from("hello world");
    println!("{}", x);
}
```

上面的 `x` 就是不可变变量，如果对不可变变量进行赋值就会出错：

```rust
fn main() {
    let x = String::from("hello world");
    x = String::from("test") // error: cannot assign twice to immutable variable
}
```

2. 可变变量
```rust
fn main() {
    let mut x = String::from("hello world");
    println!("{}", x);
    x = String::from("test");
    println!("{}", x);
}
```

上面的 `x` 就是可变变量，`x` 经历了两次赋值

![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230825193258.png)

我觉得常量与不可变的变量最大的一个区别就是：变量的初始化是在程序运行时**动态完成**的，但常量的初始化是在编译阶段**写死在代码**中的

## shadowing

在 Rust 中，每个变量的值和变量名都是一一对应的，因此通过覆写的方法可以修改变量的数据类型

```rust
fn main() {
    let x = 1;
    println!("the value of x is {}", x);
    let mut x: u32 = x + 1;
    println!("the value of x is {}", x);
    x = x+2;
    println!("the value of x is {}", x);
}
```

# 所有权*

**所有权是 Rust 的核心**，它让 Rust 无需垃圾回收就可以轻松管理<mark style="background: #FF5582A6;">堆</mark>内存

内存管理的方式有很多，类似 java 就是把垃圾管理机制放在运行过程中，由 GC 自动进行垃圾回收；或者类似 c++，需要程序员手动进行内存申请和释放，极大增加了心智负担；对比上面两种主流方式，可以发现，GC 可以减少程序员管理内存的压力，但是会提高内存需求，自行管理内存虽然简洁明了，但常常会出现野指针、内存溢出等尴尬情况，Rust 为了解决这个问题，引入了所有权概念，使得其在编译阶段就完成了对内存的管理，且保证了程序运行的安全

> [!attention]
> 在深入了解所有权之前，请牢记所有权规则：
> 1. Rust 中的每一个值都有一个 **所有者**（_owner_）
> 2. 值在任一时刻有且只有一个所有者
> 3. 当所有者（变量）离开作用域，这个值将被 drop

```rust
fn main() {
    {
        let s = String::from("hello world");
        println!("{}", s);
    }
        println!("{}", s); //error
}
```

String 类型的分配是一个典型的堆分配方式，上面这段代码，会在编译时报错，因为它没有遵循所有权规则，尝试调用一个在作用域外的变量，所以失败了；变量在作用域结束时会自动调用 `drop` 函数，将分配的内存还给分配器

```rust
fn main() {
    let s1 = String::from("hello world");
    let s2 = s1;
    println!("{}", s1); //error
}
```

上面的代码阐述了另一个可能遇到的问题，在执行 `let s2 = s1` 这段代码时，需要考虑其采用的是深拷贝还是浅拷贝，在深拷贝情况下，实际上是重新开辟了一段内存给 s2 并将 s1 的值进行 copy，但在 Rust 中 `let s2 = s1` 执行的是浅拷贝，因此只是移动了指针的指向 `*s2->s1`，如果依然采用上述内存回收方法，在释放时会进行<mark style="background: #FF5582A6;">二次释放</mark>，即 `drop` 函数会释放 `s1` 和 `s2` 内存，但 `s2` 的内存已经释放过一次了

所以在 Rust 中，上述情况 `s1` 不再具有字符串的所有权，而是转移给了 `s2`

```rust
fn main() {
    let s = String::from("hello world");
    take_ownership(s);
    println!("{}", s); //error
}

fn take_ownership(s: String) {
    println!("{}", s);
}
```

如果变量被当作参数传入函数中，其实也是一次 `赋值` 操作，因此 `main函数` 中变量 `s` 的所有权被 `take_ownership` 中的参数 `s` “夺走”，main 函数中的变量 `s` 失效！

聪明的你一定想到了一种转移所有权的方法：

```rust
fn main() {
    let mut s = String::from("hello world");
    s = take_ownership(s);
    println!("{}", s);
}

fn take_ownership(s: String) -> String {
    println!("{}", s);
    s
}
```

是的，你可以通过返回值进行转移了，但是有一个很傻逼的点，如果你需要<mark style="background: #BBFABBA6;">返回其它参数</mark>的话，你就需要进行**解构**：

```rust
fn main() {
    let s = String::from("hello world");
    let (s, ss) = take_ownership(s);
    println!("{}", s);
    println!("{}", ss);
}

fn take_ownership(s: String) -> (String, String) {
    let ss = String::from("bye world");
    println!("{}", s);
    (s, ss)
}
```

为了解决上面的问题，我们可以使用 Rust 的另一个特性：**引用**

## 引用与借用

引用这一特性对我来说并不陌生，在学习 C 语言数据结构时就已经见过了"引用"这一特性，并且原书中说只是为了简化操作而引入的一种特性（简化了操作指针，可以直接把引用当作变量进行操作，如果用指针则还需要进行取值 `(*p)` 操作），Rust 具体操作如下：

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);

    println!("The length of '{s1}' is {len}");
}

fn calculate_length(s: &str) -> usize {
    s.len()
}
```

需要注意的是它们的引用关系是这样的：

![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230826191237.png)

在函数定义中，我们获取 `&String` 而不是 `String`。这些 & 符号就是 **引用**，它们允许你使用值但不获取其所有权

我们将创建一个引用的行为称为 **借用**（*borrowing*）。正如现实生活中，如果一个人拥有某样东西，你可以从他那里借来。当你使用完毕，必须还回去。我们并不拥有它

### 可变变量引用

在使用引用时，在对可变变量进行引用时需要注意避免<mark style="background: #FF5582A6;">数据竞争</mark>，不能同时声明 2 个/以上对同一可变变量的引用

> [!attention]
> 引起数据竞争存在三个条件：
> - 两个或更多指针同时访问同一数据
> - 至少有一个指针被用来写入数据
> - 没有同步数据访问的机制
> 当三个条件都满足时，就会产生数据竞争


```rust
fn main() {
    let mut s = String::from("hello world");
    let s1 = &mut s;
    let s2 = &mut s;
    println!("{}, {}", s1, s2); // error
}
```

上述代码中，s1 和 s2 都是可变变量 s 的引用，违反数据竞争，因此报错

### 悬垂引用

考虑一种情况，如果指针指向的内存被释放，那么指针就会成为"**悬垂引用**"（C 语言里叫做**野指针**），这就会发生一系列可能出现的问题，这对于程序来说是不安全的，在 Rust 中，我们可以在编译时期就避免这个问题出现，<mark style="background: #FF5582A6;">当你拥有一些数据的引用，编译器确保数据不会在其引用之前离开作用域</mark>

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");
    &s
}
```

上面的代码是会直接报错了，因为不允许将借用的值作为返回值，这样如果作用域在 `dangle` 函数外，`reference_to_nothing` 变量就会成为一个野指针

## 切片 slice

切片是 Rust 的另外一种不持有所有权的数据类型

```rust
use std::io;

fn main() {
    println!("Please input a word:");
    let mut sentence = String::new();
    io::stdin().read_line(&mut sentence).expect("wrong word!");
    let first_word_idx = first_word(&sentence);
    println!("The length of first word is {first_word_idx}");
}

fn first_word(s: &str)->usize{
    let bytes = s.trim().as_bytes();
    for(i, &item) in bytes.iter().enumerate(){
        if item == b' ' {
            return  i;
        }
    }
    s.len()
}
```

在上面这个例子中，我们创建了一个 `first_word` 方法，能够返回字符串第一个单词的长度，但这里会有一个 bug：如果我们在后面代码中把 `sentence` 的内容清空，`first_word_idx` 就无效了！它会指向一个错误的地址！

为了解决上述的问题，我们需要使用字符串切片功能

- 形式：`[start_index..end_index]`
	- 开始索引就是切片的起始位置的索引值
	- 结束索引就是切片的结束位置的下一个索引值
- 类型：`&str`（比 `&String` 好用，同时可以接受字符串和切片类型）
- 本质：切片保留了开始指针和长度，实际上是对变量的一种借用

```rust
fn main() {
    let s = String::from("hello world");
    let hello = &s[0..5]; // 也可以写成&s[0..]
    let world = &s[6..11]; // 也可以写成&s[6..]
    let whole = &s[..];
    println!("The original s is '{s}'");
    println!("The 0..5 of s is '{hello}'");
    println!("The 6..11 of s is '{world}'");
    println!("The whole of s is '{whole}'");
}
```
> [!note]
> 给我感觉有点像 python 里的 slice 用法，不过要注意使用切片需要添加 `&` 符号，且<mark style="background: #FF5582A6;">这种切片只支持 utf-8 类型</mark>

于是之前的第一个单词程序可以被覆写为：

```rust
use std::io;

fn main() {
    println!("Please input a word:");
    let mut sentence = String::new();
    io::stdin().read_line(&mut sentence).expect("wrong word!");
    let first_word_idx = first_word(&sentence);
    sentence.clear(); // error
    println!("The length of first word is {first_word_idx}");
}

fn first_word(s: &str)->&str{
    let bytes = s.trim().as_bytes();
    for(i, &item) in bytes.iter().enumerate(){
        if item == b' ' {
            return  &s[..i];
        }
    }
    &s[..]
}
```

这时如果执行 `sentence.clear()` 就会报错编译失败，因为数据在变为**不可变变量**后无法再变为**可变变量**

> [!help]
> 这里需要详细讲解这个过程，我第一遍看得时候直接懵了，直呼 **Rust 牛逼**！
> 1. 首先，调用 `first_word` 函数并传入 `sentence` 变量和之前一样
> 2. 不一样的地方在于，之前返回值是 `usize` 类型，这是一个无符号整型，此时 `sentence` 还是可变变量类型；
> 3. 而之后的改进版返回的是 `sentence切片` ，这时 `sentence` 直接转换为不可变变量（从可变变量转为不可变变量，之后不能再转为可变变量了），从而导致代码编译报错（使用切片，变量和切片就绑定了！）
