# book-notes-vault


A responsive, accessible, mobile-first single-page web application built with vabilla HTML5, CSS, and modern -JavaScript for students to track reding catalogs, log study notes, and monitor academic reading progress.

---

## Links & Deliverables

* **GitHub Repository:** (https://github.com/Roheya/book-notes-vault)
* **Demo Video (2-3min):**

---
## Table of Contents

-[Chosen Theme & Overview]
-[Features List]
-[Data Models & Unit Conversations]
-[Regex Catalog & Validation Rules]
-[Keyboard Navigation Map]
-[Accessibility & UX Notes]
-[Local Setup & Testing Guide]
-[CodeVibe Verification]
-[Academic Integrity]

---

## Chosen Theme & Overview

Selected Theme : Book Notes & Vault
Purpose: Provides a centralized, distraction-free environment for students to manage their reading materials, record insights, and maintain clear goals with reliable local storage and offline portability.

---

## Features List

1. **Semantic Sections & Mobile-First Layout:** Structured with clear landmark elements ('header', 'nav', 'main', 'section', 'footer') and responsive design scaling across Mobile (~360px), Tablet (768px), and Desktop(1024px+).
2. **Dynamic Dashboard & Stats:** Real-time metrics tracking total books, total pages read, top categorical tag, and a 7-day reading trend chart.
3. **Target Cap & ARIA Live Alerts:** Set a page reading cap; status messages broadcast dynamically via `aria-live` (`polite` under target, `assertive` when exceeded).
4. **Live Regex Search & Highlighting:** Real-time search with safe `try/catch` compilation, case-insensitive toggles, and non-destructive `<mark>` text matching.
5. **Persistence & Import/Export:** Automatic synchronization with browser `localStorage`, plus complete JSON export and schema-validated import capabilities.
6. **Unit Conversions:** Built-in conversion helper translating raw page counts into estimated reading durations (minutes/hours).

---

## Data Model & Unit Conversions

Each record in the application adheres strictly to this structure :

```json
{
  "id": "rec_0001",
  "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "author": "Robert C. Martin",
  "pages": 464,
  "tag": "Programming",
  "dateAdded": "2026-10-15",
  "createdAt": "2026-10-15T08:30:00.000Z",
  "updatedAt": "2026-10-15T08:30:00.000Z"
}



Unit Conversions Logic
Base Unit: Pages

Conversion Formula: Estimated Reading Time = Pages × 2 minutes (assuming an average reading pace of 250 words per page).




Regex Catalog & Validation Rules
Form Input Validation Rules (Minimum 4 Rules)
Title / Author (Whitespace Sanity):

Pattern: /^\S(?:.*\S)?$/

Description: Forbids leading or trailing whitespace and collapses double spaces.

Pages (Numeric Field):

Pattern: /^(0|[1-9]\d*)$/

Description: Ensures valid whole number page counts without malformed leading zeros.

Date Added (YYYY-MM-DD):

Pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

Description: Validates ISO calendar date formats.

Tag / Category:

Pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/

Description: Permits alphabetical characters separated by single spaces or hyphens.



Advanced Regex Rules
Duplicate Word Detection (Back-reference):

Pattern: /\b(\w+)\s+\1\b/i

Description: Identifies accidental duplicated words in titles or notes (e.g., "The The Book").



Accessibility & UX Notes
Semantic Hierarchy: Proper sequential heading structure (<h1> to <h3>) combined with standard landmark regions.

Focus States: High-contrast outline indicators explicitly defined on all interactive form inputs and controls.

ARIA Live Regions: Dynamic notifications utilize role="status" and aria-live attributes to alert screen reader users of updates.

Color Contrast: Meets or exceeds WCAG 2.1 AA standards across all text and background combinations.


Local Setup & Testing Guide

VS Code Live Server Extension (Recommended)
Open the project folder in VS Code.

Install the Live Server extension (by Ritwick Dey) from the Extensions view (Ctrl+Shift+X or Cmd+Shift+X).

Right-click index.html in the Explorer sidebar and select Open with Live Server (or click Go Live in the status bar).

The application will launch automatically in your browser at http://127.0.0.1:5500/index.html


