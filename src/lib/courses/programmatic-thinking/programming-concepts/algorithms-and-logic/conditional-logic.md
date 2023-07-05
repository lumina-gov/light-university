Conditional logic is a fundamental concept in programming that enables us to write programs that make decisions based on certain conditions. In this unit, we will explore the basics of conditional logic, including if and else blocks, switch statements, and match statements.

## What Will You Learn

- Understand the basics of conditional logic in programming
- Learn about if and else blocks, switch statements, and match statements
- See how conditional logic is used in programming
- Explore how to write pseudo code that uses conditional logic
- Explore boolean operators and how they can be used in conditional logic

## Boolean Operators

Boolean operators are used in conditional logic to compare values and produce boolean expressions. The most common boolean operators include:

- `==` **equal to** - checks that two values are equal to eachother
- `!=` **not equal to** - checks that two values do not equal eachother
- `<` **less than** - checks that the value on the left is less than the value on the right
- `<=` **less than or equal to** - checks that the value on the left is less than or equal to the value on the right
- `>` **greater than** - checks that the value on the left is greater than the value on the right
- `>=` **greater than or equal to** - checks that the value on the left is greater than or equal to the right
- `&&` **logical and** - checks if both the left and right side of the `&&` evaluates to true
- `||` **logical or** - checks if either the left or right side of the `||` evaluates to true
- `!` **logical not** - this is used to invert `false` into `true` and `true` into `false`, usually written to the left of the value it is inverting

## How to use boolean operators

```jsx
x == 5 // true if x equals 5
x != 5 // true if x does not equal 5
x < 5 // true if x is less than 5
x <= 5 // true if x is less than or equal to 5
x > 5 // true if x is greater than 5
x >= 5 // true if x is greater than or equal to 5
x > 5 && y < 10 // true if x is greater than 5 AND y is less than 10
x < 5 || y > 10 // true if x is less than 5 OR y is greater than 10
!(x == 5) // true if x does not equal 5
```

:::note

The specific syntax of boolean operators may vary from language to language, so make sure to check the specific syntax in the language you are working with

:::

::question{slug="difference-between-and-and-or" question="What is the difference between `&&` (AND) and `||` (OR)?" context="`&&` checks if both the left and right side of the `&&` evaluates to true, while `||` checks if either the left or right side of the `||` evaluates to true."}
## If and Else Blocks

An if statement is a conditional statement that executes a block of code if a certain condition is true. An else block can be used to execute a different block of code if the condition is false. If and else blocks are the most basic form of conditional logic in programming.

If else blocks, can be chained together in most languages by using `else if` to support more complex cases.

## Writing Pseudo Code with Conditional Logic

When writing pseudo code that uses conditional logic, you should clearly outline the conditions that will be checked and the blocks of code that will be executed if those conditions are true or false.

Here is an example of pseudo code that uses an if and else block:

```js
// Example if else block using boolean operators
if x > 5 && y < 10
    // code to execute if x is greater than 5 AND y is less than 10
else if (x < 5 || y > 10)
    // code to execute if x is less than 5 OR y is greater than 10
else
    // code to execute if neither condition is true
```

## When to Use Conditional Logic

Conditional logic is used in programming whenever you want to execute different blocks of code based on certain conditions. For example, you might want to display a different message to the user based on whether or not they are logged in to your website.

Here are some examples of conditional logic in programming:

- Displaying a different message to the user based on whether or not they have items in their shopping cart
- Redirecting the user to the login page based on whether or not they are logged in to your website
- Following a different set of instructions based on whether or not a user is an admin

::question{slug="conditional-logic-example" question="Write an example of conditional logic that you have seen in a program or website that you use."}

::question{slug="conditional-logic-pseudocode-challenge" question="Write some pseudo code that uses conditional logic to print a different message based on whether a boolean variable is true or false."}

## Switch and Match Statements

Some programming languages, such as Java and C++, have switch statements, which allow you to execute different blocks of code **based on** the value of a **variable**. Rust, on the other hand, uses match statements to achieve the same functionality.

Here is an example of a switch statement in Java:

```java
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    // more cases
    default:
        System.out.println("Invalid day");
        break;
}
```

And here is the equivalent match statement in Rust:

```rust
match day {
    1 => println!("Monday"),
    2 => println!("Tuesday"),
    // more cases
    _ => println!("Invalid day"),
}
```

> Rust match statements are more powerful than switch statements because they can match on more than just the value of a variable, but we won't get into that here.

This is often more cleaner than writing a series of `if else` blocks

::question{slug="difference-between-if-else-and-switch" question="What is the difference between if/else blocks and switch/match statements?" context="If/else blocks are used to execute different blocks of code based on a condition, while switch/match statements are used to execute different blocks of code based on the value of a variable."}