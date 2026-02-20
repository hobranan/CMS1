import { normalizeMetadata, validateMetadata } from "../../models/paper-metadata.js";
import { validateManuscriptFile } from "../../models/manuscript-file.js";

export function validateSubmissionInput(body, file) {
  const metadata = normalizeMetadata(body ?? {});
  const metadataCheck = validateMetadata(metadata);
  const fileCheck = validateManuscriptFile(file);
  const errors = [...metadataCheck.errors, ...fileCheck.errors];
  return {
    valid: errors.length === 0,
    errors,
    metadata: {
      ...metadata,
      authorContactPhoneNormalized: metadataCheck.normalizedPhone
    }
  };
}
