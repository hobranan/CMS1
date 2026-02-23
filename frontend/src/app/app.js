const USERS = {
  author: { id: "author-1", email: "author@example.com", role: "author" },
  editor: { id: "editor-1", email: "editor@example.com", role: "editor" },
  referee: { id: "ref-1", email: "referee@example.com", role: "referee" },
  admin: { id: "admin-1", email: "admin@example.com", role: "admin" }
};

const UC_ITEMS = [
  {
    id: "UC-01",
    title: "Registration",
    goal: "Author registers and receives pending verification response.",
    alt: "",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "author@example.com", password: "Password123!", confirmPassword: "Password123!" }
    }
  },
  {
    id: "UC-02",
    title: "Validation Rules",
    goal: "Validation behavior and error feedback are visible.",
    alt: "Acceptance scenarios cover required, format, business-rule, mixed-error, and persistence outcomes.",
    actor: "author",
    endpoint: { method: "POST", path: "/api/v1/forms/submit" }
  },
  {
    id: "UC-03",
    title: "Login",
    goal: "User logs in and gets session response.",
    alt: "Alt path: wrong credentials return generic invalid response.",
    actor: "author",
    endpoint: { method: "POST", path: "/api/v1/auth/login", body: { email: "author@example.com", password: "Password123!" } }
  },
  {
    id: "UC-04",
    title: "Password Change",
    goal: "Authenticated user updates account password.",
    alt: "Alt path: policy failures reject the update.",
    actor: "author",
    endpoint: {
      method: "PUT",
      path: "/api/v1/account/password",
      body: { currentPassword: "Password123!", newPassword: "NewPassword123!", confirmNewPassword: "NewPassword123!" }
    }
  },
  {
    id: "UC-05",
    title: "Manuscript Submission",
    goal: "Author submits manuscript metadata and file.",
    alt: "Alt path: metadata/file validation blocks submission.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/submissions",
      body: {
        author_names: "A. Author",
        author_affiliations: "Example University",
        author_contact_email: "author@example.com",
        author_contact_phone: "+1 (555) 123-4567",
        abstract_text: "Sample abstract",
        keywords: "cms, review",
        main_reference_source: "Seeded references",
        file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" }
      }
    }
  },
  {
    id: "UC-06",
    title: "Upload Manuscript",
    goal: "Attach manuscript file to submission.",
    alt: "Alt path: interrupted/invalid upload returns retriable errors.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/submissions/:submissionId/manuscript",
      params: { submissionId: "sub-1" },
      body: { mode: "RESTART", file_fingerprint: "fp-1", file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" } }
    }
  },
  {
    id: "UC-07",
    title: "Save Draft",
    goal: "Save editable draft state.",
    alt: "Alt path: invalid draft fields return validation failed.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/drafts/:draftId/save",
      params: { draftId: "draft-1" },
      body: { editable_state: { title: "Draft title", abstract: "Draft abstract", contact_email: "author@example.com" } }
    }
  },
  {
    id: "UC-08",
    title: "Referee Assignment",
    goal: "Editor assigns referees to paper.",
    alt: "Alt path: invalid selections/invitation failures reject assignment.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/papers/:paperId/assignments",
      params: { paperId: "paper-1" },
      body: { referee_ids: ["ref-1"], expected_version: 1 }
    }
  },
  {
    id: "UC-09",
    title: "Workload Limits",
    goal: "Editor assigns referee under workload policy.",
    alt: "Alt path: limit reached returns workload error.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/papers/:paperId/assign-referee",
      params: { paperId: "paper-1" },
      body: { referee_id: "ref-1", role: "reviewer", track_id: "AI", selection_snapshot: { at: new Date().toISOString() } }
    }
  },
  {
    id: "UC-10",
    title: "Invitation Response",
    goal: "Referee responds to invitation.",
    alt: "Alt path: expired/invalid invitation response is rejected.",
    actor: "referee",
    endpoint: {
      method: "POST",
      path: "/api/v1/invitations/:invitationId/response",
      params: { invitationId: "inv-1" },
      body: { decision: "ACCEPT", expected_status: "pending" }
    }
  },
  {
    id: "UC-11",
    title: "Assigned Paper Access",
    goal: "Referee views assigned papers.",
    alt: "Alt path: identity mismatch returns auth error.",
    actor: "referee",
    endpoint: { method: "GET", path: "/api/v1/referees/:refereeId/assigned-papers", params: { refereeId: "ref-1" } }
  },
  {
    id: "UC-12",
    title: "Submit Review",
    goal: "Referee submits review form.",
    alt: "Alt path: missing required fields rejected.",
    actor: "referee",
    endpoint: {
      method: "POST",
      path: "/api/v1/assignments/:assignmentId/reviews/submit",
      params: { assignmentId: "assign-1" },
      body: { confirm_submit: true, recommendation: "accept", comments: "Looks solid.", fields: { originality: 4, significance: 4 } }
    }
  },
  {
    id: "UC-13",
    title: "Anonymized Review View",
    goal: "Editor lists completed anonymized reviews.",
    alt: "Alt path: no completed reviews or access denied.",
    actor: "editor",
    endpoint: { method: "GET", path: "/api/v1/papers/:paperId/completed-reviews", params: { paperId: "paper-1" } }
  },
  {
    id: "UC-14",
    title: "Paper Decision",
    goal: "Editor posts final accept/reject decision.",
    alt: "Alt path: ineligible/closed state blocks decision.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/papers/:paperId/decision",
      params: { paperId: "paper-1" },
      body: { outcome: "accept", comment: "Decision recorded.", confirm: true, allowNoReviewsOverride: false }
    }
  },
  {
    id: "UC-15",
    title: "Decision Notification",
    goal: "Author retrieves decision notification.",
    alt: "Alt path: under-review or unauthorized cases.",
    actor: "author",
    endpoint: { method: "GET", path: "/api/v1/author/papers/:paperId/decision-notification", params: { paperId: "paper-1" } }
  },
  {
    id: "UC-16",
    title: "Generate Schedule",
    goal: "Editor generates schedule draft.",
    alt: "Alt path: missing prerequisites block generation.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/conferences/:conferenceId/schedule/generate",
      params: { conferenceId: "conf-1" },
      body: { seed: 42 }
    }
  },
  {
    id: "UC-17",
    title: "Edit Schedule",
    goal: "Editor saves schedule edits.",
    alt: "Alt path: version conflict/policy lock blocks save.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/conferences/:conferenceId/schedule/save",
      params: { conferenceId: "conf-1" },
      body: { expectedVersion: 1, edits: { placements: [{ paperId: "paper-1", room: "Room B", slot: "09:30" }], conflicts: [] } }
    }
  },
  {
    id: "UC-18",
    title: "Public Schedule PDF",
    goal: "Public user retrieves schedule PDF.",
    alt: "Alt path: not published returns unavailable.",
    actor: "author",
    endpoint: {
      method: "GET",
      path: "/api/v1/public/conferences/:conferenceId/schedule.pdf",
      params: { conferenceId: "conf-1" },
      query: { disposition: "inline" }
    }
  },
  {
    id: "UC-19",
    title: "Registration Prices",
    goal: "Public pricing retrieval.",
    alt: "Alt path: unpublished pricing unavailable.",
    actor: "author",
    endpoint: { method: "GET", path: "/api/v1/public/registration-prices" }
  },
  {
    id: "UC-20",
    title: "Online Payment",
    goal: "Initiate payment for registration.",
    alt: "Alt path: duplicate/unavailable registration blocked.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/registrations/:registrationId/payment/initiate",
      params: { registrationId: "reg-1" },
      body: { categoryId: "regular" }
    }
  },
  {
    id: "UC-21",
    title: "Registration Ticket",
    goal: "Issue ticket for paid registration.",
    alt: "Alt path: unpaid registration cannot issue ticket.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/registrations/:registrationId/ticket/issue",
      params: { registrationId: "reg-2" },
      body: { deliveryMode: "download" }
    }
  },
  {
    id: "UC-22",
    title: "Public Announcements",
    goal: "Retrieve public announcements list.",
    alt: "Alt path: no data/retrieval failure states.",
    actor: "author",
    endpoint: { method: "GET", path: "/api/v1/public/announcements" }
  }
];

