let myName=""//empty string
//can use single quotes, template literals, double quotes
//string properties
//1.length
let name='Jossy'
console.log(name.length)
//charAt
let myNamE1="Josephine"
console.log(myNamE1.charAt(4))
//2.concat
let firstName="Kathini"
let secondName="Kyalo"
console.log(firstName.concat(secondName))
console.log(firstName.concat(' '+secondName))//Es5
console.log(firstName.concat('${secondName}'))//Es6

//4. IndexOf
const namee="Ann Bob"
console.log(namee.indexOf("n"))
//5. includes
console.log(namee.includes("Bob"))
//6. toLowerCase
console.log("ELEPHANT".toLowerCase())
//7. split
console.log("money".split())
console.log("money".split(" "))
//8.substring
let myString="I am a student"
console.log(myString.substring(7,11))//stud
//9. substr
console.log(myString.substr(7,4))//from index 7 return 4 characters
//10.trim
let sentence="  Hi I am available   "
console.log(sentence.trim())

