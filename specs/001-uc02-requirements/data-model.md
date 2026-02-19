# Data Model: UC-02 Validate user-provided information

## Entity: FormDefinition

- Purpose: Describes a CMS form and the validation rules attached to its fields.
- Fields:
  - `id` (UUID, primary key)
  - `form_key` (string, unique, required)
  - `name` (string, required)
  - `is_active` (boolean, required)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - `form_key` must map uniquely to a controller/view flow.
- Relationships:
  - One-to-many with `FieldRule`.

## Entity: FieldRule

- Purpose: Defines required, format, and constraint/business rules for a field.
- Fields:
  - `id` (UUID, primary key)
  - `form_definition_id` (UUID, foreign key)
  - `field_name` (string, required)
  - `is_required` (boolean, required)
  - `format_type` (enum: `EMAIL`, `STRING`, `NUMBER`, `DATE`, `CUSTOM`)
  - `min_length` (integer, nullable)
  - `max_length` (integer, nullable)
  - `min_value` (number, nullable)
  - `max_value` (number, nullable)
  - `rule_expression` (string, nullable)
  - `error_code` (string, required)
  - `error_message` (string, required)
- Validation rules:
  - `field_name` unique per form.
  - Range/length minima cannot exceed maxima.
- Relationships:
  - Belongs to `FormDefinition`.

## Entity: FormSubmission

- Purpose: Represents a user payload submitted through a CMS form.
- Fields:
  - `id` (UUID, primary key)
  - `form_definition_id` (UUID, foreign key)
  - `submitted_by_user_id` (UUID, required)
  - `payload` (object/json, required)
  - `status` (enum: `REJECTED`, `ACCEPTED`)
  - `submitted_at` (datetime, required)
- Validation rules:
  - `submitted_by_user_id` must reference authenticated user.
  - `status = ACCEPTED` only when no validation errors remain.
- Relationships:
  - One-to-one with `ValidationResult`.

## Entity: ValidationResult

- Purpose: Captures outcome of a validation attempt.
- Fields:
  - `id` (UUID, primary key)
  - `form_submission_id` (UUID, foreign key)
  - `is_valid` (boolean, required)
  - `errors` (array of `{ field, code, message }`)
  - `validated_at` (datetime, required)
- Validation rules:
  - `errors` empty when `is_valid = true`.
  - Each error entry must include `code` and human-readable `message`.
- Relationships:
  - Belongs to `FormSubmission`.

## Entity: PersistedFormData

- Purpose: Stores canonical business data updated only after valid submission.
- Fields:
  - `id` (UUID, primary key)
  - `form_definition_id` (UUID, foreign key)
  - `owner_user_id` (UUID, required)
  - `data` (object/json, required)
  - `version` (integer, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - Updated only inside successful transaction after full validation pass.
- Relationships:
  - Logical target for accepted `FormSubmission`.

## State Transitions

1. Submit payload:
   - Create `FormSubmission` in processing context.
2. Validation failure:
   - `ValidationResult.is_valid = false`
   - `FormSubmission.status = REJECTED`
   - No write/update to `PersistedFormData`.
3. Validation success:
   - `ValidationResult.is_valid = true`
   - Persist/update `PersistedFormData` in single transaction.
   - `FormSubmission.status = ACCEPTED`.
4. Transaction failure during write:
   - Rollback data change and mark submission as rejected with persistence error.
