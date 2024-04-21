
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Blogs = require('./../models/blogsmodel');
const { upload } = require('./../utils/s3');




exports.uploadBlogPhoto = catchAsync(async (req, res, next) => {


  const uploadSingle = upload("classroomdata", "blogsimages/","blogs").single('photo');
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }
    if (req.file) {
      req.body.photo = req.file.key
    }
    console.log(req.file)
    const blog = await Blogs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        blog
      }
    })
  })
});

exports.createblogs = async (req, res) => {


  const newblogs = await Blogs.create(req.body)

  try {


    res.status(201).json({
      statusbar: 'success',
      data: {
        BlogsSchema: newblogs
      }
    })
  } catch (err) {
    res.status(404).json({
      statusbar: "fail",
      messege: err

    })
  }

}



  exports.getblogs = catchAsync(async (req, res, next) => {
    const blog = await Blogs.find()

    res.status(200).json({
      status: 'success',
      data: {
        blog
      }
    });

  });

exports.getOblogs=async(req,res)=>{
  try{
    const blog=await Blogs.findById(req.params.id)
    res.status(200).json({
      data:{
        blog
      }
    })

  }catch(err){
    console.log(err)

  }
}





