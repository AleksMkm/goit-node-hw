const fs = require('fs').promises;

async function doesFolderExist(path) {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

async function createFolterIfItDoesntExist(folder) {
  if (!(await doesFolderExist(folder))) {
    await fs.mkdir(folder);
  }
}

module.exports = { createFolterIfItDoesntExist };
