# Acceptance Tests UC-21: Registration Ticket

## AT-UC21-01 Issue Ticket After Confirmed Payment
- Given payment is confirmed and recorded
- When ticket issuance runs
- Then attendee receives ticket with reference and QR, stored as PDF

## AT-UC21-02 Confirmation Metadata View
- Given ticket is issued
- When attendee opens account ticket metadata
- Then ticket metadata includes reference, issue timestamp, and PDF format

## AT-UC21-03 Ticket PDF Retrieval
- Given ticket is issued
- When attendee opens account ticket PDF endpoint
- Then system returns `application/pdf` ticket content

## AT-UC21-04 Pending Payment Block
- Given payment is pending or unresolved
- When attendee requests ticket issuance
- Then system returns pending block and does not issue ticket

## AT-UC21-05 Delivery Failure Fallback
- Given delivery notification fails after issuance
- When attendee checks account ticket
- Then ticket is still retrievable from CMS

## AT-UC21-06 Generation Failure
- Given ticket generation fails
- When issuance runs
- Then system returns generation error and no ticket is available

## AT-UC21-07 Storage Failure
- Given ticket storage fails
- When issuance runs
- Then system returns storage warning/error and retrieval may be unavailable

## AT-UC21-08 Retrieval Durability
- Given ticket is issued
- When attendee returns later or on a new session/device
- Then same stored ticket remains retrievable

