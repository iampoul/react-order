# Contributing

Thanks for contributing to `@iampoul/react-order`.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
```

## Local demo

```bash
npm run demo:dev
```

## Release process

1. Add a changeset for user-facing changes:

   ```bash
   npx changeset
   ```

2. Merge to `main`.
3. The release workflow opens/updates a version PR and publishes to npm after merge.
