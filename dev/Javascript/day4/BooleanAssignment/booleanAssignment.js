import bcrypt from 'bcrypt';

//verify password
function verifyPassword(inputPassword, storedHashedPassword) {
    if (bcrypt.compareSync(inputPassword, storedHashedPassword) === true) {
        return true;
    }
    else {
        return false;
    }
}

//Multi-factor authentication
function verifyMFA(inputMfaCode, correctMfaCode) {
    if (inputMfaCode === correctMfaCode) {
        return true;
    }
    else {
        return false;
    }
}

//Checking balance
function checkBalance(balance, withdrawalAmount) {
    if (balance >= withdrawalAmount) {
        return true;
    }
    else {
        return false;
    }
}
//checking daily limit
function checkDailyLimit(withdrawalAmount, dailyLimit) {
    if (withdrawalAmount <= dailyLimit) {
        return true;
    }
    else {
        return false;
    }
}
//process withdrawal
function processWithdrawal(user, inputPassword, inputMfaCode, withdrawalAmount) {

    if (!verifyPassword(inputPassword, user.storedHashedPassword)) {
        return "Transaction Failed: Incorrect password.";
    } 
    if (!verifyMFA(inputMfaCode, user.correctMfaCode)) {
        return "Transaction Failed: MFA failed.";
    }
    
    if (!checkBalance(user.balance, withdrawalAmount)) {
        return "Transaction Failed: Insufficient balance.";
    }
    
    if (!checkDailyLimit(withdrawalAmount, user.dailyLimit)) {
        return "Transaction Failed: Amount exceeds daily limit.";
    }
     
    user.balance -= withdrawalAmount;
    return "Transaction Successful! New Balance:"+user.balance;
}
//usage:
const password = "securepassword123";
const hashedPassword = bcrypt.hashSync(password, 10);
 
const user = {
    storedHashedPassword: hashedPassword,
    correctMfaCode: "123456",
    balance: 1000,
    dailyLimit: 500
};

console.log(processWithdrawal(user, "securepassword123", "123456", 200));
console.log(processWithdrawal(user, "wrongpassword", "123456", 200));
console.log(processWithdrawal(user, "securepassword123", "654321", 200));
console.log(processWithdrawal(user, "securepassword123", "123456", 1200));
console.log(processWithdrawal(user, "securepassword123", "123456", 600));
