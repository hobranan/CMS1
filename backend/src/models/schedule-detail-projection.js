export function projectScheduleDetail(entry, policy) {
  return {
    entryId: entry.entryId,
    title: entry.title,
    speakers: policy.allowSpeakers ? (entry.speakers ?? []) : [],
    abstract: policy.allowAbstract ? (entry.abstract ?? null) : null,
    unavailableFields: [
      ...(policy.allowSpeakers ? [] : ["speakers"]),
      ...(policy.allowAbstract ? [] : ["abstract"])
    ]
  };
}
