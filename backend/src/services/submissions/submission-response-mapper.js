export function mapSubmissionSuccess(record) {
  return {
    status: 201,
    body: {
      status: "FINALIZED",
      submission_id: record.id,
      redirect: "/author/home"
    }
  };
}

export function mapSubmissionList(records) {
  return {
    status: 200,
    body: {
      submissions: records.map((r) => ({
        submission_id: r.id,
        status: r.status,
        metadata: r.metadata,
        manuscript_file: {
          fileName: r.manuscriptFile.fileName,
          contentType: r.manuscriptFile.contentType,
          sizeBytes: r.manuscriptFile.sizeBytes
        }
      }))
    }
  };
}
