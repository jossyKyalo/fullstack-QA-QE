//PART ONE- Basics
//Question 1: How do you create an empty array in JavaScript?
//a) using square brackets---array literal syntax
let arrayName=[];
//b) using array constructor
let arr=new Array();
//c)using Array.of()---creates and empty array explicitly
let arrName= Array.of();


//Question 2: How do you access the first and last elements of an array?
let my_array=[2,90,10,43,5];
//a)accessing the first element:
console.log(my_array[0]);//2
//b)accessing the last element
console.log(my_array[my_array.length-1]);//5

//Question 3: How do you add an element to the end of an array?
//we can use push method
let myArray=[40,20,30];
myArray.push(10);
console.log(myArray);
//use splice method
myArray.splice(myArray[myArray.length-1],0,10)
console.log(myArray);

//Question 4: How do you remove the last element from an array?
//use pop
let arrayYangu=[20,34,22];
arrayYangu.pop(arrayYangu[arrayYangu.length-1])
console.log(arrayYangu);
//or use splice 
arrayYangu.splice(arrayYangu[arrayYangu.length-1],1)
console.log(arrayYangu);

//Question 5: How do you loop through an array in Javascript
//a) using for loop
let arrayy= [33,11,22,44,1];
for (let i=0; i<arrayy.length;i++){
    console.log(arrayy[i]);
}
//b) using forEach
arrayy.forEach(function(element){
    console.log(element);
});
//c) using for...of loop
for (let value of arrayy){
    console.log(value);
}
//d) using while loop
let i=0;
while(i<arrayy.length){
    console.log(arrayy[i]);
    i++;
}
//e) using do while loop
let index=0;
do{
    console.log(arrayy[index]);
    index++;
}while(index<arrayy.length);

//Question 6: How do you check if an element exists in array?
//using includes
let anotherArray=['fruits','vegetables','proteins'];
console.log(anotherArray.includes('fruits'));
//using indexOf
if(anotherArray.indexOf('proteins')===2){
    console.log('Element found!');
}else{
    console.log('Element not found');
}

//Question 7: How do you remove an element from an array at specifi index?
//use splice
anotherArray.splice(2,1)
console.log(anotherArray);

//Question 8: How do you concatenate two arrays in Javascript
let array1=['pop','push','shift'];
let array2=['join','slice','splice'];
console.log(array1.concat(array2));



//PART TWO- for experienced candidates
//Question 1: Write a function to flatten a nested array in Javascript
//a) using reduce
function flatArray(arrr){
    return arrr.reduce(function(flat, toFlatten){
        return flat.concat(Array.isArray(toFlatten)? flatArray(toFlatten):toFlatten);
    }, []);
}
console.log(flatArray([1,[2,[3,[4,5]]]]));
//b) using flat method
function flattenArray(arr){
    return arr.flat(Infinity);
}
console.log(flatArray([1,[5,[4,[7,6]]]]));

//Question 2: What does the reduce() method do in the flattenArray() function above?
// Answer: The reduce() method in JavaScript takes an array and applies a function to each element,
// accumulating the result into a single value. In the flattenArray() function above, the reduce() method
// is used to concatenate the current element (either a flattened sub-array or a non-array value) to the
// flattened array so far.

//Question 3: Can you give an example of a nested array that the flattenArray() function would be able to flatten?
let nestedArray=[1,[2,[3,4],5],6];
flattenArray(nestedArray);

//Question 4: Can you explain how the flat() method can be used to flatten an array in Javascript?
// The flat() method is a built-in method in Javascript that can be used to flatten an array.
// It takes a depth parameter, which specifies how many levels of nested arrays should be flattened.  
// If no depth parameter is provided, defaults to 1. Here's an example usage:
let nestedArr=[9,[0,[4,3],1],7]
console.log(nestedArr.flat(2));

//Question 5: What are some potential issues to watch out for when flattening arrays in Javascript?
// Answer: One potential issue to watch out for is the risk of creating a very large flattened array, which
// could lead to performance issues or memory errors. Another issue to be aware of is the possibility of
// circular references in nested arrays, which could cause infinite recursion if not handled properly.
// Finally, different flattening methods (e.g. using reduce() vs. using flat()) may have different
// performance characteristics, so it's important to choose the method that's most appropriate for your
// use case.

//PART THREE- JavaScript Array Manipulation
//Question 1: What is the difference between .map() and .forEach()?
// map() and .forEach() are both array methods that allow you to loop through an array, but they differ in what they return.
//     -map() returns a new array with the same length as the original array, where each element is the result of applying a callback function to the original element.
//     -forEach() does not return anything, but it simply executes a callback function on each element of the array.
//Example:
const numbers=[1,2,3,4,5];
const doubledNumbers= numbers.map(num=>num*2);
console.log(doubledNumbers);
numbers.forEach(num=> console.log(num*2));

//Question 2: How do you remove an element from an array in Javascript?
//use splice
let vegetables=['sukuma','cabbage','carrots','spinach'];
vegetables.splice(2,2)
console.log(vegetables)

//Question 3: What is the difference between .filter() and .find()
// Answer: Both .filter() and .find() are array methods that allow you to search for elements in an array that meet certain criteria.
//  -filter() returns a new array with all elements that pass a certain test provided by a callback function.
//  -find() returns the value of the first element in the array that passes a certain test provided by a callback function
//example:
const nums = [1, 2, 3, 4, 5];
const evenNumbers = nums.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]
const firstEvenNumber = nums.find(num => num % 2 === 0);
console.log(firstEvenNumber);

//Question 4: How do you sort an array in Javascript?
//use .sort() method
// let myNumbers=[10,1,0,3,76,11];
// myNumbers.sort()
// console.log(myNumbers)
const matunda=['apples','bananas','oranges']
console.log(matunda.sort());

//Question 5: How do you flatten a nested array in Javascript?
//use .flat()
const numberss= [1, 2, [3, 4], [5, [6, 7]]];
const flattenedNumbers = numberss.flat(2);
console.log(flattenedNumbers); 


//How to get first 3 elements of array in Javascript
//use slice
let proteins=['beans','eggs','milk','meat'];
console.log(proteins.slice(0,3));

//what is array[-1] in JS?
//Array[-1] in JavaScript will return the last element of the array
