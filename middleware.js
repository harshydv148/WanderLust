let Listing =  require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
let Review = require("./models/review.js")

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
      if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash("error" , "You must be logged in to Add a listing");  
   return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl =  req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next)=>{
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error" , "You are not the owner of this listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

//for client  side validation of review
module.exports.validateListing = (req, res, next) => {
  console.log("body", req.body);
  let { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//for server side validation of review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//for review authorization that only owner is deleting and editing review
module.exports.isRevewAuthor = async(req,res,next)=>{
  let { id  , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error" , "You are not the author  of this review!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}