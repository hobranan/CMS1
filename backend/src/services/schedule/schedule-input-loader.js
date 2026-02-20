export function loadScheduleInputs(repository, conferenceId) {
  const conference = repository.getConference(conferenceId);
  return {
    conference,
    acceptedPapers: conference?.acceptedPapers ?? [],
    rooms: conference?.rooms ?? [],
    parameters: conference?.parameters ?? {}
  };
}
