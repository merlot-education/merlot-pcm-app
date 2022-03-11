module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'prettier',
    'prettier/react',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    ],
    'no-use-before-define': 'off',
    'import/extensions': ['error', 'never'],
    'import/no-unresolved': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/prop-types': 'off', // Since we do not use prop-types
    'react/require-default-props': 'off', // Since we do not use prop-types
    'no-shadow': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-underscore-dangle': 'off',
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-unused-class-component-methods': 'off',
    'react/no-access-state-in-setstate': 'off',
    'no-unused-expressions': 'off',
    'no-return-assign': 'off',
    'react/no-array-index-key': 'off',
    'react/self-closing-comp': 'error',
    'react/no-unstable-nested-components': 'off',
  },
}
