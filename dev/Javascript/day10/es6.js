//concatenation
//use + sign
let fname="Josephine"
let sname="Kyalo"
console.log("Hello" + fname + "" +sname);
console.log("Hello" + fname + "" +sname);

//after ES6
console.log(`Hello  ${fname}`  );

//default parameters
function sum(numA,numB=5){
    console.log(numA+numB);
}
sum(10)//15
sum(5, 15)//20

//Rest parameters
//examples: ...chars,...args

//using a function to return sum of only arguments passed as a number and ignore the non-number
function sum(...args){
    return args
}
let result=sum(1, "Pamela","hello",90,undefined,null);
console.log(result)

//spread
const arr1=['a', 3, {name: 'Alamin', age:26}]
const arr2=[1,{isMale: true}]

const combinedArray=[...arr1,...arr2]
console.log(combinedArray)
//adding new elements:
const info=[...combinedArray, '45',{uni:'Dkut'}]
console.log(info)

//merging the same keys of two arrays:
