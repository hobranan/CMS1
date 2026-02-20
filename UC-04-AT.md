# Acceptance Tests UC-04: Change Account Password

## AT-UC04-01 Successful Password Change
- Given authenticated user and correct current password
- When compliant new password and matching confirmation are submitted
- Then password updates successfully and success message is shown

## AT-UC04-02 Missing Current Password
- Given current password is missing
- When request is submitted
- Then request is rejected with required-field feedback

## AT-UC04-03 Missing New Password
- Given new password is missing
- When request is submitted
- Then request is rejected with required-field feedback

## AT-UC04-04 Incorrect Current Password
- Given current password does not match stored credential
- When request is submitted
- Then request is rejected and password remains unchanged

## AT-UC04-05 New Password Policy Failure
- Given new password violates policy
- When request is submitted
- Then request is rejected with policy guidance

## AT-UC04-06 Confirmation Mismatch
- Given confirmation does not match new password
- When request is submitted
- Then request is rejected with mismatch guidance

## AT-UC04-07 Old Password Invalid After Change
- Given successful password change
- When user tries old password and then new password
- Then old password fails and new password succeeds

## AT-UC04-08 Credential Store Failure
- Given credential store write fails
- When password-change request is submitted
- Then system returns retry-later error and password remains unchanged

## AT-UC04-09 No Partial Update on Failure
- Given a failing password-change request
- When subsequent login is attempted
- Then unchanged credential behavior confirms no partial update

