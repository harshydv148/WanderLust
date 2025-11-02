const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isRevewAuthor} = require("../middleware.js");
const { createReview } = require("../controllers/review.js");


const reviewController = require("../controllers/review.js");


//post Reviews route
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Deleting review route
router.delete(
  "/:reviewId",isLoggedIn,isRevewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;