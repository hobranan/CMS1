export function assignmentTransactionSuccess(paperId, refereeIds) {
  return {
    ok: true,
    status: "ASSIGNMENT_FINALIZED",
    paperId,
    refereeIds
  };
}

export function assignmentTransactionFailure(code, message) {
  return {
    ok: false,
    code,
    message
  };
}

