module.exports = {
  parser: 'vue-eslint-parser',
  // parser: '@typescript-eslint/parser',
  // plugins: ['@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-recommended',
    // 'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    // parser: 'vue-eslint-parser', // Specifies the ESLint parser
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true
    }
  },
  rules: {
    'vue/no-setup-props-destructure': 0, // 0 = off, 1 = warn, 2 = error
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: false, // 未尾逗号
        vueIndentScriptAndStyle: true,
        singleQuote: true, // 单引号
        quoteProps: 'as-needed',
        bracketSpacing: true,
        trailingComma: 'none', // 未尾分号
        jsxBracketSameLine: false,
        jsxSingleQuote: false,
        arrowParens: 'avoid',
        insertPragma: false,
        requirePragma: false,
        proseWrap: 'never',
        htmlWhitespaceSensitivity: 'strict',
        endOfLine: 'lf'
      }
    ]
  }
}
