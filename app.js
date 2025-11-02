if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");//to maintain and terminate a session 
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");//for flashing a msg while deleting updating or performing any action
const passport = require("passport");
const LocalStraegy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine ", "ejs"); //to use ejs
app.set("views", path.join(__dirname, "views")); //to tell ejs path that every file is in views folder
app.use(express.urlencoded({ extended: true })); //to parse the data
app.use(methodOverride("_method")); //to use method override
app.engine("ejs", ejsmate); //to use ejs mate
app.use(express.static(path.join(__dirname, "/public"))); //to use css and other file and tell compiler that files are in pblic folder

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
})

store.on("error", ()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized :true,
  cookie:{
    expires: Date.now()* 7 * 24 * 60 * 60 * 1000,//Day , hours , minutes , second , miliseconds;
    maxAge :   7 * 24 * 60 * 60 * 1000,
    httpOnly : true,//for security purpose , to prevent cross scripting attack(read own) 
  }
}

// app.get("/", (req, res) => {
//   res.send("Hi i am root");
// });

app.use(session(sessionOptions));
app.use(flash());//we always have to require flash before our routes are used 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStraegy(User.authenticate()));  

passport.serializeUser(User.serializeUser());//to store info of user after a session is start
passport.deserializeUser(User.deserializeUser());//to delete user info after session end

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-student",
//   })
//   let registeredUser = await User.register(fakeUser ,"helloworld");
//   res.send(registeredUser);
// })

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})
//Route for listings
app.use("/listings" ,listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

//a testing route to check it take request from all requests that will be sent
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

