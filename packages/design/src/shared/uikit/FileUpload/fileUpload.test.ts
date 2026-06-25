// KIT-05 — the security contract test for `FileUpload` (Plan 03-04, Wave 4). The regression
// guard for the two genuine threat-model pitfalls (threat_model T-03-04-01 SVG/XSS,
// T-03-04-02 object-URL leak) + the rejection-reason mapping (T-03-04-03 oversize).
//
// Vitest = pure logic only, node env, NO DOM / NO RTL (solidstats-frontend-react-tests
// runner split — "do NOT render a component and assert on its DOM; component behaviour is
// Playwright's job"; the repo's vitest.config runs `environment: "node"`). So the plan's
// "mount → unmount → spy revokeObjectURL" is pinned the repo-idiomatic way: the object-URL
// create→revoke lifecycle is the PURE `createPreviewUrlTracker` (fileUpload.ts) the
// component's unmount effect drives, and this test asserts the tracker revokes every created
// URL exactly once via an injected `URL` spy — same contract, no React mount (the DOM
// keyboard/render coverage lives in the Playwright keyboard.spec, Task 3). AAA, isolated,
// deterministic (solidstats-shared-testing-standards).
import { describe, expect, test, vi } from "vitest";
import {
  ACCEPT_DEFAULT,
  ACCEPTED_IMAGE_TYPES,
  createPreviewUrlTracker,
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

describe("FileUpload object-URL lifecycle — every preview URL is revoked (T-03-04-02 leak guard)", () => {
  // Inject a fake URL API so the tracker is exercised without a DOM (node env) and the spy
  // counts revocations deterministically.
  function fakeUrlApi() {
    let n = 0;
    return {
      createObjectURL: vi.fn(() => `blob:fake-${(n += 1)}`),
      revokeObjectURL: vi.fn(),
    };
  }

  function fileFixture(name: string): File {
    return new File(["x"], name, { type: "image/png" });
  }

  test("revokeAll revokes EACH created URL exactly once (no blob-URL leak)", () => {
    // Arrange: three tracked previews.
    const api = fakeUrlApi();
    const tracker = createPreviewUrlTracker(api);
    tracker.create(fileFixture("a.png"));
    tracker.create(fileFixture("b.png"));
    tracker.create(fileFixture("c.png"));
    expect(api.createObjectURL).toHaveBeenCalledTimes(3);
    expect(tracker.size()).toBe(3);

    // Act: the unmount path.
    tracker.revokeAll();

    // Assert: every created URL was revoked, the ledger is drained (no leak).
    expect(api.revokeObjectURL).toHaveBeenCalledTimes(3);
    expect(tracker.size()).toBe(0);
  });

  test("revokeAll is idempotent — a StrictMode double-unmount does not double-revoke", () => {
    const api = fakeUrlApi();
    const tracker = createPreviewUrlTracker(api);
    tracker.create(fileFixture("a.png"));

    tracker.revokeAll();
    tracker.revokeAll();

    // The second drain is a no-op — exactly one revoke for the one URL.
    expect(api.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(tracker.size()).toBe(0);
  });
});
