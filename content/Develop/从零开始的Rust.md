---
title: 从零开始的Rust
tags:
  - Rust
  - 从零开始系列
publish: true
created: 2023-08-25 19:00:00
updated: 2024-02-28 17:20:18
---

参考资料：
- Video:  [Rust编程语言入门教程（Rust语言/Rust权威指南配套）【已完结】](https://www.bilibili.com/video/BV1hp4y1k7SV)
- Cookbook: [Rust 程序设计语言 - Rust 程序设计语言 简体中文版 (kaisery.github.io)](https://kaisery.github.io/trpl-zh-cn/)

# 程序：猜数游戏

Rust 是一个强类型静态语言，意味着要想运行它需要先进行编译，可以使用命令 `Rustc filename.rs` 编译 Rust 源代码，通过 `./filename` 运行编译好的程序。
但这种方式仅适用于简单的源文件编译，Rust 中使用 cargo 来对项目进行管理，`cargo new project_name` 可以创建一个 Rust 工程项目，这个工程项目包含源代码、目标程序、cargo 配置项三个部分，并使用 git 工具进行版本管理

```Rust
use std::cmp::Ordering; //prelude
use std::io; //prelude
use rand::Rng; //trait

fn main() {
    println!("Welcome to the guessing game!");

    let secret_number = rand::thread_rng().gen_range(0..101);

    loop {
        let mut guess = String::new();
        println!("Please guess a number:");
        io::stdin().read_line(&mut guess).expect("wrong number!");
        let guess: i32 = match guess.trim().parse() {
            Ok(val) => val,
            Err(_) => continue,
        };

        match guess.cmp(&secret_number) {
            Ordering::Greater => println!("Too big"),
            Ordering::Less => println!("Too small"),
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
![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230825193258.png)
我觉得常量和变量最大的一个区别就是：变量的初始化是在程序运行时**动态完成**的，但常量的初始化是在编译阶段**写死在代码**中的

## shadowing

在 Rust 中，每个变量的值和变量名都是一一对应的，因此通过覆写的方法可以修改变量的数据类型

```Rust
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

所有权是 Rust 的核心，它让 Rust 无需垃圾回收就可以轻松管理<mark style="background: #FF5582A6;">堆</mark>内存

内存管理的方式有很多，类似 java 就是把垃圾管理机制放在运行过程中，由 GC 自动进行垃圾回收；或者类似 c++，需要程序员手动进行内存申请和释放，极大增加了心智负担；对比上面两种主流方式，可以发现，GC 可以减少程序员管理内存的压力，但是会提高内存需求，自行管理内存虽然简洁明了，但常常会出现野指针、内存溢出等尴尬情况，Rust 为了解决这个问题，引入了所有权概念，使得其在编译阶段就完成了对内存的管理，且保证了程序运行的安全

> [!attention]
> 在深入了解所有权之前，请牢记所有权规则：
> 1. Rust 中的每一个值都有一个 **所有者**（_owner_）
> 2. 值在任一时刻有且只有一个所有者
> 3. 当所有者（变量）离开作用域，这个值将被丢弃

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
上面的代码阐述了另一个可能遇到的问题，在执行 `let s2 = s1` 这段代码时，需要考虑其采用的是深拷贝还是浅拷贝，在深拷贝情况下，实际上是重新开辟了一段内存给 s2 并将 s1 的值进行 copy，但在 Rust 中 `let s2 = s1` 执行的是浅拷贝，因此只是移动了指针的指向 `*s2->s1`，如果依然采用上述内存回收方法，在释放时会进行<mark style="background: #FF5582A6;">二次释放</mark>

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
如果变量被当作参数传入函数中，其实也是一次 `赋值` 操作，因此 `main函数` 中变量 s 的所有权被 `take_ownership` 中的参数 s “夺走”，main 函数中的变量 s 失效！

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
是的，你可以通过返回值进行转移了，但是有一个很傻逼的点，如果你需要返回其它参数的话，你就需要进行**解构**：
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

引用这一特性对我来说并不陌生，在学习 C 语言数据结构时就已经见过了"引用"这一特性，并且原书中说只是为了简化操作而引入的一种特性（简化了操作指针，可以直接把引用当作变量进行操作，如果用指针则还需要进行取值 `(*p)` 操作），不过这一特性似乎是 C++中的特性，Rust 具体操作如下：

```rust
fn main() {
    let s = String::from("hello world");
    let ss = take_ownership(&s); //use reference
    println!("{}", s);
    println!("{}", ss);
}

fn take_ownership(s: &String) -> String { //use reference
    let ss = String::from("bye world");
    println!("{}", s);
    ss
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

## 程序：第一个单词

```rust
use std::io;

fn main() {
    let mut s = String::new();
    io::stdin().read_line(&mut s).expect("wrong input");
    let fs: String = first_word(&s).to_string(); //这里使用了deref coercions特性
    println!("the first word is {}", fs);
}

fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i];
        }
    }
    &s[..]
}
```

程序的目标是找到输入的句子中的第一个单词，主要是引用的一些用法，同时展现了 Rust 语言的特性，即能够在编译阶段解决安全性问题