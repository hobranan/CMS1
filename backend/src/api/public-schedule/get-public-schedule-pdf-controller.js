import { generatePublicSchedulePdf } from "../../services/public-schedule/public-schedule-pdf-service.js";

export function createGetPublicSchedulePdfController(deps) {
  return {
    get: (request) => {
      const disposition = request.query?.disposition === "attachment" ? "attachment" : "inline";
      return generatePublicSchedulePdf(deps.scheduleDraftRepository, request.params?.conferenceId, disposition);
    }
  };
}
