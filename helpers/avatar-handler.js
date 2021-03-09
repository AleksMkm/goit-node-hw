const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const { createFolterIfItDoesntExist } = require('./create-folder');

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const PUBLIC_DIR = process.env.PUBLIC_DIR;
const USER_AVATARS_DIR = path.join(PUBLIC_DIR, process.env.USER_AVATARS_DIR);

async function downloadAvatarFromUrl(user) {
  const avatarURL = user.avatarURL;
  const downloadedAvatar = await fetch(avatarURL);
  const downloadedAvatarBuffer = await downloadedAvatar.buffer();

  await fs.writeFile(
    path.join(UPLOAD_DIR, `${user.id}-avatar.jpg`),
    downloadedAvatarBuffer,
  );
}

async function saveAvatarToStatic(user) {
  await createFolterIfItDoesntExist(path.join(USER_AVATARS_DIR, user.id));
  await fs.rename(
    path.join(UPLOAD_DIR, `${user.id}-avatar.jpg`),
    path.join(USER_AVATARS_DIR, user.id, `${user.id}-avatar.jpg`),
  );
  const newAvatarUrl = path.normalize(
    path.join(
      'http://localhost:3000',
      process.env.USER_AVATARS_DIR,
      user.id,
      `${user.id}-avatar.jpg`,
    ),
  );
  return newAvatarUrl;
}

module.exports = {
  downloadAvatarFromUrl,
  saveAvatarToStatic,
};
