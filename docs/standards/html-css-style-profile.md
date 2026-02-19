# HTML/CSS Style Profile (Project Subset)

Source: `HTML CSS Style Guide original.md`  
Status: Project-enforceable subset for this repository.

## How To Use

- Use this file as the authoritative style reference in project docs/checklists.
- Reference rules by ID (for example: `HTML-004`, `CSS-007`).
- If a rule here conflicts with external guidance, this profile wins for this repo.

## Scope

- Applies to raw source HTML/CSS and CSS-like files in this repo.
- Applies to frontend templates, static pages, and style assets.
- Does not require preserving these conventions in minified/build output.

## General Rules

- [GEN-001] Use UTF-8 encoding.
- [GEN-002] Use 2-space indentation; do not use tabs.
- [GEN-003] Use lowercase for HTML tags/attributes and CSS selectors/properties/values (except string content).
- [GEN-004] Remove trailing whitespace.
- [GEN-005] Use HTTPS URLs for external assets where available.
- [GEN-006] Add comments only when needed for non-obvious intent.
- [GEN-007] Mark action items as `TODO: ...`.

## HTML Rules

- [HTML-001] Include `<!doctype html>` at the start of HTML documents.
- [HTML-002] Include `<meta charset="utf-8">` in HTML documents.
- [HTML-003] Prefer semantic elements for meaning (`h*`, `p`, `a`, etc.).
- [HTML-004] Keep structure separate from presentation and behavior:
  inline styles and inline event handlers are disallowed in app HTML.
- [HTML-005] Use meaningful `alt` text for informative images; use `alt=""` for decorative images.
- [HTML-006] Do not use `type` attributes on CSS/JS includes in HTML5 contexts.
- [HTML-007] Use double quotes for HTML attribute values.
- [HTML-008] Prefer classes for styling and `data-*` for scripting hooks.
- [HTML-009] Use `id` only when required; if used, include a hyphen in the value.
- [HTML-010] Put block/list/table elements on separate lines and indent child elements.

## CSS Rules

- [CSS-001] Use valid CSS syntax where practical.
- [CSS-002] Use meaningful class names; avoid presentational names.
- [CSS-003] Separate words in class names with hyphens.
- [CSS-004] Avoid ID selectors in styles.
- [CSS-005] Avoid qualifying class selectors with element selectors unless required.
- [CSS-006] Prefer shorthand properties where clarity is preserved.
- [CSS-007] Omit units on zero values when not required.
- [CSS-008] Use leading zero for fractional values (`0.8`, not `.8`).
- [CSS-009] Prefer 3-digit hex colors where equivalent (`#ebc`).
- [CSS-010] Do not use `!important` except for documented, approved exceptions.
- [CSS-011] End every declaration with a semicolon.
- [CSS-012] Use exactly one space after `:` in declarations.
- [CSS-013] Keep opening `{` on the same line as selector and include a space before `{`.
- [CSS-014] Put each selector and declaration on its own line.
- [CSS-015] Separate rules with one blank line.
- [CSS-016] Use single quotes in CSS strings/selectors when quoting is needed.
- [CSS-017] Do not quote `url(...)` values.

## Optional But Recommended

- [REC-001] Alphabetize declarations consistently if no automated sorter is configured.
- [REC-002] Group stylesheet sections with short section comments.

## Enforcement Notes

- Linting/formatting should align to this profile (`prettier`, `stylelint`, and HTML linting as applicable).
- CI checks should fail on violations of required rules (`GEN-*`, `HTML-*`, `CSS-*`).
