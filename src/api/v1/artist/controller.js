/* eslint-disable camelcase */
const httpStatus = require('http-status');
const sharp = require('sharp');
const Artist = require('./model');

exports.artistOnboarding = async (req, res, next) => {
  try {
    const {
      social_token_id, wallet_id, social_token_name, social_token_symbol,
    } = req.body;
    // const existingArtist = await Artist.findOne({ $or: [{ social_token_id }, { wallet_id }] });

    let existingArtist = await Artist.findOne({ social_token_id });

    if (existingArtist) {
      return res.status(httpStatus.BAD_REQUEST).json({
        code: httpStatus.BAD_REQUEST,
        message: 'Existing token',
      });
    }

    existingArtist = await Artist.findOne({ wallet_id });

    if (existingArtist) {
      return res.status(httpStatus.BAD_REQUEST).json({
        code: httpStatus.BAD_REQUEST,
        message: 'Existing wallet',
      });
    }

    existingArtist = await Artist.findOne({ social_token_name });

    if (existingArtist) {
      return res.status(httpStatus.BAD_REQUEST).json({
        code: httpStatus.BAD_REQUEST,
        message: 'Existing social token name',
      });
    }

    existingArtist = await Artist.findOne({ social_token_symbol });

    if (existingArtist) {
      return res.status(httpStatus.BAD_REQUEST).json({
        code: httpStatus.BAD_REQUEST,
        message: 'Existing social token symbol',
      });
    }

    const profilepic = req.files.profile[0];
    const bannerpic = req.files.banner[0];
    const profilepicname = `${req.body.wallet_id}_profilepic.jpeg`;
    const bannerpicname = `${req.body.wallet_id}_bannerpic.jpeg`;

    await sharp(profilepic.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${__dirname}/../../../images/${profilepicname}`);

    await sharp(bannerpic.buffer)
      .resize(1266, 530)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${__dirname}/../../../images/${bannerpicname}`);

    req.body.profile_image = profilepicname;
    req.body.banner_image = bannerpicname;
    const newArtist = new Artist(req.body);

    await newArtist.save();

    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      message: 'Artist onboarded Successfully',
      artist: newArtist,
    });

    // return res.status(httpStatus.CREATED).json({
    //   code: httpStatus.CREATED,
    //   message: 'HIII',
    // });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

exports.getAllArtists = async (req, res, next) => {
  try {
    const allArtists = await Artist.find({});

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'All Artists',
      artists: allArtists,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getArtistById = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.body.id);

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      artist,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateArtist = async (req, res, next) => {
  try {
    const { id } = req.body;
    const updatedArtist = await Artist.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Artist Updated',
      artist: updatedArtist,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getLabels = async (req, res, next) => {
  try {
    const labels = await Artist.find().distinct('label');

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      labels,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getLabelArtists = async (req, res, next) => {
  try {
    const { label } = req.body;
    const labelArtists = await Artist.find({ label });

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      labelArtists,
    });
  } catch (error) {
    return next(error);
  }
};
