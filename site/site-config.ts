import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: 'civility-kernel',
  description: 'A policy layer that makes agent behavior preference-governed instead of purely efficiency-maximizing.',
  logoBadge: '🛡',
  brandName: 'civility-kernel',
  repoUrl: 'https://github.com/mcp-tool-shop-org/civility-kernel',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/civility-kernel',
  footerText: 'MIT Licensed',

  hero: {
    badge: 'Open source',
    headline: 'Agents with',
    headlineAccent: 'boundaries.',
    description: 'A modular policy layer for agent behavior. Hard constraints filter. Soft preferences score. Uncertainty asks. Nothing changes silently.',
    primaryCta: { href: '#usage', label: 'Get started' },
    secondaryCta: { href: '#features', label: 'See how it works' },
    previews: [
      { label: 'Install', code: 'npm i @mcptoolshop/civility-kernel' },
      { label: 'Import', code: "import { lintPolicy, canonicalizePolicy, diffPolicy } from '@mcptoolshop/civility-kernel';" },
      { label: 'Use', code: "const issues = lintPolicy(policy, { registry });\nconst canonical = canonicalizePolicy(policy, registry);\nconst diff = diffPolicy(prev, canonical, { mode: 'short' });" },
    ],
  },

  sections: [
    {
      kind: 'features',
      id: 'features',
      title: 'Four things, reliably',
      subtitle: 'The boring safety machinery that lets you build agents with boundaries.',
      features: [
        {
          title: 'Lint',
          desc: 'Catch broken or unsafe policy configs before they ship. Fail-closed with actionable error messages.',
        },
        {
          title: 'Canonicalize',
          desc: 'Equivalent inputs produce identical output. Defaults filled via Zod, keys deterministically ordered — no noisy diffs.',
        },
        {
          title: 'Diff + approve',
          desc: 'Human-readable change summaries with explicit consent required before anything applies. Short or full mode.',
        },
        {
          title: 'Rollback',
          desc: 'The previous policy is automatically backed up before any overwrite. One flag to restore it.',
        },
        {
          title: 'Parameterized constraints',
          desc: 'Constraints accept typed parameters validated by Zod. Misconfigured constraints fail closed, not silently.',
        },
        {
          title: 'Human governance loop',
          desc: 'preview → propose → explicit approval → apply. Your agent cannot update its own policy without showing you first.',
        },
      ],
    },
    {
      kind: 'code-cards',
      id: 'usage',
      title: 'Usage',
      subtitle: 'From install to a governed agent in minutes.',
      cards: [
        {
          title: 'Install',
          code: 'npm i @mcptoolshop/civility-kernel',
        },
        {
          title: 'Lint a policy',
          code: `import { lintPolicy } from '@mcptoolshop/civility-kernel';

const issues = lintPolicy(myPolicy, { registry });
// issues: { valid: boolean; errors: string[] }`,
        },
        {
          title: 'Diff before applying',
          code: `import { canonicalizePolicy, diffPolicy } from '@mcptoolshop/civility-kernel';

const canonical = canonicalizePolicy(proposed, registry);
const diff = diffPolicy(current, canonical, { mode: 'short' });
// diff: human-readable change summary`,
        },
        {
          title: 'Explain a policy',
          code: `import { explainPolicy } from '@mcptoolshop/civility-kernel';

const doc = explainPolicy(policy, registry, { format: 'markdown' });
// doc: readable policy contract for humans`,
        },
        {
          title: 'CLI: governance loop',
          code: `# Preview the policy contract
npm run policy:explain

# Propose an update (diff + approval prompt)
npm run policy:propose

# Canonicalize in place
npm run policy:canonicalize`,
        },
      ],
    },
    {
      kind: 'api',
      id: 'api',
      title: 'Public API',
      subtitle: 'Four focused functions. No magic.',
      apis: [
        {
          signature: 'lintPolicy(policy, { registry, scorers? })',
          description: 'Validate a policy against registered constraints. Returns errors with field-level context. Fail-closed on unknown constraint types.',
        },
        {
          signature: 'canonicalizePolicy(policy, registry, scorers?)',
          description: 'Normalize a policy to its canonical form — fills defaults, sorts keys deterministically. Idempotent.',
        },
        {
          signature: 'diffPolicy(a, b, { mode })',
          description: 'Compare two canonical policies. mode: "short" shows headline changes; mode: "full" shows every field.',
        },
        {
          signature: 'explainPolicy(policy, registry, { format })',
          description: 'Render a human-readable description of what a policy does and why. format: "text" | "markdown".',
        },
      ],
    },
  ],
};
