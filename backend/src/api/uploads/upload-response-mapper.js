export function mapUploadSuccess(submissionId) {
  return {
    status: 201,
    body: {
      status: "ATTACHED",
      submission_id: submissionId,
      attached: true
    }
  };
}
