export function buildEditSuggestionUrl(term) {
  const titleParts = [
    "Revision:",
    term.english || term.spanish || "Untitled term",
  ];

  const title = titleParts.join(" ");

  const body = [
    "## Term to be revised",
    "",
    `**ID:** ${term.id}`,
    `**English:** ${term.english || "—"}`,
    `**Spanish:** ${term.spanish || "—"}`,
    "",
    "## Current entry details",
    "",
    `**English definition:** ${term.englishDefinition || "—"}`,
    `**Spanish definition:** ${term.spanishDefinition || "—"}`,
    `**Comments:** ${term.comments || "—"}`,
    `**Category:** ${term.category?.length ? term.category.join(", ") : "—"}`,
    `**Tags:** ${term.tags?.length ? term.tags.join(", ") : "—"}`,
    `**Aliases:** ${term.aliases?.length ? term.aliases.join(", ") : "—"}`,
    `**Status:** ${term.status || "—"}`,
    `**Last updated:** ${term.lastUpdated || "—"}`,
    `**Source:** ${term.source || "—"}`,
    `**Proposals:** ${term.proposals || "—"}`,
    "",
    "## Suggested revision",
    "",
    "[Describe the change you want to make here.]",
    "",
    "## Reason / notes",
    "",
    "[Add context, rationale, source citation, or usage note here.]",
  ].join("\n");

  const params = new URLSearchParams({
    title,
    body,
    labels: "revision",
  });

  return `https://github.com/mapachurro/eoir-glossary/issues/new?${params.toString()}`;
}