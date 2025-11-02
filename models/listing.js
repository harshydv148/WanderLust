const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  //Create kia humne apna schema
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingImage",
    }, 
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/aerial-view-of-autumn-forest-bordering-dark-lake-YjvWnXauZR0",

      set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/aerial-view-of-autumn-forest-bordering-dark-lake-YjvWnXauZR0"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner : {
    type :  Schema.Types.ObjectId,
    ref:"User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema); //Or yha us schema se humne apna model create kia
module.exports = Listing; //apne model ko export kr dia baki jgh use krne k liye
