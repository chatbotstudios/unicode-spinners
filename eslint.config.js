import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['dist/', 'node_modules/', 'scripts/demo.cjs', 'scripts/manager.cjs', 'scripts/postinstall.cjs', 'tsup.config.ts']
  }
);
