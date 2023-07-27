const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const { getS3Client, getListObjectsCommand } = require("../utils/s3Config");
const { isPageValid } = require("../utils");

const { TEXT } = require("../constants/text");
const { CONFIG } = require("../constants/config");
const { OPTIONS } = require("../constants/options");
const { NUMBER } = require("../constants/number");

exports.getUnits = async (req, res, next) => {
  const { per_page, page, unitType, sketchType } = req.query;

  if (isNaN(per_page) || isNaN(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  if (!isPageValid(per_page) || !isPageValid(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  if (!unitType || !OPTIONS.UNIT_TYPE.has(unitType)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  const perPageNumber = Number(per_page) || NUMBER.DEFAULT_ITEMS_LIMIT;
  const pageNumber = Number(page) || NUMBER.DEFAULT_PAGE;

  try {
    const objects = await getS3Objects(sketchType, unitType);

    const startIndex = (pageNumber - 1) * perPageNumber;
    const endIndex = startIndex + perPageNumber;

    const totalItems = objects.length;
    const totalPages = Math.ceil(totalItems / perPageNumber);

    const slicedObjects = objects.slice(startIndex, endIndex);

    res.json({
      status: TEXT.STATUS.OK,
      units: {
        totalItems,
        totalPages,
        list: slicedObjects,
      },
    });
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};

const getS3Objects = async (sketchType, unitType) => {
  const s3Client = getS3Client();

  const listObjectsCommand = getListObjectsCommand(
    CONFIG.AWS_S3_BUCKET_NAME,
    `units/${sketchType}/${unitType}/`,
    "/",
  );

  const objects = await s3Client.send(listObjectsCommand);

  const filteredObjects = objects.Contents.filter(
    (item) => !item.Key.endsWith("/"),
  ).map((item) => ({
    url: `https://${CONFIG.AWS_S3_BUCKET_NAME}.s3.${CONFIG.AWS_S3_REGION}.amazonaws.com/${item.Key}`,
  }));

  return filteredObjects;
};
