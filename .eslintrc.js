module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['off'],
        '@typescript-eslint/no-unused-vars': ['warn'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
};
