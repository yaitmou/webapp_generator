import boxen from "boxen";
import log_symbols from "log-symbols";
import chalk from "chalk";

/**
 * A fancy way of saying by :p
 * @param {object} options
 */
export function done_message(options) {
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
      float: "center"
    })
  );
}
