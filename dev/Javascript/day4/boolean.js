//logical application
function showPaymentsModule(args){
    if(args==true){
        //show payment details
        console.log("You have the access rights to payments page");
    }
    else{
        //show pageNotAuthorized
        console.log("You don't have the access rights to payments page");
    }
}
showPaymentsModule(isAdmin)
showPaymentsModule(isStudent)


//checking inequality
//use != or !==
//real world example of != using passwords
import bcrypt from 'bcrypt'
const password='QertFg345'
const hashedPassword=bcrypt.hashedSync(password, 10)
console.log(hashedPassword)
//comparing the passwords
const comparedPasswords=bcrypt.compareSync(password, hashedPassword)
function authLogin(){
    if (comparedPasswords)){
        //show payment details
        console.log("Login successful");
    }
    else{
        //show pageNotAuthorized
        console.log("Login failed");
    }
}
authLogin()
