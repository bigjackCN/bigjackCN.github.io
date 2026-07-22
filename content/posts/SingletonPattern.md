+++
date = '2026-07-22T01:01:03-04:00'
draft = true
title = "Java的单例模式"
tags = ["Java", "Programming", "Design Pattern"]
categories = ["学习"]

[cover]
image = "images/flying-pig.jpg"
alt = "flying pig"
caption = ""
+++


# 单例模式 (Singleton Pattern)
一个类只有一个实例

## 静态内部类
只有调用getInstance方法时实例化  
实现懒加载
```java  
public class Singleton {
    private Singleton() {}

    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE
    }
} 
```

## 枚举
天然保证单例和线程安全
```java
public enum Singleton {
    INSTANCE;

    public void doSomething() {
        System.out.println("单例方法被调用")
    }
}

// 调用方式
Singleton.INSTANCE.doSomething();

```