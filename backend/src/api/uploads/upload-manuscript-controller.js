import { uploadAndAttach } from "../../services/uploads/upload-attachment-orchestrator.js";

export function createUploadManuscriptController(deps) {
  return {
    upload: (request) => uploadAndAttach(deps, request)
  };
}
