# Acceptance Tests UC-01: Register New User Account

## AT-UC01-01 Successful Register-Verify-Login
- Given unique valid email and compliant password
- When user registers and verifies within 24 hours
- Then account activates and login succeeds

## AT-UC01-02 Invalid Email
- Given invalid email format
- When registration is submitted
- Then submission is rejected with field-level email guidance

## AT-UC01-03 Duplicate Email
- Given email already exists (active or pending)
- When registration is submitted
- Then duplicate registration is rejected

## AT-UC01-04 Password Policy Failure
- Given password violates policy
- When registration is submitted
- Then submission is rejected with password-rule feedback

## AT-UC01-05 Missing Required Fields
- Given one or more required fields are missing
- When registration is submitted
- Then submission is rejected with required-field feedback

## AT-UC01-06 Mixed Validation Failures
- Given required/format/policy failures in one submit
- When registration is submitted
- Then all errors are returned in stable deterministic order

## AT-UC01-07 Login Before Verification
- Given pending unverified registration
- When user attempts login
- Then login is denied with verification reminder and resend option when eligible

## AT-UC01-08 Verification Link Expired
- Given verification link age is `>=24h` server UTC
- When verify is requested
- Then verification is rejected and resend guidance is returned

## AT-UC01-09 Pending Registration Expired
- Given pending registration age is `>=7d` server UTC
- When login or resend is requested
- Then request is denied and user is directed to start new registration

## AT-UC01-10 Concurrent Same-Email Registration
- Given concurrent requests for same email
- When both are processed
- Then uniqueness is atomic: one succeeds and one fails deterministically

## AT-UC01-11 Resend Rate Limits
- Given repeated resend attempts
- When attempts exceed policy
- Then system enforces 3/24h rolling limit and 60s cooldown

## AT-UC01-12 Token Security and Privacy
- Given verification token workflows
- When registration/verification logging occurs
- Then tokens are single-use and hashed, and logs redact/mask sensitive values

## AT-UC01-13 Accessibility of Validation and Reminder UX
- Given keyboard-only and screen-reader interaction
- When user navigates errors/reminders
- Then error text is associated to fields and announced via `aria-live`

