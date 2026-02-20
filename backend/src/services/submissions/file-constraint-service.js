import { validateManuscriptFile } from "../../models/manuscript-file.js";

export function validateFileConstraints(file) {
  return validateManuscriptFile(file);
}
