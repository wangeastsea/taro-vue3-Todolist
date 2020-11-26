// ESLint 检查 .vue 文件需要单独配置编辑器：
// https://eslint.vuejs.org/user-guide/#editor-integrations
module.exports = {
  'extends': ['taro/vue3','@vue/prettier'],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    // 开启 console
    'no-console': 'off',
    'no-useless-catch': 'off',
    'no-async-promise-executor': 'off',
    'no-unused-vars': 'off',
        // prettier配置
    'prettier/prettier': [
        'error',
        {
            singleQuote: true, //单引号
            tabWidth: 4, // tab是4个空格
            semi: false // 不要分号结尾
        }
    ],
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
}
