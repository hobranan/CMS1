import { asPublicPdfArtifact } from "../../models/public-pdf-artifact.js";

export function generatePublicSchedulePdf(repository, conferenceId, disposition = "inline") {
  const schedule = repository.getPublished(conferenceId);
  if (!schedule) {
    return { status: 404, body: { code: "SCHEDULE_NOT_PUBLISHED", message: "Public schedule is not available yet." } };
  }
  if (repository.failNextPublicPdfRead) {
    repository.failNextPublicPdfRead = false;
    return { status: 500, body: { code: "PDF_RETRIEVAL_FAILURE", message: "Schedule PDF could not be generated." } };
  }

  const content = `PDF::${conferenceId}::${(schedule.entries ?? []).length}`;
  const artifact = asPublicPdfArtifact({ conferenceId, content, disposition });
  return {
    status: 200,
    body: {
      contentType: artifact.contentType,
      disposition: `${artifact.disposition}; filename=\"${artifact.fileName}\"`,
      pdf: artifact.content
    }
  };
}
