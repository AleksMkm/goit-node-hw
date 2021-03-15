const path = require('path');
require('dotenv').config();

const app = require('../app.js');

const db = require('../model/db');
const { createFolterIfItDoesntExist } = require('../helpers/create-folder');

const PORT = process.env.PORT || 3000;
console.log(PORT);

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOAD_DIR = process.env.UPLOAD_DIR;
    const PUBLIC_DIR = process.env.PUBLIC_DIR;
    const USER_AVATARS_DIR = path.join(
      PUBLIC_DIR,
      process.env.USER_AVATARS_DIR,
    );

    await createFolterIfItDoesntExist(UPLOAD_DIR);
    await createFolterIfItDoesntExist(PUBLIC_DIR);
    await createFolterIfItDoesntExist(USER_AVATARS_DIR);

    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server not running. Error message: ${err.message}`);
  process.exit(1);
});
