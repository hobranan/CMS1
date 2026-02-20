export function resolveFieldRestrictionPolicy(schedule) {
  return {
    allowSpeakers: schedule?.publicPolicy?.allowSpeakers !== false,
    allowAbstract: schedule?.publicPolicy?.allowAbstract !== false
  };
}
