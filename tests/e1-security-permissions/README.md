## Epic: Security and Permissions

### User Story 2: User Authentication
As a user  
I want to log in and log out securely  
So I can access features according to my permissions

---

## Acceptance Criteria

- **AC1:** Successful login  
  Given I am on the login screen  
  When I enter valid credentials and click "Sign in"  
  Then I access the system and see the main screen

- **AC2:** Failed login  
  Given I am on the login screen  
  When I enter invalid credentials and click "Sign in"  
  Then I see the message "Invalid email or password" and do not access the system

- **AC3:** Password recovery  
  Given I forgot my password  
  When I click "Forgot password?" and request a reset  
  Then I see the message "If the email address exists in our system, you will receive a password reset email shortly."

- **AC4:** Successful logout  
  Given I am authenticated  
  When I click "Sign out"  
  Then I return to the login screen

---

## Test Checklist

- [ ] The user can access the login screen
- [ ] The user can enter valid credentials and access the system
- [ ] The user sees the main open orders screen after authentication
- [ ] The user receives an error message with invalid credentials
- [ ] The user can request password recovery
- [ ] The user receives a confirmation message after requesting password recovery
- [ ] The user can log out and return to the login screen

---

## Test Cases

### TC2.1: Successful login with valid credentials (AC1)
**Script:** `login-success.spec.ts`  
_Precondition:_ The user has an active account and knows their credentials.  
**Steps and expected results:**
1. Navigate to the login screen.
   - The login form is displayed.
2. Enter a valid email (`yannia@businessone.cw`).
   - The email field contains the entered value.
3. Enter the correct password (`P@ssw0rd`).
   - The password field contains the entered value.
4. Click "Sign in".
   - The system grants access and redirects to the open orders main screen (`https://in-order.test.nebulaplatform.app/order/open`).
5. View the open orders table.
   - The "Open orders" heading and a table with open orders are displayed.

---

### TC2.2: Failed login with invalid credentials (AC2)
**Script:** `login-failure.spec.ts`  
_Precondition:_ The user has an active account.  
**Steps and expected results:**
1. Navigate to the login screen.
   - The login form is displayed.
2. Enter a valid email (`yannia@businessone.cw`).
   - The email field contains the entered value.
3. Enter an incorrect password (`qwerrrr`).
   - The password field contains the entered value.
4. Click "Sign in".
   - The system shows the exact message "Invalid email or password" and does not grant access.

---

### TC2.3: Password recovery (AC3)
**Script:** `password-recovery.spec.ts`  
_Precondition:_ The user knows their registered email.  
**Steps and expected results:**
1. Navigate to the login screen.
   - The login form is displayed.
2. Click "Forgot password?".
   - The password recovery form is displayed.
3. Enter an incorrectly formatted email (`correo-invalido`).
   - The system shows an error message indicating the email must be valid.
4. Enter a registered and valid email (`yannia@business.sr`).
   - The email field contains the entered value.
5. Click "Request".
   - The system shows the exact message "If the email address exists in our system, you will receive a password reset email shortly."
6. Click "Back to sign in".
   - The user returns to the login screen.

---

### TC2.4: Successful logout (AC4)
**Script:** `logout.spec.ts`  
_Precondition:_ The user is authenticated and on the main screen.  
**Steps and expected results:**
1. Click the button with the company name ("YM Business One B.V.").
   - The user menu is displayed.
2. Select "Sign out".
   - The system logs the user out and redirects to the login screen (the "Sign in" button is visible).