# OvumScript ![PRs](https://img.shields.io/badge/PRs-welcome-green)
This is the source code for OvumScript, a programming language built using JavaScript. OvumScript was built using code from [Eloquent Javascript](https://eloquentjavascript.net/), by Marijn Haverbeke. 
## Installation
1. Make sure you have a recent version of `node.js` installed on your machine.
2. Clone the source with `git`:
```
git clone https://github.com/antonio-erick/ovumscript.git
```
## Using the language
Open the `ovumscript.js` file and use the `run()` function to use the language.
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
## License
OvumScript is MIT licensed
