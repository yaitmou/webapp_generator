import execa from "execa";

export async function initGit(options) {
  try {
    await execa("git", ["init"], {
      cwd: options.targetDirectory
    });
  } catch (error) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}
