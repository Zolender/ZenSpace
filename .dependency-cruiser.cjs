/**
 * Architecture boundaries from docs/architecture.md §4. A violation fails CI.
 * Rules match resolved file paths, so workspace packages resolve to packages/<name>/.
 */
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'packages-never-import-apps',
      severity: 'error',
      comment: 'Shared packages must not depend on any app.',
      from: { path: '^packages/' },
      to: { path: '^apps/' },
    },
    {
      name: 'domain-stays-pure',
      severity: 'error',
      comment: 'domain/ holds pure rules: no framework, database, queue, AI, or IO imports.',
      from: { path: '^apps/api/src/modules/[^/]+/domain/' },
      to: {
        path: [
          '(^|/)node_modules/(@nestjs|drizzle-orm|postgres|bullmq|ioredis|ai|@ai-sdk|@supabase)/',
          '^packages/(db|ai)/',
        ],
      },
    },
    {
      name: 'domain-no-node-io',
      severity: 'error',
      comment: 'domain/ must not touch the filesystem, network, or processes.',
      from: { path: '^apps/api/src/modules/[^/]+/domain/' },
      to: {
        dependencyTypes: ['core'],
        path: '^(node:)?(fs|fs/promises|net|http|https|child_process|dgram|dns|tls)$',
      },
    },
    {
      name: 'modules-talk-through-index',
      severity: 'error',
      comment: 'Another module may only be imported through its index.ts.',
      from: { path: '^apps/api/src/modules/([^/]+)/' },
      to: {
        path: '^apps/api/src/modules/[^/]+/',
        pathNot: ['^apps/api/src/modules/$1/', '^apps/api/src/modules/[^/]+/index\\.ts$'],
      },
    },
    {
      name: 'clients-never-import-db-or-ai',
      severity: 'error',
      comment: 'Web and mobile talk to the API only. They never reach the database or AI directly.',
      from: { path: '^apps/(web|mobile)/' },
      to: { path: ['^packages/(db|ai)/', '(^|/)node_modules/@carrel/(db|ai)/'] },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)(dist|\\.next|coverage|\\.turbo)/' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.depcruise.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json'],
    },
  },
};
