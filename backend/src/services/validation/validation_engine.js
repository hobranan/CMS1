import { makeError } from "./validation_error_mapper.js";

function requiredErrors(definition, payload) {
  const errors = [];
  for (const field of definition.requiredFields) {
    const value = payload[field];
    if (value === undefined || value === null || value === "") {
      errors.push(makeError(field, "REQUIRED_FIELD_MISSING", `${field} is required.`));
    }
  }
  return errors;
}

function formatErrors(definition, payload) {
  const errors = [];
  for (const [field, validator] of Object.entries(definition.formats ?? {})) {
    if (!validator(payload[field])) {
      errors.push(makeError(field, "INVALID_FORMAT", `${field} format is invalid.`));
    }
  }
  return errors;
}

function businessRuleErrors(definition, payload) {
  const errors = [];
  for (const rule of definition.businessRules ?? []) {
    if (!rule.validate(payload)) {
      errors.push(makeError(rule.field, rule.code, rule.message));
    }
  }
  return errors;
}

export function validateSubmission(definition, payload) {
  const errors = [
    ...requiredErrors(definition, payload),
    ...formatErrors(definition, payload),
    ...businessRuleErrors(definition, payload)
  ];
  return { valid: errors.length === 0, errors };
}
