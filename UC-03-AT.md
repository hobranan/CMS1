# Acceptance Tests UC-03: Authenticate Registered Users

## AT-UC03-01 Successful Login
- Given valid registered credentials
- When user logs in
- Then authentication succeeds and dashboard redirect occurs

## AT-UC03-02 Missing Username
- Given username/email field is empty
- When login is submitted
- Then request is rejected with required-field feedback

## AT-UC03-03 Missing Password
- Given password field is empty
- When login is submitted
- Then request is rejected with required-field feedback

## AT-UC03-04 Unknown Username
- Given username/email does not exist
- When login is submitted
- Then request is rejected with generic invalid-credentials message

## AT-UC03-05 Wrong Password
- Given username exists and password is incorrect
- When login is submitted
- Then request is rejected with generic invalid-credentials message

## AT-UC03-06 Credential Store Unavailable
- Given credential store cannot be accessed
- When login is submitted
- Then request is rejected with retry-later system message

## AT-UC03-07 Session Continuity
- Given login succeeded
- When user refreshes protected/dashboard page
- Then protected page remains accessible for active session

