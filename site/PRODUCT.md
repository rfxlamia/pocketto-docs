# Pocketto

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Pocketto documents an engineering workflow for AI coding agents, with durable artifacts, independent reviews, and explicit human approval. The website helps developers understand the workflow, choose an appropriate entry point, and find the relevant documentation.

## Users

Developers evaluating Pocketto for Claude Code or Pi, including people arriving with a rough idea, a clear problem, an approved specification, an execution plan, structured tasks, or a passing phase.

## Capabilities and Constraints

The six stages are Pitching, Grinding, Planning, Structuring, Development, and Closing. A visitor can enter at the stage matching the artifacts they already have. Small changes and bugs also have standalone workflows. Marketing demonstrations illustrate the workflow; they do not execute skills or authorize work on a visitor's project.

## Evidence on Hand

- `lib/site.ts`: centralized release and pipeline facts.
- `content/docs/getting-started/choosing-workflow.mdx`: entry-point routing.
- `content/docs/pipeline/`: stage prerequisites, artifacts, and approval rules.
- `../reference/pocketto/skills/`: canonical skill sources.

## Confirmed Surface Goal

The user selected helping visitors choose their starting stage as the priority, with an interactive input-to-output demonstration as supporting proof. Each example compares the selected stage's concrete request or prerequisite artifact with its own output. Input remains visible; approval and next-stage rules are supporting context. They authorized the full implementation and substantial redesign where useful. Existing product facts and approval boundaries remain authoritative.
