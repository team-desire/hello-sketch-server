const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const Sketch = require("../models/Sketch");
const Comment = require("../models/Comment");
const User = require("../models/User");

const { isPageValid, isIdValid } = require("../utils");
const { getPubObjectCommand, getS3Client } = require("../utils/s3Config");

const { NUMBER } = require("../constants/number");
const { TEXT } = require("../constants/text");
const { CONFIG } = require("../constants/config");

exports.getSketches = async (req, res, next) => {
  const perPage = req.query.per_page || NUMBER.DEFAULT_ITEMS_LIMIT;
  const page = req.query.page || NUMBER.DEFAULT_PAGE;

  if (isNaN(perPage) || isNaN(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  if (!isPageValid(perPage) || !isPageValid(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  try {
    const startIndex = (page - 1) * perPage;
    const totalItems = await Sketch.countDocuments({ isPublic: true });
    const totalPages = Math.ceil(totalItems / perPage);

    const sketchesUrl = await Sketch.find({ isPublic: true })
      .sort({ _id: 1 })
      .select({
        imageUrl: 1,
        _id: 0,
      })
      .limit(perPage)
      .skip(startIndex);

    res.json({
      status: TEXT.STATUS_OK,
      sketchesUrl: { totalItems, totalPages, list: sketchesUrl },
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

exports.getSketchDownloadUrl = async (req, res, next) => {
  const { sketch_id } = req.params;

  try {
    const sketch = await Sketch.findById(sketch_id);
    if (!sketch) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    res.json({
      status: TEXT.STATUS_OK,
      url: sketch.imageUrl,
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

exports.getSketch = async (req, res, next) => {
  const { userId, sketchId } = req.params;

  if (!isIdValid(userId) || !isIdValid(sketchId)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  try {
    const sketch = await Sketch.findById(sketchId).populate("comments");

    if (!sketch) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    res.json({
      status: TEXT.STATUS_OK,
      sketch,
    });
  } catch (error) {
    next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.BAD_REQUEST),
    );
  }
};

exports.createSketch = async (req, res, next) => {
  const { userId, sketchId } = req.params;

  if (!isIdValid(userId) || !isIdValid(sketchId)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  const { title, type, isPublic, image, comments } = req.body;

  if (!type || !isPublic || !image) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));
  }

  try {
    const user = await User.findOne({ email: userId });
    if (!user) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
      return;
    }

    if (!comments) {
      const sketch = new Sketch({
        userId: user._id,
        title,
        type,
        isPublic,
        imageUrl: "test",
      });
      await sketch.save();
      res.json({ status: TEXT.STATUS_OK, sketch });

      return;
    }
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
