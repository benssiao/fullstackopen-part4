const Blog = require("../models/blog");
const User = require("../models/user");


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



async function nonExistantBlog() {
  const toBeRemoved = new Blog({
    title: "remove me",
  })
  const savedToDb = await toBeRemoved.save();
  await savedToDb.deleteOne();
  return  savedToDb._id.toString();
}

async function nonExistantUser() {
  
  const toBeRemoved = new User({
    username: "remove me",
  })
  const savedToDb = await toBeRemoved.save();
  await savedToDb.deleteOne();
  return  savedToDb._id.toString();
}


async function blogsInDb() {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

async function usersInDb() {
  const users = await User.find({});
  return users.map(user => user.toJSON())
}

module.exports = {
    blogsInDb,
    initialBlogs,
    usersInDb,
    nonExistantBlog,
    nonExistantUser,
}