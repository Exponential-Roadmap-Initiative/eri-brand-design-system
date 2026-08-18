export type SkillReleaseStatus = "submitted" | "approved" | "rejected" | "released";

const ALLOWED_TRANSITIONS: Record<SkillReleaseStatus, readonly SkillReleaseStatus[]> = {
  submitted: ["approved", "rejected"],
  approved: ["released"],
  rejected: [],
  released: [],
};

export function canTransitionSkillRelease(
  from: SkillReleaseStatus,
  to: SkillReleaseStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
