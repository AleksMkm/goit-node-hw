const exitCode = {
  success: 0,
  error: 1,
};

const handleError = err => {
  if (err) {
    console.error(err.message);
    process.exit(exitCode.error);
  }
};

module.exports = {
  exitCode,
  handleError,
};
