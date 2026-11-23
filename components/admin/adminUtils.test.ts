import { describe, expect, it } from "vitest"
import { isAdminUser } from "./adminUtils"

describe("isAdminUser", () => {
  it("recognizes an admin role returned by the profile endpoint", () => {
    expect(isAdminUser({ role: "admin" })).toBe(true)
    expect(isAdminUser({ isAdmin: true })).toBe(true)
  })

  it("recognizes the supported profile response wrappers", () => {
    expect(isAdminUser({ user: { isAdmin: true } })).toBe(true)
    expect(isAdminUser({ profile: { role: "ADMIN" } })).toBe(true)
  })

  it("reads admin claims from the login token for client-side UI", () => {
    expect(
      isAdminUser({
        accessToken: "eyJhbGciOiJub25lIn0.eyJpc0FkbWluIjp0cnVlfQ.signature",
      })
    ).toBe(true)
    expect(isAdminUser({ accessToken: "invalid-token" })).toBe(false)
  })

  it("rejects non-admin and invalid profile values", () => {
    expect(isAdminUser({ isAdmin: false, role: "customer" })).toBe(false)
    expect(isAdminUser(null)).toBe(false)
  })
})
