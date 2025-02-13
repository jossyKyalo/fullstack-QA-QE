const name='Jossy'
const number=44
const countryInfo={name: 'Kenya', county:'Nyeri'}
const info=[name,number,countryInfo]
console.log(info)

//accessing array indices
const mark=[13,5,20,9,10]
//indices from the end: -5 -4 -3 -2 -1

//access modifiers in array
console.log(mark[0])
//reassigning const value
mark[1]=30

//modifications in array
//arrayName[index]= newValue
const marks=[23,44,10,89,0]
//changing mark at index 2
marks[2]=53
console.log(marks[2])

//adding elements to array===.push
let dennisInfo=[]
dennisInfo.push(23)
dennisInfo.push({idNo:000000,country:'Kenya'})
console.log(dennisInfo)

//.pop-deletion
console.log(dennisInfo.pop())//the object
//.shift-removes the 1st element
console.log(dennisInfo.shift())//23

//indexOf()
const cowInfo=['Fresian','Brown',150]
console.log(cowInfo.indexOf(1))

//joining arrays
//concat
const markBlaise= ['Mark', 23456]
const stanleyKyalo=['Stan',567890]
console.log(markBlaise.concat(stanleyKyalo))

//joining array elements into one string
//join()
const months=['Jan', 'Feb', 'March', 'April']
console.log(months.join())

//adding unspaced '' on the join
console.log(months.join(''))
//.reverse()- used to reverse array elements
console.log(['c','o', 'w'].reverse())//['w','o','c']
//this trick to find a palindrome
console.log('dad'==='dad'.split('').reverse().join(''))


//splice method
//slice
//includes

