## 1.Password Authentication
# Why is it important to store passwords in a hashed format? What security
# advantage does this provide over plain text passwords?
Storing passwords in a hashed format prevents attackers from retrieving plaintext passwords in case of a breach.

- Security Benefits:
Protects against database leaks.
Reduces password reuse attack risks.
Salting prevents rainbow table attacks.

## 2. Multi-Factor Authentication (MFA)
# How does implementing MFA enhance the security of the transaction process?
# What types of attacks does it help prevent?
FA adds an extra verification step (e.g., OTP, biometrics) beyond passwords.

- Prevents:
Credential stuffing (password reuse attacks).
Phishing (stolen passwords remain useless).
MITM attacks (requires secondary factor).

## 3. Balance Verification
# Why is it necessary to check the account balance before allowing a withdrawal?
# What risks are involved if this step is skipped?
Ensures users have sufficient funds before withdrawals.
- Risks if skipped:
Overdrafts & financial losses.
System instability (negative balances).
Fraud (unauthorized excess withdrawals).

## 4. Daily Transaction Limit:
# What purpose does the daily transaction limit serve? How does it help in
# preventing fraudulent or excessive withdrawals?
Restricts excessive withdrawals to prevent financial loss and fraud.
- Benefits:
Limits damage if an account is hacked.
Detects suspicious activity through repeated attempts.
Encourages responsible spending.

## 5.Improvement:
# If you were to add extra features, such as fraud detection (e.g., detecting abnormal withdrawal patterns), how would you go about doing this? 
# What additional data would you track to detect fraud?
Uses ML models and rule-based anomaly detection.
- Track:
Transaction history & location.
Unusual times & new devices.
Rapid successive withdrawals.
- Implementation:
AI/ML risk scoring.
Real-time alerts & extra verification.