const express = require('express');
const router=express.Router()
const blogsController = require('./../controllers/blogsController');


router.post('/create', blogsController.createblogs)
router.get('/getblogs',blogsController.getblogs)
router.get('/getOneBlog/:id',blogsController.getOblogs)
router.patch('/upload/:id',blogsController.uploadBlogPhoto)





    
module.exports = router