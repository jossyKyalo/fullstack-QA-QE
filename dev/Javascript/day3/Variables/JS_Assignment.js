//QUESTION ONE- Declaring Variables
let age=25;
const schoolName="Greenwood High"
const studentsList=[];

//Difference between let,const, and var:
//a) let- scope: it is block-scoped
         //-it is used for variables that can be reassigned later
//b)const-scope: block-scoped
         //-re-declaration and re-assignment is not allowed
//c)var- it's an old way 
       //scope: function-scoped
       //redeclaration is allowed within the same scope


//QUESTION TWO- Naming Conventions
//answers: a)let 1stPlace = "John";
         //b) The variable name is incorrect because a variable ame cannot start with #
         //c) Rewriting the variable name: i) let myVariableName= "JavaScript";
                                          //ii)let _myVariableName= "JavaScript"
                                          / 

//QUESTION THREE- Identifying Data Types
//Ouput 1: string
//Output 2: number
//Output 3: boolean
//Output 4: undefined

//Data types in the array:
//Kenya- String
//34-  number
//false- boolean
//{Country:"USA"}-Object
//null- object for null

//BigInt- defind by appending n tp the end of an integer literal or by using the BigInt() constructor
//Example: let bigNumber= 123444566778809875422n;
        

//QUESTION FOUR- Objects and Arrays
let person={
    name:"Josephine",
    age: 20,
    city: "Nairobi"
};
//adding property email to person
person.email="myemail@gmail.com"
//array fruits declaration
let fruits=["Apple","Orange","Mango"];
//accessing the second item in fruits array
console.log(fruits[1]);

//QUESTION FIVE- Type Coercion
//Output of: console.log("5" + 2);= "52"
//Output of: console.log("5" - 2);= 3

//converting string 100 to a number:
let num = parseInt("100"); 
console.log(num);
//converting number 50 to a string:
let num = 50;
let str = num.toString();
console.log(str); 
//Result of: console.log(5 + true);=6



 