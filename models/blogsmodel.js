const mongoose = require('mongoose');


const BlogsSchema = new mongoose.Schema({
    date : {
        type:String,
     
    },

    heading: {
        type: String,
        
    },

    description: {
        type: String,
      
    },
    photo:{
        type:String
    }

})

const blogs = mongoose.model('blogs', BlogsSchema);
module.exports = blogs;