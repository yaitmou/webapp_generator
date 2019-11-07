import boxen from "boxen";
import chalk from "chalk";
import arg from "arg";
import inquirer from "inquirer";
import { createWebProject } from "./main";
import clear from "clear";
/**
 * This function helps turning the raw args array into options
 * @param {array} rawArgs
 */
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--install": Boolean,
      "-i": "--install",
      "--yes": Boolean,
      "-y": "--yes",
      "--git": Boolean,
      "-g": "--git"
      // "--template": String,
      // "-t": "--template"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompt: args["--yes"] || false,
    runInstall: args["--install"] || false,
    git: args["--git"] || false,
    // template: args["--template"] || null,
    projectName: args._[0] || null
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "javascript";
  if (options.skipPrompt) {
    return;
  }

  const questions = [];

  questions.push({
    type: "input",
    name: "author",
    message: "Author name"
  });

  if (!options.projectName) {
    questions.push({
      type: "input",
      name: "projectName",
      message: "Enter a project name",
      default: "My-rocky-webapp"
    });
  }
  questions.push({
    type: "input",
    name: "projectDescription",
    message: "Project description"
  });
  // if (!options.template) {
  //   questions.push({
  //     type: "list",
  //     name: "template",
  //     message: "Which project template would you like to use",
  //     choices: ["javascript", "typescript"],
  //     default: defaultTemplate
  //   });
  // }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Would you like to init a git repository for this project",
      default: false
    });
  }

  questions.push({
    type: "confirm",
    name: "fontAwesome",
    message: "Would you like to use fontawesome for your icons",
    default: false
  });

  questions.push({
    type: "confirm",
    name: "installDependencies",
    message: "Install project dependencies",
    default: false
  });
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: defaultTemplate,
    git: options.git || answers.git,
    projectName: options.projectName || answers.projectName,
    projectDescription: answers.projectDescription || null,
    author: answers.author || null,
    fontAwesome: answers.fontAwesome,
    runInstall: options.runInstall || answers.installDependencies
  };
}

export async function cli(args) {
  clear();
  sayHello();
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  await createWebProject(options);
}

/**
 * Util functions
 */
function sayHello() {
  console.log(
    boxen(
      chalk.green.bold("Universal Web Project Builder") +
        "\n\n\nMade with love by:\nYounss Ait Mou (younss.aitmou@gmail.com)",
      {
        padding: 1,
        margin: 2,
        borderStyle: "round",
        align: "center",
        float: "center"
      }
    )
  );
}
