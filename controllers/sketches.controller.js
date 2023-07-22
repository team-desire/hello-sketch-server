const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const Sketch = require("../models/Sketch");
const { NUMBER } = require("../constants/number");
const { TEXT } = require("../constants/text");

exports.getSketches = async (req, res, next) => {
  const perPage = req.query.per_page || NUMBER.DEFAULT_PER_PAGE;
  const page = req.query.page || NUMBER.DEFAULT_PAGE;

  if (isNaN(perPage) || isNaN(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));
    return;
  }

  try {
    const startIndex = (page - 1) * perPage;
    const totalItems = await Sketch.countDocuments({ isPublic: true });

    const sketchesUrl = await Sketch.find({ isPublic: true })
      .sort({ _id: 1 })
      .select({
        imageUrl: 1,
        _id: 0,
      })
      .limit(perPage)
      .skip(startIndex);

    res.json({
      status: TEXT.OK,
      sketchesUrl: { totalItems, list: sketchesUrl },
    });
  } catch (err) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
