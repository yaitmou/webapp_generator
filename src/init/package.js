/**
 * This function builds the package.json file based on user inputs
 * @param {object} options contains user's inputs
 */
export function initPackage(options) {
  let package_template = `
    {
      "name": "${options.projectName || ""}",
      "version": "1.0.0",
      "description": "${options.projectDescription || ""}",
      "main": "index.js",
      "scripts": {
        "dev": "webpack-dev-server --open --config webpack.dev.js",
        "build": "webpack --config webpack.prod.js"
      },
      "author": "${options.author || ""}",
      "license": "MIT",
      "devDependencies": {
        "@babel/core": "^7.6.0",
        "@babel/preset-env": "^7.6.0",
        "autoprefixer": "^9.7.0",
        "babel-loader": "^8.0.6",
        "clean-webpack-plugin": "^3.0.0",
        "css-loader": "^3.0.0",
        "file-loader": "^4.2.0",
        "html-webpack-plugin": "^3.2.0",
        "image-webpack-loader": "^6.0.0",
        "postcss-loader": "^3.0.0",
        "precss": "^4.0.0",
        "sass": "^1.22",
        "sass-loader": "^8.0.0",
        "style-loader": "^0.23.1",
        "webpack": "^4.35.2",
        "webpack-cli": "^3.3.5",
        "webpack-dev-server": "^3.7.2",
        "webpack-merge": "^4.2.1"
      },
      "dependencies": {
        "@types/webpack-env": "^1.14.0"
      },
      "sideEffects": [
        "*.css"
      ]
    }
    `;
  return package_template;
}
