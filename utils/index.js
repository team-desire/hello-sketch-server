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

exports.isUserIdValid = (id) => {
  const validFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return validFormat.test(id);
};
