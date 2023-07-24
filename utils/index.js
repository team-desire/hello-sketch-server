const mongoose = require("mongoose");

exports.isPageValid = (page) => {
  const parsedPage = Number(page);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return false;
  }

  return true;
};

exports.isIdValid = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  return true;
};
