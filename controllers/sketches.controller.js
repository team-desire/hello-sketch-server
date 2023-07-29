const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const Sketch = require("../models/Sketch");
const User = require("../models/User");

const { isPageValid, isIdValid, isUserIdValid } = require("../utils");
const { getS3Client, getPutObjectCommand } = require("../utils/s3Config");

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
      status: TEXT.STATUS.OK,
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
      status: TEXT.STATUS.OK,
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

  if (!isUserIdValid(userId) || !isIdValid(sketchId)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  try {
    const sketch = await Sketch.findById(sketchId);

    if (!sketch) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    res.json({
      status: TEXT.STATUS.OK,
      sketch,
    });
  } catch (error) {
    next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.BAD_REQUEST),
    );
  }
};

exports.createSketch = async (req, res, next) => {
  const { userId } = req.params;

  if (!isUserIdValid(userId)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  const { title, type, isPublic, image } = req.body;

  if (!type || !isPublic || !image) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));
  }

  try {
    const user = await User.findOne({ email: userId });
    if (!user) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    const saveSketch = async () => {
      try {
        const s3Client = getS3Client();
        const buffer = Buffer.from(image, "base64");

        const imageId = new Date().toISOString();
        const imageFileName = `sketches/${user._id}/${imageId}.png`;

        const putObjectCommand = getPutObjectCommand(
          CONFIG.AWS_S3_BUCKET_NAME,
          imageFileName,
          buffer,
        );
        await s3Client.send(putObjectCommand);

        const sketch = new Sketch({
          userId: user._id,
          title,
          type,
          isPublic,
          imageUrl: `https://${CONFIG.AWS_S3_BUCKET_NAME}.s3.${CONFIG.AWS_S3_REGION}.amazonaws.com/${imageFileName}`,
        });

        await sketch.save();

        res.json({ status: TEXT.STATUS_OK, sketch });
      } catch (error) {
        next(
          createError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ReasonPhrases.INTERNAL_SERVER_ERROR,
          ),
        );

        return;
      }
    };

    saveSketch();
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};

exports.getUserSketches = async (req, res, next) => {
  const { per_page = NUMBER.DEFAULT_ITEMS_LIMIT, page = NUMBER.DEFAULT_PAGE } =
    req.query;

  const { userId } = req.params;

  if (isNaN(per_page) || isNaN(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  if (!isPageValid(per_page) || !isPageValid(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  if (!isUserIdValid(userId)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  try {
    const user = await User.findOne({ email: userId });

    if (!user) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    const perPageNumber = Number(per_page) || NUMBER.DEFAULT_ITEMS_LIMIT;
    const pageNumber = Number(page) || NUMBER.DEFAULT_PAGE;

    const startIndex = (pageNumber - 1) * perPageNumber;
    const endIndex = startIndex + perPageNumber;

    const getSketches = async () => {
      try {
        const sketches = await Sketch.find({ userId: user._id });

        const totalItems = sketches.length;
        const totalPages = Math.ceil(totalItems / perPageNumber);

        const sliceSketches = sketches.slice(startIndex, endIndex);
        const sliceSketchesUrls = sliceSketches.map((sketch) => ({
          url: sketch.imageUrl,
        }));

        res.json({
          status: TEXT.STATUS.OK,
          sketches: {
            totalPages,
            list: sliceSketchesUrls,
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

    getSketches();
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
