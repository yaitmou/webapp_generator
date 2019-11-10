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
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompt: args["--yes"] || false,
    runInstall: args["--install"] || false,
    git: args["--git"] || false,
    projectName: args._[0] || null
  };
}

async function promptForMissingOptions(options) {
  // TODO: Add support for more templates
  const defaultTemplate = "javascript";
  if (options.skipPrompt) {
    return;
  }

  // Init questions
  const questions = [];

  //
  // Project name
  //
  if (!options.projectName) {
    questions.push({
      type: "input",
      name: "projectName",
      message: "Enter a project name",
      default: "My-rocky-webapp"
    });
  }

  //
  // Project description
  //
  questions.push({
    type: "input",
    name: "projectDescription",
    message: "Project description"
  });

  //
  // Author name
  //
  questions.push({
    type: "input",
    name: "author",
    message: "Author name"
  });

  //
  // Init git
  //
  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Would you like to init a git repository for this project",
      default: false
    });
  }

  //
  // Add fontawesome to the project
  // TODO: add support for other fonts libraries
  //
  questions.push({
    type: "confirm",
    name: "fontAwesome",
    message: "Would you like to use fontawesome for your icons",
    default: false
  });

  //
  // Install project dependencies
  //
  questions.push({
    type: "confirm",
    name: "installDependencies",
    message: "Install project dependencies",
    default: false
  });

  // Ask questions
  const answers = await inquirer.prompt(questions);

  //
  // Return an object that contains all user preferences
  //
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

/**
 * Fires first!
 * @param {String[]} args
 */
export async function cli(args) {
  clear();
  intro_message();
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);

  await createWebProject(options);
}

/**
 * A fancy way of saying Hi! :p
 */
function intro_message() {
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
