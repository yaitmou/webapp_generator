import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { initGit } from "./init/git";
import { initPackage } from "./init/package";
import { done_message } from "./utils";

const access = promisify(fs.access);
const copy = promisify(ncp);

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
  const tasks = new Listr([
    {
      title: "Initializing project",
      task: () => createInitFile(options)
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git
    },
    {
      title: "Installing dependencies",
      task: (ctx, task) => {
        task.output = `On it! Please wait a moment...`;

        return execa("npm", ["install", "--loglevel=error"], {
          cwd: options.targetDirectory,
          stdio: "ignore"
        });
      },
      skip: () =>
        !options.runInstall
          ? "You have to manually install project dependencies by runing 'npm install'"
          : undefined
    }
  ]);

  await tasks.run();
  done_message(options);
  return true;
}

/**
 * Copy the predefined template into the current project dir
 * @param {object} options These options are built based on user choices
 */
async function createInitFile(options) {
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
