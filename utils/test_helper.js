const Blog = require("../models/blog");

const initialBlogs = [
    {
      
      title: "How to Make Pizza",
      author: "Mario Chef",
      url: "https://cooking.com/pizza",
      likes: 42,
    
    }
    ,
 
    {
    
      title: "JavaScript Promises",
      author: "Code Master",
      url: "https://techblog.com/promises",
      likes: 15,
   
    }]

async function blogsInDb() {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

module.exports = {
    blogsInDb,
    initialBlogs,
}