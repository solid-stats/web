---
name: uikit-spec
description: >-
  Discuss, write, and publish SolidStats UI Kit component specifications from
  Codex side chats. Use for "specify Select" / "опиши Select" or "revise Select
  loading" / "уточни загрузку опций Select".
---

# UI Kit Spec

Invoke explicitly in a SolidStats design side chat with a component name or a
requested change. Own its English implementation specification at
`docs/ui-kit/<component-kebab-case>.md` in `solid-stats/web`.

## Ground the discussion

1. Confirm the repository, read its active instructions and managed SolidStats
   contract, and check the current branch and upstream. Read the target spec if
   it exists, the relevant `DESIGN.md` recipes and tokens, and the project
   conventions for the component. Use feature briefs only for relevant
   scenarios and keep screen-specific policy with the screen.
2. Resolve the main design chat from an explicit user link or the current side
   chat's verified parent. Use Codex's chat tools for history. If they omit the
   parent on a local host, use the trusted current thread ID (for example
   `CODEX_THREAD_ID`) to locate its exact rollout under the active Codex home's
   `sessions` directory. Read only its first `session_meta` record and use
   `forked_from_id` if present. Verify the resulting chat's repository and
   design scope. If the source is missing, ambiguous, or belongs to another
   scope, ask for the main chat link when needed.
3. Read the main chat's relevant decisions, including changes made after the
   fork, and inspect the current Figma component, state matrix, and spec
   annotation. Resolve the Figma node from the design chat or supplied link.
   Load the relevant Figma skills before inspecting or writing with their
   tools. If a source is unavailable, explain the affected gap and continue
   with independent questions. Verify scoped claims and the publication target
   before requesting approval.
4. Treat explicitly accepted decisions, the current visual design, and the
   current written contract as evidence for their respective subjects.
   Identify conflicts explicitly and check acceptance and recency before
   proposing a resolution. Verify relevant behavior against current official
   Ark UI documentation for the project version. Consult the applicable
   WAI-ARIA APG pattern, WCAG criteria, and Checklist Design entry when one
   exists. Cite applicable sources in the spec. Distinguish native and Ark UI
   defaults from SolidStats behavior and future verification.

## Discuss and review

Load the installed `deep-brainstorm` skill and its required references.
Use it for the unresolved decisions within the requested scope. A targeted
revision starts with the existing accepted spec and preserves unrelated
requirements. Resolve consequential behavior, ownership, and design conflicts
before presenting the draft.

Use these sections where applicable:

- **Purpose and scope** — what the component does and the intended use cases.
- **API and Ark UI composition** — public inputs, defaults, events, slots,
  parts, native semantics, and ownership of state and side effects.
- **Layout and states** — token references, sizing and composition, meaningful
  state combinations, and the exact visual distinction between focus,
  visible keyboard focus, hover, press, and selection where relevant.
- **Interactions and accessibility** — pointer, keyboard and focus transitions,
  accessible naming and announcements, and behavior at boundaries such as
  disabled, empty, invalid, or loading when relevant.
- **Acceptance checks** — observable behavior and design cases, with checks
  requiring a live implementation identified as pending.
- **Sources** — direct Figma node, relevant project rules and official
  documentation.

Show the complete proposed spec in chat and name the Markdown path, the Figma
node, any exact legacy full-text annotation planned for removal, and whether
the main chat will receive a design-change message. Carry forward every still
applicable requirement from the old spec or annotation. Call out intentional
changes. Wait for explicit approval of the whole draft and stated publication
scope. Answers to individual questions resolve those questions only.

## Publish the approved draft

1. Recheck affected sources for material changes since approval. If the text,
   target, or planned side effects need to change, present the revised proposal
   for approval. Apply the Markdown to the scoped file and follow the repository's
   publication policy. Verify that the stable GitHub link opens the approved
   text on the canonical branch before using it in Figma.
2. Attach the GitHub link as a Dev Resource on the verified UI Kit component or
   component set. Reuse a correct existing link. Read the resource back from the
   exact node and confirm the URL. Keep the full spec in Markdown.
3. If the approved scope includes retiring a legacy full-text annotation on
   that component, verify the Markdown, the Dev Resource, and the annotation's
   identity and unchanged content before removal. Remove only that annotation
   and read back the link and remaining annotations. Preserve the old
   annotation if either destination check fails or the annotation has changed.
4. If the approved spec requires a visual change, send the verified main chat
   the component link, the spec link, and the exact design changes. The message
   hands off the design implications and carries only the authority the user
   granted. Keep design edits and implementation in their owning workflows.
5. Report verified file, resource, annotation migration, and handoff results
   as applicable. On partial failure, state what succeeded and what remains.
   Inspect current state before retrying so the file, Dev Resource, or message
   is applied once.
