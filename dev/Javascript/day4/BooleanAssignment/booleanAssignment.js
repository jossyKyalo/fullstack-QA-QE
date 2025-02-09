const bcrypt = require('bcrypt');

//verify password
function verifyPassword(inputPassword, storedHashedPassword){
    if (bcrypt.compare(inputPassword, storedHashedPassword)) == true{
        return true;
    }
    else{
        return false;
    }
}

//Multi-factor authentication
function verifyMFA(inputMfaCode, correctMfaCode){
    if (inputMfaCode == correctMfaCode){
        return true;
    }
    else{
        return false;
    }
}

//Checking balance
function chackBalance(balance, withdrawalAmount){
    if (balance >= withdrawalAmount){
        return true;
    }
    else{
        return false;
    }
}
//checking daily limit
function checkDailyLimit(withdrawalAmount, dailyLimit){
    if (withdrawalAmount <= dailyLimit){
        return true;
    }
    else{
        return false;
    }
}
//process withdrawal
function processWithdrawal(user, inputPassword, inputMfaCode, withdrawalAmount){

    if (verifyPassword(inputPassword, user.storedHashedPassword)) == false{
        return "Transaction Failed: Incorrect password.";
    }
    if (verifyMFA(inputMfaCode, user.correctMfaCode)) == false{
        return "Transaction Failed: MFA failed.";
    }
    if (checkBalance(user.balance, withdrawalAmount))== false{
        return "Transaction Failed: Insufficient balance.";
    }
    if (checkDailyLimit(withdrawalAmount, user.dailyLimit)) == false{
        return "Transaction Failed: Amount exceeds daily limit.";
    }
    user.balance -= withdrawalAmount;
    return "Transaction Successful! New Balance: " + user.balance;
}
//usage:
const password = "securepassword123";
const hashedPassword = bcrypt.hashSync(password, 10);  
const correctMfaCode = "123456";
const userBalance = 1000;  
const dailyLimit = 500;  t

console.log(processWithdrawal("securepassword123", hashedPassword, "123456", correctMfaCode, 200, userBalance, dailyLimit));  
console.log(processWithdrawal("wrongpassword", hashedPassword, "123456", correctMfaCode, 200, userBalance, dailyLimit));  
console.log(processWithdrawal("securepassword123", hashedPassword, "654321", correctMfaCode, 200, userBalance, dailyLimit)); 
console.log(processWithdrawal("securepassword123", hashedPassword, "123456", correctMfaCode, 1200, userBalance, dailyLimit)); 
console.log(processWithdrawal("securepassword123", hashedPassword, "123456", correctMfaCode, 600, userBalance, dailyLimit)); 

