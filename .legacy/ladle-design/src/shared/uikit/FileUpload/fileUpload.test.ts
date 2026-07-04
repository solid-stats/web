// KIT-05 — the security contract test for `FileUpload` (Plan 03-04, Wave 4). The regression
// guard for the two genuine threat-model pitfalls (threat_model T-03-04-01 SVG/XSS,
// T-03-04-02 object-URL leak) + the rejection-reason mapping (T-03-04-03 oversize).
//
// Vitest = pure logic only, node env, NO DOM / NO RTL (solidstats-frontend-react-tests
// runner split — "do NOT render a component and assert on its DOM; component behaviour is
// Playwright's job"; the repo's vitest.config runs `environment: "node"`). The preview
// object-URL lifecycle (T-03-04-02) is owned ENTIRELY by Ark's `ItemPreviewImage`
// (create + revoke in its own effect cleanup), so there is no slice-level URL ledger to pin
// here; the DOM-level revoke is Ark's contract, covered by the Playwright pass. This suite
// pins the slice's own pure logic — the accept allowlist (SVG/XSS gate) and the reject-reason
// mapping. AAA, isolated, deterministic (solidstats-shared-testing-standards).
import { describe, expect, test } from "vitest";
import {
  ACCEPT_DEFAULT,
  ACCEPTED_IMAGE_TYPES,
  firstRejectReason,
  mapRejectReason,
} from "./fileUpload";

describe("FileUpload accept allowlist — SVG is excluded (T-03-04-01, the XSS gate)", () => {
  test("the default accept contains png, jpeg, and webp", () => {
    expect(ACCEPT_DEFAULT).toContain("image/png");
    expect(ACCEPT_DEFAULT).toContain("image/jpeg");
    expect(ACCEPT_DEFAULT).toContain("image/webp");
  });

  test("the default accept does NOT contain image/svg+xml (SVG disallowed — stored-XSS vector)", () => {
    expect(ACCEPT_DEFAULT).not.toContain("svg");
    expect(ACCEPTED_IMAGE_TYPES).not.toContain("image/svg+xml" as never);
  });
});

describe("FileUpload reject-reason mapping — the why the rejection copy names", () => {
  test("a wrong-type (SVG) error maps to the wrong-type reason", () => {
    expect(mapRejectReason("FILE_INVALID_TYPE")).toBe("wrong-type");
  });

  test("an oversize error maps to the too-large reason", () => {
    expect(mapRejectReason("FILE_TOO_LARGE")).toBe("too-large");
  });

  test("a too-many-files error maps to the too-many reason", () => {
    expect(mapRejectReason("TOO_MANY_FILES")).toBe("too-many");
  });

  test("an unknown/forward-compatible code folds to other (never an empty reason)", () => {
    expect(mapRejectReason("FILE_EXISTS")).toBe("other");
    expect(mapRejectReason("SOME_FUTURE_CODE")).toBe("other");
  });

  test("wrong-type (the security reason) wins over size when a file trips both", () => {
    // An SVG that is also oversize must surface the type rejection — the XSS reason is the
    // one the user sees and fixes first.
    expect(firstRejectReason(["FILE_TOO_LARGE", "FILE_INVALID_TYPE"])).toBe("wrong-type");
  });

  test("size is named when only the size limit trips", () => {
    expect(firstRejectReason(["FILE_TOO_LARGE"])).toBe("too-large");
  });
});
