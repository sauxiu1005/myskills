# Contributing

Thanks for helping improve `ecommerce-visual-copywriting-skill`. This project is a practical AI agent skill for e-commerce visual copywriting, product-detail-page planning, and compliance-aware output review.

The project welcomes issues and pull requests, especially when they make the workflow more useful, safer, easier to understand, or easier to reuse in different AI tools.

## What You Can Contribute

Useful contributions include:

- Better examples for common e-commerce categories.
- Safer wording for risky advertising or compliance-sensitive claims.
- Platform-specific review notes for Taobao, Tmall, JD, Pinduoduo, Douyin Shop, and other marketplaces.
- Improvements to the 6-step workflow in `SKILL.md`.
- Improvements to `references/compliance-rules.md`.
- Documentation fixes, clearer installation steps, and translations.
- Test cases that show where the skill produces unclear, overlong, or risky output.

## Before Opening an Issue

Please include enough context for maintainers to reproduce or evaluate the problem.

For copywriting or output-quality issues, include:

- Product category.
- Product information used as input.
- The output that looked wrong or risky.
- Why the output should be changed.
- The safer wording or structure you recommend, if you have one.

For compliance-rule suggestions, include:

- The category or platform affected.
- The exact rule or wording you want changed.
- A source, policy reference, screenshot, or real-world example when possible.
- Whether the change is a strict rule, a recommendation, or a style preference.

## Pull Request Guidelines

A good pull request should be focused. Please avoid mixing unrelated changes in one PR.

Recommended PR structure:

1. Explain what problem the PR solves.
2. List the files changed.
3. Explain how the change affects the skill output.
4. Include an example input/output when the change affects behavior.
5. Mention any compliance source or platform policy used.

## Review Checklist

Maintainers will usually check:

- Does the change improve practical usefulness?
- Does it keep the output concise enough for real product images?
- Does it avoid unsupported health, medical, absolute, or exaggerated claims?
- Does it preserve the project structure: scene, in-image copy, and design guidance?
- Does it make the rule library easier to maintain?
- Does it avoid turning the project into legal advice?

## Compliance Boundary

This repository provides workflow guidance and copywriting rules for AI-assisted drafting. It is not legal advice.

When adding compliance rules:

- Prefer verifiable sources and real platform policies.
- Do not claim that a phrase is always legal or always illegal without context.
- Mark uncertain suggestions as recommendations instead of hard rules.
- Keep product claims tied to evidence such as certificates, test reports, or approved qualification documents.

## Writing Style

Please keep documentation:

- Direct and practical.
- Easy for non-technical e-commerce operators to follow.
- Specific enough for AI agents to execute.
- Clear about required user inputs and output format.
- Free of exaggerated marketing language.

## License

By contributing, you agree that your contribution will be released under the same MIT License as this repository.
