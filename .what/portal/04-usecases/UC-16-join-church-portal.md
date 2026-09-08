---
type: uc
id: UC-16
component: portal
satisfies:
  - FR-13
critical: false
created: '2026-09-08'
---

# UC-16 — I want to join my church's mobile portal by scanning a QR code or entering a 6-digit code.

## Trigger
First-time visitor or church attendee arrives at church and sees the welcome poster in the lobby or service screen.

## Precondition
Visitor has downloaded the Jemaat mobile app or opens the web onboarding portal.

## Main Flow
1. Visitor opens Onboarding screen and taps "Find My Church".
2. System displays options: "Scan Church QR Code" or "Enter 6-Digit Code".
3. Visitor scans physical QR code on lobby banner with camera.
4. System parses deep link (`jemaat://church?code=XXXXXX`) and extracts 6-digit church code.
5. System queries backend `/api/v1/church/lookup` and validates church code.
6. System displays Church Confirmation card showing Church Name, Logo, Address, and Service Times.
7. Visitor taps "Join Church" and enters mobile phone number for quick OTP verification.
8. System verifies OTP, connects visitor to church portal, and unlocks public bulletins and guest intake.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 3 | Camera permission denied or physical code illegible | Visitor enters 6-digit alphanumeric code manually; system executes lookup identical to step 5 |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 5 | Invalid or unrecognized church code | Returns HTTP 404 with friendly message | Error prompt: "Church code not found. Please double-check the 6-digit code on the lobby banner or ask an usher." |
| 7 | OTP verification expired or incorrect | Re-prompts for 6-digit OTP with 60-second resend cooldown | "Incorrect code. Please check your SMS or request a new code in 45s." |

## Outcome
Visitor is successfully connected to the correct church portal and ready to participate in church life.

## Business Rules
- `AD-6`: Unified 6-digit church code and QR deep-linking.
- `rules-portal.md`: `BR-POR-2` (Church code verification and onboarding).
