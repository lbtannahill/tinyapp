// test.js


// node reverse.js 1 fish 2 fish
// 1
// hsif
// 2
// hsif


// Write a program that takes any number of command line arguments, all strings,
// and reverses them before outputting them one at a time to the console.

let strings = process.argv.slice(2);

let newFunc = function(strings) {
  newString = [];
  for (let i = strings.length - 1; i >= 0; i--) {
    newString += strings[i];
  }
  return newString;
};

console.log(newFunc());
