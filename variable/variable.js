'use strict';

// Variable read & write
// let (ES6에 추가됨)
// global scope
let globlaVar = 'hoh';
// Block scope
{
    let name = 'sujin';
    console.log(name);
    name = 'hello';
    console.log(name);
}
console.log(name);

// var (don't use it) block scope이 없음
// var hoising (어디에 선언되었는지와 상관없이 항상 제일 위로 선언을 끌어올려주는 것이다.)
console.log(age);
{
    age = 4;
    var age;
}

// Constant 변하지 않는 값. immuatable data type 
// const의 장점 = security, thread safety, reduce human mistakes


// variable types
// primitive - number, string, boolean, null, undefined, symbol
// object, box container
// function, first-class function
const name1 = 'branden';
const greeting = `hello ${name1}`; // template literals

// boolean
// false: 0, null, undefined, NaN, ''

// null

// undefined


// symbol, create unique identifiers for objects
const symbol1 = Symbol('id');
const symbol2 = Symbol('id');
console.log(symbol1 !== symbol2);

// dynamic typing - 선언할 때 어떤 타입인지 선언하지x => TypeSciprt가 나왔다..
let text = 'hello';
console.log(`value: ${text}, type: ${typeof text}`);
text = 1;
console.log(`value: ${text}, type: ${typeof text}`);
text = '7' + 5;
console.log(`value: ${text}, type: ${typeof text}`);
text = '8' / '2';
console.log(`value: ${text}, type: ${typeof text}`);
 
