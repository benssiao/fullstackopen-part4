const express = require("express")
const jwt = require('jsonwebtoken');
const Blog = require("../models/blog");
const User = require("../models/user");
const { nonExistantBlog } = require("../utils/test_helper");
const {info} = require("../utils/logger")
const middleware = require("../utils/middleware")

const blogsRouter = express.Router();


blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        return response.json(blogs);
    }
    catch(e) {
        next(e);
    }
})

blogsRouter.post('/', middleware.tokenExtractor
    , middleware.userExtractor, async (request, response, next) => {
    try {
        
        const body = request.body;
        if (!body.title || !body.url) {
            return response
            .status(400)
            .json({ 
                error: 'title or url missing' 
            })
        }

        const blogOwnerId = request.user.id;
        const blogOwner = await User.findById(blogOwnerId);
        const blog = new Blog({
            title: body.title,
            author: body.author,
            likes: body.likes,
            url: body.url,
            userID: blogOwnerId
        });
        const result = await blog.save();
        blogOwner.blogs = blogOwner.blogs.concat(result._id);
        await blogOwner.save();
        return response.status(201).json(result);
    }
    catch(e) {
        next(e);
    }
})

blogsRouter.delete("/:id", middleware.tokenExtractor
    , middleware.userExtractor, async (request, response, next) => {
    try {
        const blogId = request.params.id;
        const getBlog = await Blog.findById(blogId);
        const user = request.user;
        if (!user.blogs.map(blog => blog._id.toString()).includes(blogId)) {
            // makes a list of the id of all blogs of user and converts to string
            response.status(401).json({error: "not authorized to delete object"})
        }

        
        if (!getBlog) {
            return response.status(404).json({error: "blog does not exist"});
        }
        await getBlog.deleteOne()
        user.blogs = user.blogs.filter(blog => blog.toString() !== blogId);
       
        await user.save();
        response.status(204).end();
    }
    catch(e) {
        next(e);
    }
})

blogsRouter.put("/:id", middleware.tokenExtractor
    , middleware.userExtractor, async (request, response, next) => {
    try {
        // should be logged in to update so im putting the login middlewares into this handler
        const body = request.body;
        const id = request.params.id;
        const updateRes = await Blog.findByIdAndUpdate(
            id,
            {$set: body},
            { new: true, runValidators: true, context: 'query' }
        )
        if (!updateRes) {
            return response.status(404).json({
                error: 'blog does not exist anymore, please refresh the page to update blog list'
            })
        }
        response.status(200).json(updateRes);
    }
    catch(e) {
        next(e);
    }
})

module.exports = blogsRouter