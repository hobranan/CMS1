import { getFormDefinition } from "../../models/form_definition_repository.js";
import { mapValidationResponse } from "./validation_error_mapper.js";
import { validateSubmission } from "./validation_engine.js";

export function validateAndPersistSubmission(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const { formId, operation, recordId = "new", data } = request.body ?? {};
  const definition = getFormDefinition(formId);
  if (!definition) {
    return {
      status: 422,
      body: {
        code: "UNKNOWN_FORM",
        message: "Form is not in the in-scope catalog."
      }
    };
  }

  const validation = validateSubmission(definition, data ?? {});
  deps.formSubmissionRepository.recordValidationResult({
    formId,
    operation,
    valid: validation.valid,
    errors: validation.errors
  });

  if (!validation.valid) {
    deps.observability?.record({ formId, operation, outcome: "validation_failed", errorCount: validation.errors.length });
    return {
      status: 422,
      body: mapValidationResponse(validation.errors)
    };
  }

  try {
    const saved = deps.atomicPersistence.persistAtomically({
      recordId,
      payload: data,
      now
    });
    deps.observability?.record({ formId, operation, outcome: "saved" });
    return {
      status: 200,
      body: {
        status: "ACCEPTED",
        operation,
        record: saved
      }
    };
  } catch (error) {
    deps.observability?.record({ formId, operation, outcome: "persistence_failed" });
    throw error;
  }
}
