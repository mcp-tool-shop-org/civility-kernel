import { PreferencePolicy } from "./types.js";

export interface FeedbackEvent {
  type: "CHOOSE_PLAN" | "UNDO" | "THUMBS_UP" | "THUMBS_DOWN";
  weightKey?: string;
  timestamp: string;
}

export interface PolicyUpdateProposal {
  reason: string;
  patch: Partial<PreferencePolicy>;
}

export function proposePolicyUpdates(
  policy: PreferencePolicy,
  events: FeedbackEvent[]
): PolicyUpdateProposal[] {
  const proposals: PolicyUpdateProposal[] = [];
  const downs = events.filter(e => e.type === "THUMBS_DOWN").length;
  const undos = events.filter(e => e.type === "UNDO").length;
  if (undos >= 3) {
    proposals.push({
      reason: "Multiple undo events suggest actions are too proactive.",
      patch: { calibration: { ...policy.calibration, initiative: Math.max(0, policy.calibration.initiative - 0.1) } }
    });
  }
  const verbosityDown = events.filter(e => e.type === "THUMBS_DOWN" && e.weightKey === "concise").length;
  if (verbosityDown >= 2) {
    proposals.push({
      reason: "Feedback suggests responses are too verbose.",
      patch: { calibration: { ...policy.calibration, verbosity: Math.max(0, policy.calibration.verbosity - 0.1) } }
    });
  }
  if (downs >= 5 && proposals.length === 0) {
    proposals.push({
      reason: "Repeated negative feedback; consider requesting user clarification of preferences.",
      patch: {}
    });
  }
  return proposals;
}
