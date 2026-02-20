import { retrievePublicSchedule } from "../../services/public-schedule/public-schedule-retrieval-service.js";

export function createGetPublicScheduleController(deps) {
  return {
    get: (request) => retrievePublicSchedule(deps.scheduleDraftRepository, request.params?.conferenceId)
  };
}
