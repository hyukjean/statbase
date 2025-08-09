# User Prompt Template: Generate Report

## Inputs:

- **question**: the user’s natural language question about macroeconomics or finance.
- **startDate** (optional): ISO date (YYYY-MM-DD) for the beginning of the analysis period.
- **endDate** (optional): ISO date for the end of the analysis period.

## Instructions:

Using the system prompt, generate a complete multi‑section report that answers **{question}** between **{startDate}** and **{endDate}**.  If dates are not provided, assume the last 365 days and clearly state this assumption.  Include relevant charts, comparisons, and context.  Output should be valid Markdown with headings, numbered chapters, and bullet points where appropriate.