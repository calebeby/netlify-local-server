module.exports = require('babel-jest').createTransformer({
  // Need to tranform es6 import into require() for jest to run it
  // This extends ./.babelrc.js
  plugins: ['@babel/transform-modules-commonjs'],
})