const UC_SCENARIOS = {
  "UC-01": [
    {
      id: "AT-UC01-01",
      kind: "success",
      title: "Successful Register-Verify-Login",
      example: {
        email: "new-user@example.com",
        password: "Password123!",
        confirmPassword: "Password123!"
      }
    },
    {
      id: "AT-UC01-02",
      kind: "fail",
      title: "Invalid Email",
      example: { email: "not-an-email", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-03",
      kind: "fail",
      title: "Duplicate Email",
      example: { email: "dup@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-04",
      kind: "fail",
      title: "Password Policy Failure",
      example: { email: "weak@example.com", password: "short", confirmPassword: "short" }
    },
    {
      id: "AT-UC01-05",
      kind: "fail",
      title: "Missing Required Fields",
      example: { email: "", password: "", confirmPassword: "" }
    },
    {
      id: "AT-UC01-06",
      kind: "fail",
      title: "Mixed Validation Failures",
      example: { email: "bad", password: "short", confirmPassword: "wrong" }
    },
    {
      id: "AT-UC01-07",
      kind: "fail",
      title: "Login Before Verification",
      example: { email: "pending-user@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-08",
      kind: "fail",
      title: "Verification Link Expired",
      example: { email: "expiring-user@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-09",
      kind: "fail",
      title: "Pending Registration Expired",
      example: { email: "pending-expire@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-10",
      kind: "fail",
      title: "Concurrent Same-Email Registration",
      example: { email: "concurrent@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-11",
      kind: "fail",
      title: "Resend Rate Limits",
      example: { email: "resend-limit@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-12",
      kind: "fail",
      title: "Token Single-Use Security",
      example: { email: "token-security@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-13",
      kind: "manual",
      title: "Accessibility Validation UX (Manual)",
      example: {
        keyboard: "Tab through fields and submit invalid form",
        screenReader: "Confirm error feedback is announced via aria-live"
      }
    }
  ],
  "UC-02": [
    {
      id: "AT-UC02-01",
      kind: "success",
      title: "Valid Submission Persists",
      example: {
        formId: "profile_form",
        operation: "create",
        recordId: "record-uc02-1",
        data: { firstName: "Alex", lastName: "Doe", email: "alex@example.com", age: 30 }
      }
    },
    {
      id: "AT-UC02-02",
      kind: "fail",
      title: "Required-Field Rejection",
      example: {
        formId: "profile_form",
        operation: "create",
        recordId: "record-uc02-2",
        data: { firstName: "", lastName: "Doe", email: "alex@example.com", age: 30 }
      }
    },
    {
      id: "AT-UC02-03",
      kind: "fail",
      title: "Format Rejection",
      example: {
        formId: "profile_form",
        operation: "create",
        recordId: "record-uc02-3",
        data: { firstName: "Alex", lastName: "Doe", email: "bad", age: 30 }
      }
    },
    {
      id: "AT-UC02-04",
      kind: "fail",
      title: "Business-Rule Rejection",
      example: {
        formId: "profile_form",
        operation: "create",
        recordId: "record-uc02-4",
        data: { firstName: "Alex", lastName: "Doe", email: "alex@example.com", age: 15 }
      }
    },
    {
      id: "AT-UC02-05",
      kind: "fail",
      title: "Mixed-Error Stable Ordering",
      example: {
        formId: "profile_form",
        operation: "create",
        recordId: "record-uc02-5",
        data: { firstName: "", lastName: "", email: "bad", age: 15 }
      }
    },
    {
      id: "AT-UC02-06",
      kind: "fail",
      title: "No Partial Writes on Validation Failure",
      example: {
        initial: { firstName: "Alex", lastName: "Doe", email: "alex@example.com", age: 30 },
        updateAttempt: { firstName: "Alex", lastName: "Doe", email: "broken", age: 30 }
      }
    },
    {
      id: "AT-UC02-07",
      kind: "success",
      title: "Correction and Resubmission",
      example: {
        firstAttempt: { firstName: "Alex", lastName: "Doe", email: "bad", age: 30 },
        corrected: { firstName: "Alex", lastName: "Doe", email: "alex.fixed@example.com", age: 30 }
      }
    },
    {
      id: "AT-UC02-08",
      kind: "fail",
      title: "Post-Validation Persistence Failure Rollback",
      example: {
        initial: { firstName: "Alex", lastName: "Doe", email: "alex@example.com", age: 30 },
        updateAttempt: { firstName: "Alex", lastName: "Doe", email: "alex@example.com", age: 31 }
      }
    },
    {
      id: "AT-UC02-09",
      kind: "success",
      title: "Concurrent Conflict Policy (Last Write Wins)",
      example: {
        initial: { firstName: "Alex", lastName: "Doe", email: "alex@example.com", age: 30 },
        updateA: { firstName: "Taylor", lastName: "Doe", email: "alex@example.com", age: 30 },
        updateB: { firstName: "Jordan", lastName: "Doe", email: "alex@example.com", age: 30 }
      }
    },
    {
      id: "AT-UC02-10",
      kind: "manual",
      title: "Traceability and Rule Ownership (Manual)",
      example: {
        requirements: "UC-02.md",
        acceptance: "UC-02-AT.md",
        implementation: "validation routes/services and form definition ownership"
      }
    }
  ]
};

const UC_AUTOPLAY_SCENARIOS = {
  "UC-03": [
    {
      id: "AT-UC03-01",
      kind: "success",
      title: "Successful Login",
      example: { email: "author@example.com", password: "Password123!" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Login with valid seeded credentials",
            request: {
              method: "POST",
              path: "/api/v1/auth/login",
              actor: "author",
              body: { email: "author@example.com", password: "Password123!" }
            },
            expect: { status: 200, bodyStatus: "AUTHENTICATED" }
          }
        ]
      }
    },
    {
      id: "AT-UC03-02",
      kind: "fail",
      title: "Missing Password",
      example: { email: "author@example.com", password: "" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject missing password",
            request: {
              method: "POST",
              path: "/api/v1/auth/login",
              actor: "author",
              body: { email: "author@example.com", password: "" }
            },
            expect: { status: 400, code: "REQUIRED_FIELDS_MISSING" }
          }
        ]
      }
    }
  ],
  "UC-04": [
    {
      id: "AT-UC04-01",
      kind: "success",
      title: "Successful Password Change",
      example: { current_password: "Password123!", new_password: "NewPassword123!", confirm_new_password: "NewPassword123!" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Change password with valid current/new values",
            request: {
              method: "PUT",
              path: "/api/v1/account/password",
              actor: "author",
              body: { current_password: "Password123!", new_password: "NewPassword123!", confirm_new_password: "NewPassword123!" }
            },
            expect: { status: 200 }
          }
        ]
      }
    },
    {
      id: "AT-UC04-04",
      kind: "fail",
      title: "Incorrect Current Password",
      example: { current_password: "Wrong123!", new_password: "NewPassword123!", confirm_new_password: "NewPassword123!" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject incorrect current password",
            request: {
              method: "PUT",
              path: "/api/v1/account/password",
              actor: "author",
              body: { current_password: "Wrong123!", new_password: "NewPassword123!", confirm_new_password: "NewPassword123!" }
            },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-05": [
    {
      id: "AT-UC05-01",
      kind: "success",
      title: "Successful Paper Submission",
      example: { author_contact_email: "author@example.com", file: { fileName: "paper.pdf", sizeBytes: 102400, contentType: "application/pdf" } },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Submit valid manuscript metadata and file",
            request: {
              method: "POST",
              path: "/api/v1/submissions",
              actor: "author",
              body: {
                author_names: "A. Author",
                author_affiliations: "Example University",
                author_contact_email: "author@example.com",
                author_contact_phone: "+1 (555) 123-4567",
                abstract_text: "Sample abstract",
                keywords: "cms, review",
                main_reference_source: "Seeded references",
                file: { fileName: "paper.pdf", sizeBytes: 102400, contentType: "application/pdf" }
              }
            },
            expect: { status: 201 }
          }
        ]
      }
    },
    {
      id: "AT-UC05-02",
      kind: "fail",
      title: "Missing Required Metadata",
      example: { abstract_text: "" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject missing required metadata",
            request: {
              method: "POST",
              path: "/api/v1/submissions",
              actor: "author",
              body: {
                author_names: "A. Author",
                author_affiliations: "Example University",
                author_contact_email: "author@example.com",
                author_contact_phone: "+1 (555) 123-4567",
                abstract_text: "",
                keywords: "cms, review",
                main_reference_source: "Seeded references",
                file: { fileName: "paper.pdf", sizeBytes: 102400, contentType: "application/pdf" }
              }
            },
            expect: { status: 400 }
          }
        ]
      }
    }
  ],
  "UC-06": [
    {
      id: "AT-UC06-01",
      kind: "success",
      title: "Successful Upload",
      example: { submissionId: "seeded sub-1", mode: "RESTART", fileName: "paper.pdf" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Upload valid manuscript attachment",
            request: {
              method: "POST",
              path: "/api/v1/submissions/:submissionId/manuscript",
              actor: "author",
              params: { submissionId: "$ids.submissionId" },
              body: { mode: "RESTART", file_fingerprint: "fp-1", file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" } }
            },
            expect: { statusIn: [200, 201, 202] }
          }
        ]
      }
    },
    {
      id: "AT-UC06-03",
      kind: "fail",
      title: "Reject Unsupported Extension",
      example: { fileName: "paper.exe", mimeType: "application/x-msdownload" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject unsupported upload extension",
            request: {
              method: "POST",
              path: "/api/v1/submissions/:submissionId/manuscript",
              actor: "author",
              params: { submissionId: "$ids.submissionId" },
              body: { mode: "RESTART", file_fingerprint: "fp-2", file: { fileName: "paper.exe", sizeBytes: 1024, mimeType: "application/x-msdownload" } }
            },
            expect: { status: 400 }
          }
        ]
      }
    }
  ],
  "UC-07": [
    {
      id: "AT-UC07-01",
      kind: "success",
      title: "Save Draft Successfully",
      example: { draftId: "seeded draft-1", editable_state: { title: "Updated Draft", abstract: "Updated abstract" } },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Save valid draft edit",
            request: {
              method: "POST",
              path: "/api/v1/drafts/:draftId/save",
              actor: "author",
              params: { draftId: "$ids.draftId" },
              body: { editable_state: { title: "Updated Draft", abstract: "Updated abstract", contact_email: "author@example.com" } }
            },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC07-03",
      kind: "fail",
      title: "Invalid Data Prevents Save",
      example: { contact_email: "bad-email" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject invalid draft payload",
            request: {
              method: "POST",
              path: "/api/v1/drafts/:draftId/save",
              actor: "author",
              params: { draftId: "$ids.draftId" },
              body: { editable_state: { title: "Updated Draft", abstract: "Updated abstract", contact_email: "bad-email" } }
            },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-08": [
    {
      id: "AT-UC08-01",
      kind: "success",
      title: "Successful Referee Assignment",
      example: { paperId: "seeded paper-1", referee_ids: ["ref-1"], expected_version: 1 },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Assign one eligible referee",
            request: {
              method: "POST",
              path: "/api/v1/papers/:paperId/assignments",
              actor: "editor",
              params: { paperId: "$ids.paperId" },
              body: { referee_ids: ["$ids.refereeId"], expected_version: 1 }
            },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC08-02",
      kind: "fail",
      title: "More Than Three Referees Selected",
      example: { referee_ids: ["r1", "r2", "r3", "r4"] },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject over-selection of referees",
            request: {
              method: "POST",
              path: "/api/v1/papers/:paperId/assignments",
              actor: "editor",
              params: { paperId: "$ids.paperId" },
              body: { referee_ids: ["r1", "r2", "r3", "r4"], expected_version: 1 }
            },
            expect: { status: 400 }
          }
        ]
      }
    }
  ],
  "UC-09": [
    {
      id: "AT-UC09-01",
      kind: "success",
      title: "Assign Referee Within Workload Limit",
      example: { paperId: "seeded paper-1", referee_id: "ref-1" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Assign under current workload limit",
            request: {
              method: "POST",
              path: "/api/v1/papers/:paperId/assign-referee",
              actor: "editor",
              params: { paperId: "$ids.paperId" },
              body: { referee_id: "$ids.refereeId", role: "reviewer", track_id: "AI", selection_snapshot: { at: "2026-02-23T00:00:00.000Z" } }
            },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC09-02",
      kind: "fail",
      title: "Reject Assignment at Maximum Workload",
      example: { repeat_assignments: 4 },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Assignment attempt #1",
            request: { method: "POST", path: "/api/v1/papers/:paperId/assign-referee", actor: "editor", params: { paperId: "$ids.paperId" }, body: { referee_id: "$ids.refereeId", role: "reviewer", track_id: "AI" } },
            expect: { statusIn: [200, 201] }
          },
          {
            label: "Assignment attempt #2",
            request: { method: "POST", path: "/api/v1/papers/:paperId/assign-referee", actor: "editor", params: { paperId: "$ids.paperId" }, body: { referee_id: "$ids.refereeId", role: "reviewer", track_id: "AI" } },
            expect: { statusIn: [200, 201] }
          },
          {
            label: "Assignment attempt #3",
            request: { method: "POST", path: "/api/v1/papers/:paperId/assign-referee", actor: "editor", params: { paperId: "$ids.paperId" }, body: { referee_id: "$ids.refereeId", role: "reviewer", track_id: "AI" } },
            expect: { statusIn: [200, 201] }
          },
          {
            label: "Assignment attempt #4 exceeds limit",
            request: { method: "POST", path: "/api/v1/papers/:paperId/assign-referee", actor: "editor", params: { paperId: "$ids.paperId" }, body: { referee_id: "$ids.refereeId", role: "reviewer", track_id: "AI" } },
            expect: { status: 400, code: "WORKLOAD_LIMIT_REACHED" }
          }
        ]
      }
    }
  ],
  "UC-10": [
    {
      id: "AT-UC10-01",
      kind: "success",
      title: "Accept Invitation Successfully",
      example: { invitationId: "seeded inv-1", decision: "accept" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Accept pending invitation",
            request: { method: "POST", path: "/api/v1/invitations/:invitationId/response", actor: "referee", params: { invitationId: "$ids.invitationId" }, body: { decision: "accept", expected_status: "pending" } },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC10-04",
      kind: "fail",
      title: "Non-Actionable Invitation Blocked",
      example: { invitationId: "seeded inv-1 (already responded)" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "First response succeeds",
            request: { method: "POST", path: "/api/v1/invitations/:invitationId/response", actor: "referee", params: { invitationId: "$ids.invitationId" }, body: { decision: "accept", expected_status: "pending" } },
            expect: { statusIn: [200, 201] }
          },
          {
            label: "Second response is blocked",
            request: { method: "POST", path: "/api/v1/invitations/:invitationId/response", actor: "referee", params: { invitationId: "$ids.invitationId" }, body: { decision: "REJECT", expected_status: "pending" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-11": [
    {
      id: "AT-UC11-01",
      kind: "success",
      title: "View Assigned Papers List",
      example: { refereeId: "seeded ref-1" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Retrieve assigned papers as owning referee",
            request: { method: "GET", path: "/api/v1/referees/:refereeId/assigned-papers", actor: "referee", params: { refereeId: "$ids.refereeId" } },
            expect: { status: 200 }
          }
        ]
      }
    },
    {
      id: "AT-UC11-05",
      kind: "fail",
      title: "Unauthorized Access Blocked",
      example: { refereeId: "other-referee" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Block access to another referee's assignments",
            request: { method: "GET", path: "/api/v1/referees/:refereeId/assigned-papers", actor: "referee", params: { refereeId: "other-referee" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-12": [
    {
      id: "AT-UC12-01",
      kind: "success",
      title: "Submit Completed Review Successfully",
      example: { assignmentId: "seeded assign-1", recommendation: "accept" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Submit completed review form",
            request: { method: "POST", path: "/api/v1/assignments/:assignmentId/reviews/submit", actor: "referee", params: { assignmentId: "$ids.assignmentId" }, body: { confirm_submit: true, recommendation: "accept", comments: "Looks solid.", fields: { originality: 4, significance: 4 } } },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC12-02",
      kind: "fail",
      title: "Validation Failure on Incomplete Review",
      example: { fields: { originality: 4 }, recommendation: "" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject incomplete review submission",
            request: { method: "POST", path: "/api/v1/assignments/:assignmentId/reviews/submit", actor: "referee", params: { assignmentId: "$ids.assignmentId" }, body: { confirm_submit: true, recommendation: "", comments: "", fields: { originality: 4 } } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-13": [
    {
      id: "AT-UC13-01",
      kind: "success",
      title: "View List of Completed Reviews",
      example: { paperId: "seeded paper-1" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "List completed reviews for paper",
            request: { method: "GET", path: "/api/v1/papers/:paperId/completed-reviews", actor: "editor", params: { paperId: "$ids.paperId" } },
            expect: { status: 200 }
          }
        ]
      }
    },
    {
      id: "AT-UC13-04",
      kind: "fail",
      title: "Unauthorized Paper Access Blocked",
      example: { actor: "author", paperId: "seeded paper-1" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject non-editor access to completed reviews endpoint",
            request: { method: "GET", path: "/api/v1/papers/:paperId/completed-reviews", actor: "author", params: { paperId: "$ids.paperId" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-14": [
    {
      id: "AT-UC14-01",
      kind: "success",
      title: "Accept Decision",
      example: { paperId: "seeded paper-1", outcome: "accept" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Post accept decision with confirmation",
            request: { method: "POST", path: "/api/v1/papers/:paperId/decision", actor: "editor", params: { paperId: "$ids.paperId" }, body: { outcome: "accept", comment: "Decision recorded.", confirm: true, allowNoReviewsOverride: false } },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC14-05",
      kind: "fail",
      title: "Ineligible State Block",
      example: { paperId: "missing-paper", outcome: "accept" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject decision for invalid/ineligible paper",
            request: { method: "POST", path: "/api/v1/papers/:paperId/decision", actor: "editor", params: { paperId: "missing-paper" }, body: { outcome: "accept", comment: "Decision recorded.", confirm: true, allowNoReviewsOverride: false } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-15": [
    {
      id: "AT-UC15-01",
      kind: "success",
      title: "View Accepted Decision",
      example: { paperId: "seeded paper-1 (after decision posted)" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Create decision first",
            request: { method: "POST", path: "/api/v1/papers/:paperId/decision", actor: "editor", params: { paperId: "$ids.paperId" }, body: { outcome: "accept", comment: "Decision recorded.", confirm: true, allowNoReviewsOverride: false } },
            expect: { statusIn: [200, 201] }
          },
          {
            label: "Retrieve decision notification as author",
            request: { method: "GET", path: "/api/v1/author/papers/:paperId/decision-notification", actor: "author", params: { paperId: "$ids.paperId" } },
            expect: { status: 200 }
          }
        ]
      }
    },
    {
      id: "AT-UC15-04",
      kind: "fail",
      title: "Decision Not Yet Available",
      example: { paperId: "seeded paper-1 without posted decision" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Decision notification before decision is posted",
            request: { method: "GET", path: "/api/v1/author/papers/:paperId/decision-notification", actor: "author", params: { paperId: "$ids.paperId" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-16": [
    {
      id: "AT-UC16-01",
      kind: "success",
      title: "Manual Draft Generation",
      example: { conferenceId: "seeded conf-1", seed: 42 },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Generate schedule draft",
            request: { method: "POST", path: "/api/v1/conferences/:conferenceId/schedule/generate", actor: "editor", params: { conferenceId: "$ids.conferenceId" }, body: { seed: 42 } },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC16-07",
      kind: "fail",
      title: "Missing Parameters Block",
      example: { conferenceId: "seeded conf-1", body: {} },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject missing generation parameters",
            request: { method: "POST", path: "/api/v1/conferences/:conferenceId/schedule/generate", actor: "editor", params: { conferenceId: "$ids.conferenceId" }, body: {} },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-17": [
    {
      id: "AT-UC17-02",
      kind: "success",
      title: "Save Valid Edit",
      example: { conferenceId: "seeded conf-1", expectedVersion: 1 },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Save valid schedule edit",
            request: {
              method: "POST",
              path: "/api/v1/conferences/:conferenceId/schedule/save",
              actor: "editor",
              params: { conferenceId: "$ids.conferenceId" },
              body: { expectedVersion: 1, edits: { placements: [{ paperId: "$ids.paperId", roomId: "room-b", slotIndex: 1 }], conflicts: [] } }
            },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC17-11",
      kind: "fail",
      title: "Concurrency Conflict",
      example: { expectedVersion: 0 },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject stale expectedVersion edit",
            request: {
              method: "POST",
              path: "/api/v1/conferences/:conferenceId/schedule/save",
              actor: "editor",
              params: { conferenceId: "$ids.conferenceId" },
              body: { expectedVersion: 0, edits: { placements: [{ paperId: "$ids.paperId", roomId: "room-b", slotIndex: 1 }], conflicts: [] } }
            },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-18": [
    {
      id: "AT-UC18-05",
      kind: "success",
      title: "PDF Inline",
      example: { conferenceId: "seeded conf-1", disposition: "inline" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Retrieve published public schedule PDF inline",
            request: { method: "GET", path: "/api/v1/public/conferences/:conferenceId/schedule.pdf", actor: "author", params: { conferenceId: "$ids.conferenceId" }, query: { disposition: "inline" } },
            expect: { status: 200 }
          }
        ]
      }
    },
    {
      id: "AT-UC18-02",
      kind: "fail",
      title: "Unpublished Block",
      example: { conferenceId: "missing-conf" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Block access when schedule is not published",
            request: { method: "GET", path: "/api/v1/public/conferences/:conferenceId/schedule.pdf", actor: "author", params: { conferenceId: "missing-conf" }, query: { disposition: "inline" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-19": [
    {
      id: "AT-UC19-01",
      kind: "success",
      title: "Public Published Access",
      example: { endpoint: "/api/v1/public/registration-prices" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Retrieve published registration prices",
            request: { method: "GET", path: "/api/v1/public/registration-prices", actor: "author" },
            expect: { status: 200 }
          }
        ]
      }
    },
    {
      id: "AT-UC19-05",
      kind: "fail",
      title: "Retrieval Failure",
      example: { conferenceId: "missing-conf" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Non-existent conference price lookup returns error",
            request: { method: "GET", path: "/api/v1/public/conferences/:conferenceId/schedule", actor: "author", params: { conferenceId: "missing-conf" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-20": [
    {
      id: "AT-UC20-01",
      kind: "success",
      title: "Successful Payment Initiation",
      example: { registrationId: "seeded reg-1", categoryId: "regular" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Initiate payment for unpaid registration",
            request: { method: "POST", path: "/api/v1/registrations/:registrationId/payment/initiate", actor: "author", params: { registrationId: "$ids.registrationId" }, body: { categoryId: "regular" } },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC20-04",
      kind: "fail",
      title: "Declined/Duplicate Payment Block",
      example: { registrationId: "seeded reg-2 (already paid)" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Block initiation for already-paid registration",
            request: { method: "POST", path: "/api/v1/registrations/:registrationId/payment/initiate", actor: "author", params: { registrationId: "$ids.paidRegistrationId" }, body: { categoryId: "regular" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-21": [
    {
      id: "AT-UC21-01",
      kind: "success",
      title: "Issue Ticket After Confirmed Payment",
      example: { registrationId: "seeded reg-2", deliveryMode: "download" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Issue ticket for paid registration",
            request: { method: "POST", path: "/api/v1/registrations/:registrationId/ticket/issue", actor: "author", params: { registrationId: "$ids.paidRegistrationId" }, body: { deliveryMode: "download" } },
            expect: { statusIn: [200, 201] }
          }
        ]
      }
    },
    {
      id: "AT-UC21-04",
      kind: "fail",
      title: "Pending Payment Block",
      example: { registrationId: "seeded reg-1 (unpaid)" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Reject ticket issue before payment confirmation",
            request: { method: "POST", path: "/api/v1/registrations/:registrationId/ticket/issue", actor: "author", params: { registrationId: "$ids.registrationId" }, body: { deliveryMode: "download" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ],
  "UC-22": [
    {
      id: "AT-UC22-01",
      kind: "success",
      title: "View Announcements List",
      example: { endpoint: "/api/v1/public/announcements" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Retrieve public announcements list",
            request: { method: "GET", path: "/api/v1/public/announcements", actor: "author" },
            expect: { status: 200 }
          }
        ]
      }
    },
    {
      id: "AT-UC22-05",
      kind: "fail",
      title: "Selected Announcement Unavailable",
      example: { announcementId: "missing-announcement" },
      planned: {
        seedDemo: true,
        steps: [
          {
            label: "Open unavailable announcement detail",
            request: { method: "GET", path: "/api/v1/public/announcements/:announcementId", actor: "author", params: { announcementId: "missing-announcement" } },
            expect: { minStatus: 400 }
          }
        ]
      }
    }
  ]
};

const UC_AT_CATALOG = {
  "UC-03": [
    { id: "AT-UC03-01", title: "Successful Login" },
    { id: "AT-UC03-02", title: "Missing Username" },
    { id: "AT-UC03-03", title: "Missing Password" },
    { id: "AT-UC03-04", title: "Unknown Username" },
    { id: "AT-UC03-05", title: "Wrong Password" },
    { id: "AT-UC03-06", title: "Credential Store Unavailable" },
    { id: "AT-UC03-07", title: "Session Continuity" }
  ],
  "UC-04": [
    { id: "AT-UC04-01", title: "Successful Password Change" },
    { id: "AT-UC04-02", title: "Missing Current Password" },
    { id: "AT-UC04-03", title: "Missing New Password" },
    { id: "AT-UC04-04", title: "Incorrect Current Password" },
    { id: "AT-UC04-05", title: "New Password Policy Failure" },
    { id: "AT-UC04-06", title: "Confirmation Mismatch" },
    { id: "AT-UC04-07", title: "Old Password Invalid After Change" },
    { id: "AT-UC04-08", title: "Credential Store Failure" },
    { id: "AT-UC04-09", title: "No Partial Update on Failure" }
  ],
  "UC-05": [
    { id: "AT-UC05-01", title: "Successful Paper Submission" },
    { id: "AT-UC05-02", title: "Missing Required Metadata (Extension 4a)" },
    { id: "AT-UC05-03", title: "Invalid Metadata Value (Extension 4b)" },
    { id: "AT-UC05-04", title: "No File Uploaded (Extension 5a)" },
    { id: "AT-UC05-05", title: "Unsupported File Format (Extension 5b)" },
    { id: "AT-UC05-06", title: "File Exceeds Size Limit (Extension 5c)" },
    { id: "AT-UC05-07", title: "Multiple Validation Errors (Extension 7a)" },
    { id: "AT-UC05-08", title: "Storage Failure (Extension 8a)" },
    { id: "AT-UC05-09", title: "Persistence Check After Successful Submission" }
  ],
  "UC-06": [
    { id: "AT-UC06-01", title: "Successful Upload" },
    { id: "AT-UC06-02", title: "Cancel File Selection" },
    { id: "AT-UC06-03", title: "Reject Unsupported Extension" },
    { id: "AT-UC06-04", title: "Reject Oversized File" },
    { id: "AT-UC06-05", title: "Network Interruption" },
    { id: "AT-UC06-06", title: "Storage/Service Failure" },
    { id: "AT-UC06-07", title: "Association Failure After Upload" },
    { id: "AT-UC06-08", title: "Attached File Persists Across Refresh" }
  ],
  "UC-07": [
    { id: "AT-UC07-01", title: "Save Draft Successfully (Main Success Scenario)" },
    { id: "AT-UC07-02", title: "Save Without Changes (Extension 2a)" },
    { id: "AT-UC07-03", title: "Invalid Data Prevents Save (Extension 3a)" },
    { id: "AT-UC07-04", title: "Draft Persistence Across Sessions" },
    { id: "AT-UC07-05", title: "Storage Failure During Save (Extension 4a)" },
    { id: "AT-UC07-06", title: "Network Interruption During Save (Extension 4b)" },
    { id: "AT-UC07-07", title: "Continue Editing After Save" },
    { id: "AT-UC07-08", title: "Submit Persists Unsaved Edits Before Final Validation" }
  ],
  "UC-08": [
    { id: "AT-UC08-01", title: "Successful Referee Assignment" },
    { id: "AT-UC08-02", title: "More Than Three Referees Selected (Extension 4a)" },
    { id: "AT-UC08-03", title: "Referee Workload Exceeded (Extension 6a)" },
    { id: "AT-UC08-04", title: "Ineligible Referee Selected (Extension 4b)" },
    { id: "AT-UC08-05", title: "Assignment Storage Failure (Extension 8a)" },
    { id: "AT-UC08-06", title: "Notification Failure After Assignment (Extension 9a)" }
  ],
  "UC-09": [
    { id: "AT-UC09-01", title: "Assign Referee Within Workload Limit (Main Success Scenario)" },
    { id: "AT-UC09-02", title: "Reject Assignment at Maximum Workload (Extension 5a)" },
    { id: "AT-UC09-03", title: "Workload Retrieval Failure (Extension 3a)" },
    { id: "AT-UC09-04", title: "Assignment Storage Failure (Extension 6a)" },
    { id: "AT-UC09-05", title: "Workload Count Updated After Assignment" },
    { id: "AT-UC09-06", title: "Refresh Required on Workload/Limit Drift" }
  ],
  "UC-10": [
    { id: "AT-UC10-01", title: "Accept Invitation Successfully" },
    { id: "AT-UC10-02", title: "Reject Invitation Successfully" },
    { id: "AT-UC10-03", title: "No Pending Invitations" },
    { id: "AT-UC10-04", title: "Non-Actionable Invitation Blocked" },
    { id: "AT-UC10-05", title: "Expiry Boundary Enforcement" },
    { id: "AT-UC10-06", title: "Cancel Before Confirm" },
    { id: "AT-UC10-07", title: "Database Failure on Response Commit" },
    { id: "AT-UC10-08", title: "Notification Failure After Commit" },
    { id: "AT-UC10-09", title: "Multi-Session Stale Conflict" }
  ],
  "UC-11": [
    { id: "AT-UC11-01", title: "View Assigned Papers List" },
    { id: "AT-UC11-02", title: "Open Manuscript in View-Only Mode" },
    { id: "AT-UC11-03", title: "Open Pre-Generated Review Form" },
    { id: "AT-UC11-04", title: "No Assigned Papers Empty State" },
    { id: "AT-UC11-05", title: "Unauthorized Access Blocked" },
    { id: "AT-UC11-06", title: "Manuscript Unavailable" },
    { id: "AT-UC11-07", title: "Review Form Unavailable" },
    { id: "AT-UC11-08", title: "Assigned List Retrieval Failure" },
    { id: "AT-UC11-09", title: "Refresh Consistency" }
  ],
  "UC-12": [
    { id: "AT-UC12-01", title: "Submit Completed Review Successfully" },
    { id: "AT-UC12-02", title: "Validation Failure on Incomplete Review" },
    { id: "AT-UC12-03", title: "Cancel Before Confirm" },
    { id: "AT-UC12-04", title: "Inactive Assignment Rejection" },
    { id: "AT-UC12-05", title: "Deadline Informational Only" },
    { id: "AT-UC12-06", title: "Database Failure Integrity" },
    { id: "AT-UC12-07", title: "Notification Failure Post-Commit" },
    { id: "AT-UC12-08", title: "Read-Only Submitted Review" },
    { id: "AT-UC12-09", title: "Newer Version Linking" },
    { id: "AT-UC12-10", title: "Editor Visibility" }
  ],
  "UC-13": [
    { id: "AT-UC13-01", title: "View List of Completed Reviews (Main Success Scenario)" },
    { id: "AT-UC13-02", title: "Open a Completed Review (Main Success Scenario)" },
    { id: "AT-UC13-03", title: "No Completed Reviews Available (Extension 5a)" },
    { id: "AT-UC13-04", title: "Unauthorized Paper Access Blocked (Extension 2a)" },
    { id: "AT-UC13-05", title: "Only Completed Reviews Shown When Others Pending (Extension 5b)" },
    { id: "AT-UC13-06", title: "Review Retrieval Failure (Extension 5c)" },
    { id: "AT-UC13-07", title: "Open Review Fails (Extension 8a)" },
    { id: "AT-UC13-08", title: "Persistence Check: Reviews Still Accessible After Refresh" }
  ],
  "UC-14": [
    { id: "AT-UC14-01", title: "Accept Decision" },
    { id: "AT-UC14-02", title: "Reject Decision" },
    { id: "AT-UC14-03", title: "No Completed Reviews Block" },
    { id: "AT-UC14-04", title: "Cancel Before Confirm" },
    { id: "AT-UC14-05", title: "Ineligible State Block" },
    { id: "AT-UC14-06", title: "Save Failure" },
    { id: "AT-UC14-07", title: "Notification Failure" },
    { id: "AT-UC14-08", title: "Conflict on Second Attempt" }
  ],
  "UC-15": [
    { id: "AT-UC15-01", title: "View Accepted Decision" },
    { id: "AT-UC15-02", title: "View Rejected Decision" },
    { id: "AT-UC15-03", title: "Notification Failure Does Not Block CMS Access" },
    { id: "AT-UC15-04", title: "Decision Not Yet Available" },
    { id: "AT-UC15-05", title: "Unauthorized Paper Access Blocked" },
    { id: "AT-UC15-06", title: "Decision Retrieval Failure" },
    { id: "AT-UC15-07", title: "Decision Persistence Across Sessions" },
    { id: "AT-UC15-08", title: "Notification Structure and Source Consistency" }
  ],
  "UC-16": [
    { id: "AT-UC16-01", title: "Manual Draft Generation" },
    { id: "AT-UC16-02", title: "Publish Reviewed Draft" },
    { id: "AT-UC16-03", title: "Grid Invariants" },
    { id: "AT-UC16-04", title: "Randomized Initial Placement" },
    { id: "AT-UC16-05", title: "Cancel Publish" },
    { id: "AT-UC16-06", title: "No Accepted Papers Block" },
    { id: "AT-UC16-07", title: "Missing Parameters Block" },
    { id: "AT-UC16-08", title: "Blocking Conflict Block" },
    { id: "AT-UC16-09", title: "Save Failure Rollback" },
    { id: "AT-UC16-10", title: "Published Persistence" },
    { id: "AT-UC16-11", title: "Unpublished Retrieval" },
    { id: "AT-UC16-12", title: "Performance" }
  ],
  "UC-17": [
    { id: "AT-UC17-01", title: "Load Editable Schedule" },
    { id: "AT-UC17-02", title: "Save Valid Edit" },
    { id: "AT-UC17-03", title: "Persist Across Session" },
    { id: "AT-UC17-04", title: "Published Status Preserved" },
    { id: "AT-UC17-05", title: "Last-Edited Timestamp Update" },
    { id: "AT-UC17-06", title: "Conflict Rejection" },
    { id: "AT-UC17-07", title: "Invalid Reference Rejection" },
    { id: "AT-UC17-08", title: "Policy Lock Block" },
    { id: "AT-UC17-09", title: "DB Save Failure" },
    { id: "AT-UC17-10", title: "Cancel Edit" },
    { id: "AT-UC17-11", title: "Concurrency Conflict" },
    { id: "AT-UC17-12", title: "Failure Payload Shape" },
    { id: "AT-UC17-13", title: "Performance" }
  ],
  "UC-18": [
    { id: "AT-UC18-01", title: "Public Published Access" },
    { id: "AT-UC18-02", title: "Unpublished Block" },
    { id: "AT-UC18-03", title: "Entry Detail" },
    { id: "AT-UC18-04", title: "Entry Not Found" },
    { id: "AT-UC18-05", title: "PDF Inline" },
    { id: "AT-UC18-06", title: "PDF Attachment" },
    { id: "AT-UC18-07", title: "Schedule Retrieval Failure" },
    { id: "AT-UC18-08", title: "PDF Retrieval Failure" },
    { id: "AT-UC18-09", title: "Restricted Field Policy" },
    { id: "AT-UC18-10", title: "Detail Failure Isolation" },
    { id: "AT-UC18-11", title: "Direct Link Stability" },
    { id: "AT-UC18-12", title: "PDF High-Volume Stability" }
  ],
  "UC-19": [
    { id: "AT-UC19-01", title: "Public Published Access" },
    { id: "AT-UC19-02", title: "Guest/Auth Parity" },
    { id: "AT-UC19-03", title: "CAD Formatting" },
    { id: "AT-UC19-04", title: "Unpublished State" },
    { id: "AT-UC19-05", title: "Retrieval Failure" },
    { id: "AT-UC19-06", title: "Incomplete Data Markers" },
    { id: "AT-UC19-07", title: "Consistency Across Refresh" },
    { id: "AT-UC19-08", title: "Failure Then Recovery" },
    { id: "AT-UC19-09", title: "No-Discount Enforcement" },
    { id: "AT-UC19-10", title: "Performance" }
  ],
  "UC-20": [
    { id: "AT-UC20-01", title: "Successful Payment" },
    { id: "AT-UC20-02", title: "Canceled Payment" },
    { id: "AT-UC20-03", title: "Invalid Payment Details" },
    { id: "AT-UC20-04", title: "Declined Payment" },
    { id: "AT-UC20-05", title: "Timeout or Missing Confirmation" },
    { id: "AT-UC20-06", title: "Success with Persistence Failure" },
    { id: "AT-UC20-07", title: "Confirmed Status Persistence" }
  ],
  "UC-21": [
    { id: "AT-UC21-01", title: "Issue Ticket After Confirmed Payment" },
    { id: "AT-UC21-02", title: "Confirmation Metadata View" },
    { id: "AT-UC21-03", title: "Ticket PDF Retrieval" },
    { id: "AT-UC21-04", title: "Pending Payment Block" },
    { id: "AT-UC21-05", title: "Delivery Failure Fallback" },
    { id: "AT-UC21-06", title: "Generation Failure" },
    { id: "AT-UC21-07", title: "Storage Failure" },
    { id: "AT-UC21-08", title: "Retrieval Durability" }
  ],
  "UC-22": [
    { id: "AT-UC22-01", title: "View Announcements List (Main Success Scenario)" },
    { id: "AT-UC22-02", title: "View Announcement Content (Main Success Scenario)" },
    { id: "AT-UC22-03", title: "No Public Announcements (Extension 1a)" },
    { id: "AT-UC22-04", title: "Announcement Retrieval Failure (Extension 2a)" },
    { id: "AT-UC22-05", title: "Selected Announcement Unavailable (Extension 4a)" },
    { id: "AT-UC22-06", title: "Persistence Check: Announcements Remain Visible After Refresh" }
  ]
};

const context = {
  userId: "",
  userEmail: "",
  userRole: "",
  sessionId: ""
};

const listEl = document.getElementById("uc-list");
const filterEl = document.getElementById("uc-filter");
const cards = new Map();

function parseJson(text, fallback = {}) {
  try {
    return text.trim() ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
}

function saveContext() {
  const value = {
    userId: context.userId.trim(),
    userEmail: context.userEmail.trim(),
    userRole: context.userRole.trim(),
    sessionId: context.sessionId.trim()
  };
  localStorage.setItem("cms1-uc-context", JSON.stringify(value));
}

function loadContext() {
  const raw = localStorage.getItem("cms1-uc-context");
  if (!raw) return;
  const saved = parseJson(raw, {});
  context.userId = String(saved.userId ?? "");
  context.userEmail = String(saved.userEmail ?? "");
  context.userRole = String(saved.userRole ?? "");
  context.sessionId = String(saved.sessionId ?? "");
}

function ensureActorContext(actor) {
  const user = USERS[actor];
  if (!user) return;
  context.userId = user.id;
  context.userEmail = user.email;
  context.userRole = user.role;
}

function headersFor(hasBody) {
  const headers = {};
  if (hasBody) headers["content-type"] = "application/json";
  if (context.userId.trim()) headers["x-user-id"] = context.userId.trim();
  if (context.userEmail.trim()) headers["x-user-email"] = context.userEmail.trim();
  if (context.userRole.trim()) headers["x-user-role"] = context.userRole.trim();
  if (context.sessionId.trim()) headers["x-session-id"] = context.sessionId.trim();
  return headers;
}

function fillPath(path, params) {
  let out = path;
  Object.entries(params).forEach(([k, v]) => {
    out = out.replace(`:${k}`, encodeURIComponent(String(v)));
  });
  return out;
}

function setOutput(id, text) {
  const card = cards.get(id);
  if (!card) return;
  card.output.textContent = text;
}

function makeUniqueEmail(prefix = "uc01") {
  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return `${prefix}-${token}@example.com`;
}

async function callApi({ method, path, params = {}, query = {}, body, actor = "author" }) {
  ensureActorContext(actor);
  saveContext();
  const resolvedPath = fillPath(path, params);
  const search = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  });
  const url = search.size > 0 ? `${resolvedPath}?${search.toString()}` : resolvedPath;
  const hasBody = method !== "GET";
  const started = performance.now();
  const response = await fetch(url, {
    method,
    headers: headersFor(hasBody),
    body: hasBody ? JSON.stringify(body ?? {}) : undefined
  });
  const elapsed = Math.round(performance.now() - started);
  const text = await response.text();
  let payload = text;
  try {
    payload = JSON.parse(text);
  } catch {
    // keep text body
  }
  return { method, url, status: response.status, payload, elapsed };
}

function payloadCode(result) {
  return result && typeof result.payload === "object" ? result.payload.code : undefined;
}

function payloadErrors(result) {
  if (!result || typeof result.payload !== "object") return [];
  const errors = result.payload.errors;
  return Array.isArray(errors) ? errors : [];
}

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function includesExpected(actual, expected) {
  return toArray(expected).includes(actual);
}

function formatStep(index, label, result, pass, details = "") {
  const state = pass ? "PASS" : "FAIL";
  const tail = details ? ` | ${details}` : "";
  return `[${index}] ${state} ${label}\n    ${result.method} ${result.url} -> ${result.status} (${result.elapsed}ms)${tail}\n    ${typeof result.payload === "string" ? result.payload : JSON.stringify(result.payload, null, 2)}`;
}

function resolveValue(value, vars) {
  if (typeof value === "string" && value.startsWith("$")) {
    const path = value.slice(1).split(".");
    let current = vars;
    for (const part of path) {
      if (current && typeof current === "object" && part in current) current = current[part];
      else return value;
    }
    return current;
  }
  if (Array.isArray(value)) return value.map((entry) => resolveValue(entry, vars));
  if (value && typeof value === "object") {
    const out = {};
    Object.entries(value).forEach(([k, v]) => {
      out[k] = resolveValue(v, vars);
    });
    return out;
  }
  return value;
}

function valueAtPath(source, path) {
  if (!path) return undefined;
  return String(path)
    .split(".")
    .reduce((acc, part) => (acc && typeof acc === "object" ? acc[part] : undefined), source);
}

function checkExpectation(result, expect = {}) {
  const reasons = [];
  let pass = true;
  if (expect.status !== undefined && result.status !== expect.status) {
    pass = false;
    reasons.push(`status=${result.status}, expected ${expect.status}`);
  }
  if (Array.isArray(expect.statusIn) && !expect.statusIn.includes(result.status)) {
    pass = false;
    reasons.push(`status=${result.status}, expected in [${expect.statusIn.join(", ")}]`);
  }
  if (expect.minStatus !== undefined && result.status < expect.minStatus) {
    pass = false;
    reasons.push(`status=${result.status}, expected >= ${expect.minStatus}`);
  }
  if (expect.maxStatus !== undefined && result.status > expect.maxStatus) {
    pass = false;
    reasons.push(`status=${result.status}, expected <= ${expect.maxStatus}`);
  }
  if (expect.code !== undefined && payloadCode(result) !== expect.code) {
    pass = false;
    reasons.push(`code=${String(payloadCode(result))}, expected ${expect.code}`);
  }
  if (expect.bodyStatus !== undefined) {
    const statusValue = result && typeof result.payload === "object" ? result.payload.status : undefined;
    if (statusValue !== expect.bodyStatus) {
      pass = false;
      reasons.push(`body.status=${String(statusValue)}, expected ${expect.bodyStatus}`);
    }
  }
  if (expect.bodyPath !== undefined) {
    const actual = valueAtPath(result.payload, expect.bodyPath);
    if (expect.equals !== undefined && actual !== expect.equals) {
      pass = false;
      reasons.push(`${expect.bodyPath}=${String(actual)}, expected ${String(expect.equals)}`);
    }
    if (expect.includes !== undefined && typeof actual === "string" && !actual.includes(String(expect.includes))) {
      pass = false;
      reasons.push(`${expect.bodyPath} did not include ${String(expect.includes)}`);
    }
  }
  return { pass, details: reasons.join("; ") };
}

async function runPlannedScenario(scenario) {
  const lines = [];
  let stepIndex = 1;
  const vars = {};

  if (scenario.planned?.seedDemo) {
    const seeded = await callApi({ method: "POST", path: "/api/v1/dev/seed-demo", body: {}, actor: "admin" });
    vars.ids = (seeded.payload && typeof seeded.payload === "object" ? seeded.payload.ids : {}) ?? {};
    vars.users = (seeded.payload && typeof seeded.payload === "object" ? seeded.payload.users : {}) ?? {};
    const seededCheck = checkExpectation(seeded, { status: 200 });
    lines.push(formatStep(stepIndex, "Seed demo data", seeded, seededCheck.pass, seededCheck.details));
    stepIndex += 1;
  }

  for (const plannedStep of scenario.planned?.steps ?? []) {
    const resolvedRequest = resolveValue(plannedStep.request ?? {}, vars);
    const result = await callApi({
      method: resolvedRequest.method ?? "GET",
      path: resolvedRequest.path ?? "/",
      params: resolvedRequest.params ?? {},
      query: resolvedRequest.query ?? {},
      body: resolvedRequest.body,
      actor: resolvedRequest.actor ?? "author"
    });
    const check = checkExpectation(result, plannedStep.expect ?? {});
    lines.push(formatStep(stepIndex, plannedStep.label ?? "Scenario step", result, check.pass, check.details));
    stepIndex += 1;
  }

  if (scenario.planned?.notes) {
    lines.push(String(scenario.planned.notes));
  }

  return lines.join("\n\n");
}

function clonePlan(plan) {
  return plan ? JSON.parse(JSON.stringify(plan)) : null;
}

function normalizeScenarioTitle(title, fallbackId) {
  const clean = String(title ?? "").replace(/^[\s\-–—:]+/, "").trim();
  return clean || fallbackId;
}

function classifyScenarioKind(id, title) {
  const text = `${id} ${title}`.toLowerCase();
  if (/accessibility|traceability|ownership|performance/.test(text)) return "manual";
  if (/success|successful|view|published|persist/.test(text) || id.endsWith("-01")) return "success";
  return "fail";
}

function buildUcScenarioList(ucId) {
  const explicit = [...(UC_SCENARIOS[ucId] ?? []), ...(UC_AUTOPLAY_SCENARIOS[ucId] ?? [])];
  const atEntries = UC_AT_CATALOG[ucId] ?? [];
  if (atEntries.length === 0) return explicit;

  const byId = new Map(explicit.map((scenario) => [scenario.id, scenario]));
  const successTemplate = explicit.find((scenario) => scenario.planned && scenario.kind === "success") ?? explicit.find((scenario) => scenario.planned);
  const failTemplate = explicit.find((scenario) => scenario.planned && scenario.kind !== "success") ?? successTemplate;
  const built = [];

  for (const entry of atEntries) {
    const existing = byId.get(entry.id);
    if (existing) {
      built.push(existing);
      continue;
    }

    const title = normalizeScenarioTitle(entry.title, entry.id);
    const kind = classifyScenarioKind(entry.id, title);
    const template = kind === "success" ? successTemplate : failTemplate;

    if (!template || !template.planned || kind === "manual") {
      built.push({
        id: entry.id,
        title,
        kind: "manual",
        example: { note: "Manual or not yet automated; mapped from AT catalog." }
      });
      continue;
    }

    const planned = clonePlan(template.planned);
    planned.notes = `${planned.notes ? `${planned.notes}\n` : ""}Template playback mapped from ${template.id} for ${entry.id}.`;
    built.push({
      id: entry.id,
      title,
      kind,
      example: { template: template.id, note: "Auto-mapped AT playback template." },
      planned
    });
  }

  const covered = new Set(built.map((scenario) => scenario.id));
  for (const scenario of explicit) {
    if (!covered.has(scenario.id)) built.push(scenario);
  }
  return built;
}

async function runUc01Scenario(scenario) {
  const lines = [];
  let step = 1;
  const email = makeUniqueEmail("uc01");
  const strong = { email, password: "Password123!", confirmPassword: "Password123!" };

  const pushResult = (label, result, pass, details = "") => {
    lines.push(formatStep(step, label, result, pass, details));
    step += 1;
  };

  await callApi({ method: "POST", path: "/api/v1/dev/time/reset", body: {}, actor: "admin" });

  if (scenario.id === "AT-UC01-01") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register valid user", register, register.status === 202, "expected 202");

    const tokenResp = await callApi({
      method: "GET",
      path: "/api/v1/dev/verification-token",
      query: { email: strong.email },
      actor: "admin"
    });
    pushResult("Get verification token (dev helper)", tokenResp, tokenResp.status === 200, "expected 200");

    const verify = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    pushResult("Verify email", verify, verify.status === 200, "expected 200");

    const login = await callApi({
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: strong.email, password: strong.password }
    });
    const loginPass = login.status === 200 && login.payload?.status === "AUTHENTICATED";
    pushResult("Login after verification", login, loginPass, "expected 200 + AUTHENTICATED");
  } else if (scenario.id === "AT-UC01-02") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "not-an-email", password: "Password123!", confirmPassword: "Password123!" }
    });
    const pass = result.status === 422 && payloadErrors(result).some((error) => error.code === "INVALID_EMAIL_FORMAT");
    pushResult("Reject invalid email format", result, pass, "expected 422 + INVALID_EMAIL_FORMAT");
  } else if (scenario.id === "AT-UC01-03") {
    const first = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("First registration succeeds", first, first.status === 202, "expected 202");
    const second = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    const secondCode = payloadCode(second);
    const pass = includesExpected(second.status, [409, 422]) && includesExpected(secondCode, ["EMAIL_PENDING_REGISTRATION", "EMAIL_ALREADY_REGISTERED"]);
    pushResult("Second duplicate registration rejected", second, pass, "expected 409/422 + duplicate code");
  } else if (scenario.id === "AT-UC01-04") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email, password: "short", confirmPassword: "short" }
    });
    const codes = payloadErrors(result).map((error) => error.code);
    const pass = result.status === 422 && codes.some((code) => code.startsWith("PASSWORD_"));
    pushResult("Reject weak password", result, pass, "expected 422 + password policy errors");
  } else if (scenario.id === "AT-UC01-05") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "", password: "", confirmPassword: "" }
    });
    const codes = payloadErrors(result).map((error) => error.code);
    const pass = result.status === 422
      && codes.includes("MISSING_EMAIL")
      && codes.includes("MISSING_PASSWORD")
      && codes.includes("MISSING_CONFIRM_PASSWORD");
    pushResult("Reject missing required fields", result, pass, "expected required-field errors");
  } else if (scenario.id === "AT-UC01-06") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "bad", password: "short", confirmPassword: "wrong" }
    });
    const codes = payloadErrors(result).map((error) => error.code);
    const expectedLeading = ["INVALID_EMAIL_FORMAT", "PASSWORD_TOO_SHORT", "PASSWORD_MISSING_UPPERCASE", "PASSWORD_MISSING_NUMBER"];
    const pass = result.status === 422 && JSON.stringify(codes.slice(0, 4)) === JSON.stringify(expectedLeading);
    pushResult("Return mixed errors in deterministic order", result, pass, "expected stable leading error order");
  } else if (scenario.id === "AT-UC01-07") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const login = await callApi({
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: strong.email, password: strong.password }
    });
    const pass = login.status === 403 && payloadCode(login) === "EMAIL_UNVERIFIED";
    pushResult("Deny login before verification", login, pass, "expected 403 + EMAIL_UNVERIFIED");
  } else if (scenario.id === "AT-UC01-08") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const tokenResp = await callApi({
      method: "GET",
      path: "/api/v1/dev/verification-token",
      query: { email: strong.email },
      actor: "admin"
    });
    pushResult("Get verification token (dev helper)", tokenResp, tokenResp.status === 200, "expected 200");
    const advance = await callApi({
      method: "POST",
      path: "/api/v1/dev/time/advance",
      body: { ms: 24 * 60 * 60 * 1000 }
    });
    pushResult("Advance time by 24h", advance, advance.status === 200, "expected 200");
    const verify = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    const pass = verify.status === 410 && payloadCode(verify) === "TOKEN_EXPIRED";
    pushResult("Reject expired verification token", verify, pass, "expected 410 + TOKEN_EXPIRED");
  } else if (scenario.id === "AT-UC01-09") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const advance = await callApi({
      method: "POST",
      path: "/api/v1/dev/time/advance",
      body: { ms: 7 * 24 * 60 * 60 * 1000 }
    });
    pushResult("Advance time by 7d", advance, advance.status === 200, "expected 200");
    const login = await callApi({
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: strong.email, password: strong.password }
    });
    const loginPass = login.status === 403 && payloadCode(login) === "REGISTRATION_ATTEMPT_EXPIRED";
    pushResult("Deny login for expired pending registration", login, loginPass, "expected 403 + REGISTRATION_ATTEMPT_EXPIRED");
    const resend = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    const resendPass = resend.status === 410 && payloadCode(resend) === "REGISTRATION_ATTEMPT_EXPIRED";
    pushResult("Deny resend for expired pending registration", resend, resendPass, "expected 410 + REGISTRATION_ATTEMPT_EXPIRED");
  } else if (scenario.id === "AT-UC01-10") {
    const requestA = callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    const requestB = callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    const [a, b] = await Promise.all([requestA, requestB]);
    const statuses = [a.status, b.status].sort((x, y) => x - y);
    const pass = statuses.length === 2 && statuses[0] !== statuses[1];
    pushResult("Concurrent request A", a, pass, "expect one success and one failure");
    pushResult("Concurrent request B", b, pass, "expect one success and one failure");
  } else if (scenario.id === "AT-UC01-11") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const resend1 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    pushResult("Resend #1", resend1, resend1.status === 202, "expected 202");
    const resendImmediate = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    const cooldownPass = resendImmediate.status === 429 && payloadCode(resendImmediate) === "RESEND_COOLDOWN_ACTIVE";
    pushResult("Resend immediately (cooldown)", resendImmediate, cooldownPass, "expected 429 + RESEND_COOLDOWN_ACTIVE");
    await callApi({ method: "POST", path: "/api/v1/dev/time/advance", body: { ms: 61 * 1000 } });
    const resend2 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    pushResult("Resend #2", resend2, resend2.status === 202, "expected 202");
    await callApi({ method: "POST", path: "/api/v1/dev/time/advance", body: { ms: 61 * 1000 } });
    const resend3 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    pushResult("Resend #3", resend3, resend3.status === 202, "expected 202");
    await callApi({ method: "POST", path: "/api/v1/dev/time/advance", body: { ms: 61 * 1000 } });
    const resend4 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    const limitPass = resend4.status === 429 && payloadCode(resend4) === "RESEND_RATE_LIMITED";
    pushResult("Resend #4 exceeds 24h rolling max", resend4, limitPass, "expected 429 + RESEND_RATE_LIMITED");
  } else if (scenario.id === "AT-UC01-12") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const tokenResp = await callApi({
      method: "GET",
      path: "/api/v1/dev/verification-token",
      query: { email: strong.email },
      actor: "admin"
    });
    pushResult("Get verification token (dev helper)", tokenResp, tokenResp.status === 200, "expected 200");
    const verifyFirst = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    pushResult("Verify token first use", verifyFirst, verifyFirst.status === 200, "expected 200");
    const verifyReplay = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    const pass = verifyReplay.status === 410 && payloadCode(verifyReplay) === "TOKEN_ALREADY_USED";
    pushResult("Replay same token is rejected", verifyReplay, pass, "expected 410 + TOKEN_ALREADY_USED");
    lines.push("NOTE: Token hashing/log redaction checks remain code-level checks outside this API scenario runner.");
  } else if (scenario.id === "AT-UC01-13") {
    lines.push("Manual acceptance scenario.");
    lines.push("1) Open registration view and submit invalid values via keyboard only.");
    lines.push("2) Confirm each error is associated to its field and announced via aria-live.");
    lines.push("3) Confirm unverified-login reminder text is announced and resend affordance is reachable by keyboard.");
  } else {
    lines.push(`Scenario ${scenario.id} is not implemented.`);
  }

  return lines.join("\n\n");
}

function buildUc02Payload({ recordId, operation = "create", data }) {
  return {
    formId: "profile_form",
    operation,
    recordId,
    data: {
      firstName: "Alex",
      lastName: "Doe",
      email: "alex@example.com",
      age: 30,
      ...(data ?? {})
    }
  };
}

async function runUc02Scenario(scenario) {
  const lines = [];
  let step = 1;
  const recordId = `record-uc02-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const pushResult = (label, result, pass, details = "") => {
    lines.push(formatStep(step, label, result, pass, details));
    step += 1;
  };

  const submitForm = (payload) => callApi({ method: "POST", path: "/api/v1/forms/submit", body: payload, actor: "author" });
  const getRecord = () => callApi({
    method: "GET",
    path: "/api/v1/dev/forms/record",
    query: { recordId },
    actor: "admin"
  });

  if (scenario.id === "AT-UC02-01") {
    const submit = await submitForm(buildUc02Payload({ recordId }));
    const submitPass = submit.status === 200 && submit.payload?.status === "ACCEPTED";
    pushResult("Submit valid payload", submit, submitPass, "expected 200 + ACCEPTED");

    const record = await getRecord();
    const recordPass = record.status === 200 && record.payload?.record?.email === "alex@example.com";
    pushResult("Record persisted", record, recordPass, "expected stored email alex@example.com");
  } else if (scenario.id === "AT-UC02-02") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { firstName: "" }
    }));
    const codes = payloadErrors(submit).map((error) => error.code);
    const submitPass = submit.status === 422 && codes.includes("REQUIRED_FIELD_MISSING");
    pushResult("Reject missing required field", submit, submitPass, "expected 422 + REQUIRED_FIELD_MISSING");

    const record = await getRecord();
    pushResult("No persistence on required-field failure", record, record.status === 404, "expected RECORD_NOT_FOUND");
  } else if (scenario.id === "AT-UC02-03") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { email: "bad" }
    }));
    const codes = payloadErrors(submit).map((error) => error.code);
    const submitPass = submit.status === 422 && codes.includes("INVALID_FORMAT");
    pushResult("Reject invalid format", submit, submitPass, "expected 422 + INVALID_FORMAT");

    const record = await getRecord();
    pushResult("No persistence on format failure", record, record.status === 404, "expected RECORD_NOT_FOUND");
  } else if (scenario.id === "AT-UC02-04") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { age: 15 }
    }));
    const code = payloadErrors(submit)[0]?.code ?? payloadCode(submit);
    const submitPass = submit.status === 422 && code === "AGE_MINIMUM";
    pushResult("Reject business-rule violation", submit, submitPass, "expected 422 + AGE_MINIMUM");

    const record = await getRecord();
    pushResult("No persistence on business-rule failure", record, record.status === 404, "expected RECORD_NOT_FOUND");
  } else if (scenario.id === "AT-UC02-05") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { firstName: "", lastName: "", email: "bad", age: 15 }
    }));
    const codes = payloadErrors(submit).map((error) => error.code);
    const expectedOrder = ["REQUIRED_FIELD_MISSING", "REQUIRED_FIELD_MISSING", "INVALID_FORMAT", "AGE_MINIMUM"];
    const submitPass = submit.status === 422 && JSON.stringify(codes) === JSON.stringify(expectedOrder);
    pushResult("Return mixed errors in deterministic order", submit, submitPass, "expected strict stable ordering");
  } else if (scenario.id === "AT-UC02-06") {
    const create = await submitForm(buildUc02Payload({ recordId }));
    pushResult("Create valid baseline record", create, create.status === 200, "expected 200");

    const badUpdate = await submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { email: "broken" }
    }));
    pushResult("Reject invalid update", badUpdate, badUpdate.status === 422, "expected 422");

    const record = await getRecord();
    const pass = record.status === 200 && record.payload?.record?.email === "alex@example.com";
    pushResult("Record remains unchanged (no partial write)", record, pass, "expected unchanged email");
  } else if (scenario.id === "AT-UC02-07") {
    const bad = await submitForm(buildUc02Payload({
      recordId,
      data: { email: "bad" }
    }));
    pushResult("Initial invalid submission rejected", bad, bad.status === 422, "expected 422");

    const corrected = await submitForm(buildUc02Payload({
      recordId,
      data: { email: "alex.fixed@example.com" }
    }));
    const correctedPass = corrected.status === 200 && corrected.payload?.record?.email === "alex.fixed@example.com";
    pushResult("Corrected resubmission accepted", corrected, correctedPass, "expected persisted corrected data");
  } else if (scenario.id === "AT-UC02-08") {
    const create = await submitForm(buildUc02Payload({ recordId }));
    pushResult("Create valid baseline record", create, create.status === 200, "expected 200");

    const armFailure = await callApi({
      method: "POST",
      path: "/api/v1/dev/forms/force-persistence-failure",
      body: {},
      actor: "admin"
    });
    pushResult("Arm next persistence failure (dev helper)", armFailure, armFailure.status === 200, "expected 200");

    const failedUpdate = await submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { age: 31 }
    }));
    const failedPass = failedUpdate.status === 500 && payloadCode(failedUpdate) === "PERSISTENCE_FAILED";
    pushResult("Persistence failure returns retry guidance", failedUpdate, failedPass, "expected 500 + PERSISTENCE_FAILED");

    const record = await getRecord();
    const unchangedPass = record.status === 200 && record.payload?.record?.age === 30;
    pushResult("Rollback/abort keeps previous state", record, unchangedPass, "expected age still 30");
  } else if (scenario.id === "AT-UC02-09") {
    const create = await submitForm(buildUc02Payload({ recordId }));
    pushResult("Create valid baseline record", create, create.status === 200, "expected 200");

    const updateA = submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { firstName: "Taylor" }
    }));
    const updateB = submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { firstName: "Jordan" }
    }));
    const [a, b] = await Promise.all([updateA, updateB]);
    pushResult("Conflicting update A", a, a.status === 200, "expected 200");
    pushResult("Conflicting update B", b, b.status === 200, "expected 200");

    const record = await getRecord();
    const pass = record.status === 200 && record.payload?.record?.firstName === "Jordan";
    pushResult("Final state uses last write", record, pass, "expected firstName Jordan");
  } else if (scenario.id === "AT-UC02-10") {
    lines.push("Manual acceptance scenario.");
    lines.push("1) Verify UC-02 requirements map to AT cases in UC-02.md and UC-02-AT.md.");
    lines.push("2) Verify rule ownership remains explicit in backend form definitions.");
    lines.push("3) Confirm each validation rule has a matching acceptance scenario.");
  } else {
    lines.push(`Scenario ${scenario.id} is not implemented.`);
  }

  return lines.join("\n\n");
}

async function executeScenario(item, scenario) {
  if (item.id === "UC-01") {
    const result = await runUc01Scenario(scenario);
    setOutput(item.id, `Scenario ${scenario.id}: ${scenario.title}\nExample input:\n${JSON.stringify(scenario.example, null, 2)}\n\n${result}`);
    return;
  }
  if (item.id === "UC-02") {
    const result = await runUc02Scenario(scenario);
    setOutput(item.id, `Scenario ${scenario.id}: ${scenario.title}\nExample input:\n${JSON.stringify(scenario.example, null, 2)}\n\n${result}`);
    return;
  }
  if (scenario.planned) {
    const result = await runPlannedScenario(scenario);
    setOutput(item.id, `Scenario ${scenario.id}: ${scenario.title}\nExample input:\n${JSON.stringify(scenario.example, null, 2)}\n\n${result}`);
    return;
  }
  setOutput(
    item.id,
    `Scenario ${scenario.id}: ${scenario.title}\nExample input:\n${JSON.stringify(scenario.example ?? {}, null, 2)}\n\nManual validation scenario.\nUse UC and AT documents to verify this behavior explicitly.`
  );
}

function makeCard(item) {
  const article = document.createElement("article");
  article.className = "uc-card";

  const endpointText = item.endpoint ? `${item.endpoint.method} ${item.endpoint.path}` : "Placeholder";
  article.innerHTML = `
    <div class="uc-head">
      <div class="uc-id">${item.id} - ${item.title}</div>
      <div class="uc-endpoint">${endpointText}</div>
    </div>
    <p class="uc-goal">${item.goal}</p>
  `;

  const output = document.createElement("pre");
  output.className = "uc-output";
  output.textContent = "No execution yet.";

  const actions = document.createElement("div");
  actions.className = "actions";

  const scenarios = buildUcScenarioList(item.id);
  for (const scenario of scenarios) {
    const scenarioBtn = document.createElement("button");
    scenarioBtn.type = "button";
    scenarioBtn.textContent = `${scenario.kind === "success" ? "Success" : scenario.kind === "manual" ? "Manual" : "Alt"}: ${scenario.id}`;
    scenarioBtn.title = `${scenario.title}\n\nExample:\n${JSON.stringify(scenario.example, null, 2)}`;
    scenarioBtn.addEventListener("click", async () => {
      scenarioBtn.disabled = true;
      try {
        await executeScenario(item, scenario);
      } catch (error) {
        setOutput(item.id, `Scenario failed: ${String(error?.message ?? error)}`);
      } finally {
        scenarioBtn.disabled = false;
      }
    });
    actions.appendChild(scenarioBtn);
  }

  article.append(actions, output);
  cards.set(item.id, { output });
  return article;
}

function render(filter = "") {
  const query = filter.trim().toLowerCase();
  listEl.innerHTML = "";
  cards.clear();
  for (const item of UC_ITEMS) {
    const endpointText = item.endpoint ? `${item.endpoint.method} ${item.endpoint.path}` : "placeholder";
    const haystack = `${item.id} ${item.title} ${item.goal} ${endpointText}`.toLowerCase();
    if (query && !haystack.includes(query)) continue;
    listEl.appendChild(makeCard(item));
  }
}

filterEl.addEventListener("input", () => render(filterEl.value));

loadContext();
render();
