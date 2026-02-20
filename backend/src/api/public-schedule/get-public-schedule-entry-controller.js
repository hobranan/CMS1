import { retrievePublicEntryDetail } from "../../services/public-schedule/public-schedule-detail-service.js";
import { resolveFieldRestrictionPolicy } from "../../services/public-schedule/field-restriction-policy-service.js";
import { mapPublicScheduleDetailResponse } from "./public-schedule-detail-response-mapper.js";

export function createGetPublicScheduleEntryController(deps) {
  return {
    get: (request) => {
      const conferenceId = request.params?.conferenceId;
      const entryId = request.params?.entryId;
      const schedule = deps.scheduleDraftRepository.getPublished(conferenceId);
      const policy = resolveFieldRestrictionPolicy(schedule);
      const result = retrievePublicEntryDetail(deps.scheduleDraftRepository, conferenceId, entryId, policy);
      if (result.status === 200) {
        return { status: 200, body: mapPublicScheduleDetailResponse(result.body) };
      }
      return result;
    }
  };
}
