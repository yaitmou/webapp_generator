import chalk from "chalk";
import boxen from "boxen";
import log_symbols from "log-symbols";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";

// import log_update from "log-update";
// import figures from "figures";
// import ora from "ora";
// const logUpdate = require('log-update');
// const figures = require('figures');
// const indentString = require('indent-string');
// const cliTruncate = require('cli-truncate');
// const stripAnsi = require('strip-ansi');

const access = promisify(fs.access); // check the file access
const copy = promisify(ncp); // copy template files into our project

/**
 * Copy the predefined template into the current project dir
 * @param {object} options
 */
async function createInitFile(options) {
  // Create a new package.json file by running "npm init --yes"
  const package_content = initPackage(options);
  const init_file_path = path.resolve(options.targetDirectory, "package.json");
  try {
    await fs.writeFile(init_file_path, package_content, err => {
      if (err) {
        throw err;
      }
    });
  } catch (error) {
    console.log(error);
  }
  await copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
}

async function initGit(options) {
  try {
    await execa("git", ["init"], {
      cwd: options.targetDirectory
    });
  } catch (error) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

/**
 * This function is the one called from the cli.js. It's a sort of main funciton :p
 * @param {object} options
 */
export async function createWebProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  };
  // Get the current file url (this index.js)
  const currentFileUrl = import.meta.url;

  /**
   * Used when copying the template from a dir!!!
   * Basically it gets the template dir which should be at a known location
   * Here we are looking up for a folder called "javascript | typescript"
   */
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  // In case the template dir is not present!!!
  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }
  // If all's good
  const tasks = new Listr([
    {
      title: "Initializing project",
      task: () => createInitFile(options)
    },
    {
      title: "Installing dependencies",
      task: (ctx, task) => {
        task.output = "On it! Please wait a moment...";

        return execa("npm", ["install", "--loglevel=error"], {
          cwd: options.targetDirectory,
          stdio: "ignore"
        });
      },
      skip: () =>
        !options.runInstall
          ? "Manuall dependencies installation. run npm install"
          : undefined
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git
    }
  ]);

  await tasks.run();
  done_message(options);
  return true;
}

/**
 * Util functions
 */
function initPackage(options) {
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

function done_message(options) {
  let message;
  if (options.runInstall) {
    message =
      chalk.green.bold(`${log_symbols.success} DONE!`) +
      "\n\n\nStart your project by running:\n" +
      chalk.white.bold("npm run dev") +
      "\n\nBuild your project by running:\n" +
      chalk.white.bold("npm run build");
  } else {
    message =
      chalk.green.bold(`${log_symbols.success} DONE!`) +
      "\n\n\nInstall project dependencies by running:\n" +
      chalk.white.bold("npm install") +
      "\n\nStart your project by running:\n" +
      chalk.white.bold("npm run dev") +
      "\n\nBuild your project by running:\n" +
      chalk.white.bold("npm run build");
  }
  console.log(
    boxen(message, {
      padding: 1,
      margin: 2,
      borderStyle: "round",
      align: "left",
      float: "left"
    })
  );
}
