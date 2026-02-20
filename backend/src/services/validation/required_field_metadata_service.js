import { getFormDefinition } from "../../models/form_definition_repository.js";

export function getRequiredFields(formId) {
  const definition = getFormDefinition(formId);
  return definition?.requiredFields ?? [];
}
