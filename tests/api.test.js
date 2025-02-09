const { describe, after, it, beforeEach} = require('node:test')
const assert = require("node:assert")
const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const helper = require("../utils/test_helper")
const Blog = require("../models/blog")

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
        let newBlogObject = new Blog(blog);
        await newBlogObject.save();
    }
})
after(async () => {
    await mongoose.connection.close()
})

describe("GET /api/blogs", async () => {

    it("get all", async () => {
        await api.get("/api/blogs/")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    })

  
})

describe("unique identifier is id", async () => {
    it("id is id not _id test", async () => {
        const blogs = await helper.blogsInDb();
        for (let blog of blogs) {
            assert(blog.id !== null && blog.id !== undefined && !blog._id);
        }

    })
})
describe("POST /api/blogs", async () => {
    it("post one", async () => {
        const testBlog = {
            title: "test",
            author: "testy testerson",
            url: "www.testyblog.com",
            likes: 22
        }
        await api.post("/api/blogs")
        .send(testBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
        const blogsAfterSubmit = await helper.blogsInDb();
        assert.strictEqual(blogsAfterSubmit.length, helper.initialBlogs.length+1);
        
        // test blog is being saved correctly.

        const savedTestBlog = blogsAfterSubmit[blogsAfterSubmit.length-1];
        for (let key of Object.keys(testBlog)) {
            assert.strictEqual(testBlog[key], savedTestBlog[key]);
        }
    })
})

describe("Likes missing", async() => {
    it("like missing", async () => {
        const testBlog = {
            title: "test",
            author: "testy testerson",
            url: "www.testyblog.com",
        }

        await api.post("/api/blogs")
        .send(testBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
        const blogsAfterSubmit = await helper.blogsInDb();
        const savedTestBlog = blogsAfterSubmit[blogsAfterSubmit.length-1];
        assert.strictEqual(savedTestBlog.likes, 0);

    })
    
})

describe("title or url missing", async () => {
    it("title missing url exists", async () => {
        const testBlog = {
            author: "testy testerson",
            url: "www.testyblog.com",
            likes: 22
        }

        await api.post("/api/blogs")
        .send(testBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    }
    )
    it("url missing title exists", async () => {
        const testBlog = {
            author: "testy testerson",
            title: "test",
            likes: 22
        }

        await api.post("/api/blogs")
        .send(testBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    }
    )
    it("both missing", async () => {
        const testBlog = {
            author: "testy testerson",
            likes: 22
        }

        await api.post("/api/blogs")
        .send(testBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    }
    )
})

describe("delete test", async () => {
    it("delete nonexistant", async () => {

    })

    it("delete success", async () => {

    })

})

describe("update test", async () => {
    it("successful update", async () => {

    })

    it("unsuccessful update", async () => {
        
    })

})