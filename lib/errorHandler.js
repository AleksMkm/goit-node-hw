export const exitCode = {
  success: 0,
  error: 1,
};

export const handleError = err => {
  if (err) {
    console.error(err.message);
    process.exit(exitCode.error);
  }
};
