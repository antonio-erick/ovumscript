# OvumScript ![PRs](https://img.shields.io/badge/PRs-welcome-green)
This is the source code for OvumScript, a programming language built using JavaScript. OvumScript was built with code from [Eloquent Javascript](https://eloquentjavascript.net/), by Marijn Haverbeke. 
## Installation
1. Clone the source with `git`:
```
git clone https://github.com/antonio-erick/ovumscript.git
```
## Using the language
Open the `ovumscript.js` file and call the `run()` function to use the language, then use `node ovumscript.js` on your terminal to execute the code.
### Examples:
```js
run(`
do(
  define(dinner, "steamed hams"),
  print("What's dinner?"),
  print(dinner)
)
`)
```
```js
run(`
do(
  define(myAge, 15),
  define(olderMe, +(myAge, 5)),
  print(olderMe)
)
`)
```
```js
run(`
do(
  define(toDoList, array("Clean the dishes", "Feed the dog", "Do the homework")),
  define(firstChore, element(toDoList, 1)),
  print(firstChore)
)
`)
```
## License
OvumScript is MIT licensed
