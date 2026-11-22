import { decodeJwt } from "jose"

export function getAdminErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Please try again in a moment."
  }

  if ("data" in error) {
    const data = error.data
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message
  }

  if ("error" in error && typeof error.error === "string") {
    return error.error
  }

  return "Please try again in a moment."
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function isAdminUser(value: unknown): boolean {
  let candidate = value
  if (isRecord(candidate)) {
    candidate = candidate.user ?? candidate.profile ?? candidate
  }
  if (!isRecord(candidate)) return false
  if (candidate.isAdmin === true) return true

  if (typeof candidate.accessToken === "string") {
    try {
      if (decodeJwt(candidate.accessToken).isAdmin === true) return true
    } catch {
      return false
    }
  }

  return false
}
