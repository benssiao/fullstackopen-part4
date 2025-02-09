const express = require("express")
const Blog = require("../models/blog");
const { request } = require("../app");

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs);
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body;
    if (!body.title || !body.url) {
        return response
        .status(400)
        .json({ 
            error: 'title or url missing' 
        })
    }
  const blog = new Blog(body);
  
  const result = blog.save();
  return response.status(201).json(result);
})

blogsRouter.delete("/:id", async (request, response) => {
    const id = request.params.id
    await Blog.deleteById(id);
    response.status(204).end();

})

blogsRouter.put("/:id", async (request, response) => {
    const body = request.body;
    if (!body.title || !body.url) {
        return response
        .status(400)
        .json({ 
            error: 'title or url missing' 
        })
    }
    const id = request.params.id;
    const updateRes = await Blog.findOneAndUpdate(
        {_id: id},
        {$set: request.body},
        { new: true, runValidators: true, context: 'query' }
    )
    if (!updateRes.modifiedCount) {
        return response.status(400).json({
            error: 'person does not exist anymore, please refresh the page to update person list'
        })
    }
    res.json(result);
})
module.exports = blogsRouter