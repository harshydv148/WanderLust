const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    req.flash("success","New Review created");
    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //Pull operator se hum listing id k andr jo reviews h usme jis
    await Review.findByIdAndDelete(reviewId); //reviewId wale review ko delete krna chahte h wo use dhundega or delete kr dega
    req.flash("success","New Review deleted");
    res.redirect(`/listings/${id}`);
  }