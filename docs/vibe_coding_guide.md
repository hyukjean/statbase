# Vibe Coding Guide for Statbase

This document elaborates on the principles of vibe coding and how to apply them when working on Statbase.

## What is Vibe Coding?

Vibe coding is a workflow where developers and large language models collaborate to build software quickly and safely.  Instead of writing code from scratch, you specify your intent, constraints, and evaluation criteria in natural language.  The LLM proposes code, which you run, inspect, and refine through short feedback loops.  This technique is ideal for prototyping UI components, generating boilerplate, and exploring design ideas.

## Core Principles

1. **Define the problem clearly**: Before asking an LLM for code, write a concise brief including:
   - The goal (what you want to build).
   - Constraints (framework, language, libraries, coding style).
   - Examples or reference designs.
   - Evaluation criteria (tests, behaviours).

2. **Work in small increments**: Break down features into small tasks.  Generate skeletons, run them, and refine.  Avoid giant, monolithic prompts.

3. **Enforce constraints in prompts**: Always remind the model about immutable requirements (e.g. "Use Next.js 15", "Do not import external libraries except MUI", "All dates must use KST").

4. **Write tests early**: Generate unit tests or sample data before the implementation.  Use them to check the generated code.

5. **Inspect outputs**: Read the code carefully, understand what it does, and run it.  Log requests and responses when calling APIs.  Track token usage and errors.

6. **Keep humans in the loop**: Use LLM output as a starting point.  Refactor, optimize, and secure it manually before shipping.

7. **Separate roles**: Use specialized prompt templates for different tasks (report generation, UI generation, data analysis).  Document them in `/prompts`.

8. **Maintain reproducibility**: Save the prompts and outputs used to generate code or reports.  Commit them along with tests so changes can be tracked and reproduced.

## Applying Vibe Coding to Statbase

- When adding a new UI component, start by writing a short design brief: what the component should look like, which MUI elements to use, and how it should behave.  Generate code, then manually adjust for accessibility and responsiveness.
- When expanding report generation logic, write a prompt describing the structure and content of the report.  Use examples from `prompts/evaluation.md` to test the agent.
- Always update the prompt templates when you refine requirements, and keep them version‑controlled.
- Use the test harness in `/tests` to add new unit tests for each generated component or logic.
- Keep logs of API calls and responses (see `src/lib/logger.ts`) to monitor performance and detect hallucinations.

Following these principles will help you achieve rapid iteration while maintaining high quality and reliability.