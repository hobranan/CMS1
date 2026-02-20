export function loadPublicationState(repository, conferenceId) {
  const schedule = repository.getPublished(conferenceId);
  return { schedule, isPublished: Boolean(schedule) };
}
