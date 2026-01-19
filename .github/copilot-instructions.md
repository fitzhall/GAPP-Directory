# GitHub Copilot Instructions - GAPP Directory

## Required Reading
Before making any code changes, **read the CLAUDE.md file** at the project root:

```
./CLAUDE.md
```

This file contains:
- Complete database schema
- Project architecture
- API documentation
- Common patterns and best practices
- Configuration guidelines

## Quick Reference
- **Database:** Supabase PostgreSQL with RLS
- **Framework:** Next.js 14.2.5 (App Router)
- **Styling:** Tailwind CSS
- **Config:** All settings in `lib/config.ts`
- **Types:** Defined in `types/provider.ts`

## Development Rules
1. Always read CLAUDE.md first for context
2. Use TypeScript strict mode
3. Server Components by default
4. Query providers using GIN array operators (.contains())
5. Never hardcode counties or service types (use lib/config.ts)
