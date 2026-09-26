import { danger, warn, fail, message } from "danger";

const hasPRDescription = danger.github.pr.body && danger.github.pr.body.length > 10;
if (!hasPRDescription) {
    warn("Plese add small explanation about this PR (PR Description) ?")
}

const bigPRThreshold = 500;
const changeCount = danger.github.pr.additions + danger.github.pr.deletions;
if (changeCount > bigPRThreshold) {
    warn(`This PR size is to much (+${changeCount}lines.) for Easy Code review send a small PR!`);
}

const packageChanged = danger.git.modified_files.includes("package.json");
const lockfileChanged = danger.git.modified_files.includes("package-lock.json");

if (packageChanged && lockfileChanged) {
    fail("`package.json` has been changed but`package-lock.json` has not been updated.Please run`npm install` and commit.");
}

message("Automated Checks Complete! Ready for Code Review.")