const express = require('express');
const { validate } = require('express-validation');
const multer = require('multer');

const {
  artistOnboarding, getAllArtists, updateArtist, getArtistById, getLabels, getLabelArtists,
} = require('./controller');
const {
  artistOnboardingPayload, updateArtistPayload, getAllArtistsPayload, getArtistByIdPayload,
} = require('./validation');

const routes = express.Router();
const upload = multer();
const onBoardingImages = [{
  name: 'profile', maxCount: 1,
}, {
  name: 'banner', maxCount: 1,
}];

routes
  .post('/onboarding', upload.fields(onBoardingImages), validate(artistOnboardingPayload, {}, {}), artistOnboarding);
routes.get('/getall', validate(getAllArtistsPayload), getAllArtists);
routes.post('/getbyid', validate(getArtistByIdPayload), getArtistById);
routes.patch('/update', validate(updateArtistPayload), updateArtist);
routes.get('/labels', getLabels);
routes.post('/artistsbylabel', getLabelArtists);

module.exports = routes;
