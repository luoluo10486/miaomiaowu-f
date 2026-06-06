import { requestRag } from "./ragService";

export function getCurrentMemberProfile() {
  return requestRag("/member/profile/me");
}

export function getCurrentUserSummary() {
  return requestRag("/user/me");
}
