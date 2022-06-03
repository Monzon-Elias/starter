const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator')

//const User = require('./userModel'); this was imported fot the embedding code below

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      //validate: [validator.isAlpha, 'Tour name must only contain characters'] this validator does not include spaces
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        /* enum is not for numbers */ values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.66666, 46.6666, 47, 4.7 - 'set' will execute each time a value is added
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validator: {
        //This validator only points to current doc on NEW document creation
        function(val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE})should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //guides: Array, --it was like this for the embedding code below
    guides: [
      // --this option is for referencing child documents (users)
      {
        type: mongoose.Schema.ObjectId, // --this is where the reference happens
        ref: 'User',
      },
    ],
  },
  /*Schema Options Object */
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); //GeoJSON geometry index- Geospatial feature in mongo

//Virtual Populate
//It allows us to keep a reference of the child documents in the parent doc.
//without persisting this info into the db.

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review', //model we want to reference
  foreignField: 'tour', //the field in the foreign model we want to reference
  localField: '_id', //the local name for the foreign field 'tour' (above)
});

//DOCUMENT MIDDLEWARE: runs before .save() & .create()
//note 1) 'hook' & 'middleware' are the same thing in this context
//note 2) 'pre' for the middleware to happen before the 'save' hook
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// You can have more middlewares here
//QUERY MIDDLEWARE - allow to run functions before or after queries are executed

//EMBEDDING GUIDES USERS INSIDE TOUR DOCUMENT
/* tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next(); 
});*/

//note 1) /^find/ is a regex that means: all query that starts with 'find'
//note 2) $ne operator means 'not equal'
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//AGGREGATION MIDDLEWARE
//note 1) aggregation is a pipeline
//note 2) unshift() adds an element at the beginning of an array (pure js)
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

/*Model*/
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
