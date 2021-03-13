const downloadAvatarFromUrl = jest.fn(user => {
  const fileName = `mock name`;
  const tmpPath = 'mock path to file';
  return { tmpPath, fileName };
});

const saveAvatarToStatic = jest.fn((userId, pathToFile, fileName) => {
  const newAvatarUrl = 'mock path to URL';
  return newAvatarUrl;
});

const deletePreviousAvatar = jest.fn(prevAvatar => {});

module.exports = {
  downloadAvatarFromUrl,
  saveAvatarToStatic,
  deletePreviousAvatar,
};
