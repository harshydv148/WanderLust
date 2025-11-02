const Joi = require('joi');
// const Listing = require('./models/listing');

// module.exports.listingSchema = Joi.object({
//     Listing : Joi.object({
//         title : Joi.string().required,
//         description : Joi.string().required,
//         location : Joi.string().required,
//         country : Joi.string().required,
//         price : Joi.number().required,
//         image : Joi.string().allow("", null),
//     }).required()
// });

module.exports.listingSchema = Joi.object({
    listing : Joi.object({ // <== Changed to lowercase 'l'
        title : Joi.string().required(), // <== Added ()
        description : Joi.string().required(), // <== Added ()
        location : Joi.string().required(), // <== Added ()
        country : Joi.string().required(), // <== Added ()
        price : Joi.number().required().min(0), // <== Added () and a min value
        image : Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
})