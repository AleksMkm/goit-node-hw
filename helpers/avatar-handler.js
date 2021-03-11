const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const fileType = require('file-type');
const Jimp = require('jimp');
require('dotenv').config();

const { createFolterIfItDoesntExist } = require('./create-folder');

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const PUBLIC_DIR = process.env.PUBLIC_DIR;
const USER_AVATARS_DIR = path.join(PUBLIC_DIR, process.env.USER_AVATARS_DIR);

async function downloadAvatarFromUrl(user) {
  const avatarURL = user.avatarURL;
  // fetching image as buffer from gravatar
  const downloadedAvatar = await fetch(avatarURL);
  const downloadedAvatarBuffer = await downloadedAvatar.buffer();
  // getting image type from buffer
  const type = await fileType.fromBuffer(downloadedAvatarBuffer);
  const fileName = `${user.id}.${type.ext}`;
  const tmpPath = path.join(UPLOAD_DIR, fileName);
  // saving image to tmp
  await fs.writeFile(tmpPath, downloadedAvatarBuffer);
  return { tmpPath, fileName };
}

async function saveAvatarToStatic(userId, pathToFile, fileName) {
  // editing photo to match our standard
  const img = await Jimp.read(pathToFile);
  await img
    .autocrop()
    .cover(150, 150, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathToFile);
  // creating folder in public/images if it does not exist yet
  await createFolterIfItDoesntExist(path.join(USER_AVATARS_DIR, userId));
  // moving edited file to public/images/:id
  await fs.rename(pathToFile, path.join(USER_AVATARS_DIR, userId, fileName));
  // composing url to save in our db
  const newAvatarUrl = path.normalize(path.join(userId, fileName));
  return newAvatarUrl;
}

async function deletePreviousAvatar(prevAvatar) {
  const PUBLIC_DIR = process.env.PUBLIC_DIR;
  const USER_AVATARS_DIR = path.join(PUBLIC_DIR, process.env.USER_AVATARS_DIR);
  try {
    await fs.unlink(path.join(process.cwd(), USER_AVATARS_DIR, prevAvatar));
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = {
  downloadAvatarFromUrl,
  saveAvatarToStatic,
  deletePreviousAvatar,
};
