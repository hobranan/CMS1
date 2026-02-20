export function asPublicPdfArtifact({ conferenceId, content, disposition = "inline" }) {
  return {
    conferenceId,
    contentType: "application/pdf",
    content,
    disposition,
    fileName: `conference-${conferenceId}-schedule.pdf`
  };
}
