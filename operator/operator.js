'use strict';

console.log('my' + ' cat');
console.log('1' + 2);
console.log(`string literals:

''''
1 + 2 = ${1 + 2 }`);


// logical operators or ||  and &&   not !
const value1 = true;
const value2 = 4 < 2;

// or 연산자는 앞에서 이미 true면 연산을 멈춘다
console.log(`or: ${value1 || value2 || check()}`); // 가장 헤비한 연산이 많은 것은 뒤에 두는 것이 효율적!!!

function check() {
    for(let i = 0; i < 10; i++){
        console.log('good');
    }
    return true;
}

// and 연산자는 앞에서 이미 fasle면 연산을 멈춘다
console.log(`or: ${value1 && value2 && check()}`);



// equality
const stringFive = '5';
const numberFive = 5;

// == loose equality, with type conversion 타입 신경 안쓴다.
console.log(stringFive == numberFive);
console.log(stringFive != numberFive);

// strict equality, no type conversion 타입 신경 쓴다. strict equality 쓰는 것이 좋다.
console.log(stringFive === numberFive);
console.log(stringFive !== numberFive);

const sujin1 = { name: 'sujin' };
const sujin2 = { name: 'sujin' };
const sujin3 = sujin1;
console.log(sujin1 == sujin2); // false
console.log(sujin1 === sujin2); // false
console.log(sujin1 === sujin3); // true

console.log(0 == false); // true
console.log(0 === false); // false
console.log('' == false); // true
console.log('' === false); // false
console.log(null == undefined); // true
console.log(null === undefined); // false


// conditional operator

// ternary operator
// condition ? value1 : value2;

// switch


// for loop operator
// for(begin; condition; step)