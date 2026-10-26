Read the complete AKM Auto Consult project documentation before implementing anything.

Start with:
- AGENTS.md
- MEMORY.md
- WIKI.md
- PRD.md
- TODO.md
- All documents under docs/

Your task is to implement the AKM Auto Consult platform according to these specifications.

Begin with Phase 0 and Phase 1 of TODO.md, following agent-org-plan.md milestones (M1 scaffold; M2 auth gate; M3A/M3B/M3C parallel; M4 claims gate; M5 AI; M6 estimates; M7 deploy gate). Confirm sections if unclear; apply best recommendations by default.

Before installing dependencies:
1. Verify the latest stable and supported versions of Next.js, React, TypeScript, Tailwind CSS, PostCSS, MySQL-compatible ORM, authentication dependencies and other required packages.
2. Verify compatibility with the Next.js App Router.
3. Pin dependencies and generate a lockfile.
4. Establish environment validation and secure configuration.

Do not implement the entire system in one unreviewed generation.

Work incrementally. Implement one coherent module at a time, test it, update TODO.md, and proceed to the next module.

Security, authentication, authorization, data isolation, and database integrity must be established before implementing business-facing CRUD interfaces.

Do not use hardcoded secrets, database credentials, application names, port numbers, or production configuration values.

Follow the project documentation as the source of truth. If a requirement is ambiguous, document the decision and ask for clarification rather than inventing business rules.