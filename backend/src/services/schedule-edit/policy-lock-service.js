export function enforcePolicyLock(conference) {
  return { locked: conference?.editLocked === true, reason: conference?.lockReason ?? "Policy lock active." };
}
