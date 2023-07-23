exports.isPageValid = (page) => {
  const parsedPage = Number(page);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return false;
  }

  return true;
};
