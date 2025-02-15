const { describe, after, it, beforeEach} = require('node:test')
const assert = require("node:assert")
const supertest = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
// helper
const helper = require("../utils/test_helper")
// models
const Blog = require("../models/blog")
const User = require("../models/user")

const bcrypt = require("bcrypt");

const api = supertest(app);
//put passwordHash outside so i only need to hash it once.
let token;
beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray1 = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray1)
    await User.deleteMany({})
    
    const newUser = {username: "wendySoMe", password: "password", name: "wendy"};
    await api.post("/api/users")
    .send(newUser)
    const loginResponse = await api.post("/api/login")
    .send({username: "wendySoMe", password: "password"})
    token = loginResponse.body.token;
})


after(async () => {
    await mongoose.connection.close()
})

describe("GET /api/blogs",  () => {

    it("get all", async () => {
        await api.get("/api/blogs/")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    })

  
})

describe("unique identifier is id",  () => {
    it("id is id not _id test", async () => {
        const blogs = await helper.blogsInDb();
        for (let blog of blogs) {
            assert(blog.id !== null && blog.id !== undefined && !blog._id);
        }

    })
})

describe("POST /api/blogs",  () => {
    it("post one", async () => {
        const testBlog = {
            title: "test",
            author: "testy testerson",
            url: "www.testyblog.com",
            likes: 22
        }
        await api.post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send(testBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
        const blogsAfterSubmit = await helper.blogsInDb();
        assert.strictEqual(blogsAfterSubmit.length, helper.initialBlogs.length+1);
        
        // test blog is being saved correctly.

        const savedTestBlog = (await Blog.findOne({title: "test"})).toJSON();

        assert.strictEqual(savedTestBlog.title, testBlog.title);
        assert.strictEqual(savedTestBlog.author, testBlog.author);
        assert.strictEqual(savedTestBlog.url, testBlog.url);
        assert.strictEqual(savedTestBlog.likes, testBlog.likes);
    })
})

describe("Likes missing", () => {
    it("like missing", async () => {
        const testBlog = {
            title: "test",
            author: "testy testerson",
            url: "www.testyblog.com",
        }

        await api.post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send(testBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
        const blogsAfterSubmit = await helper.blogsInDb();
        const savedTestBlog = blogsAfterSubmit[blogsAfterSubmit.length-1];
        assert.strictEqual(savedTestBlog.likes, 0);

    })
    
})

describe("title or url missing",  () => {
    it("title missing url exists", async () => {
        const testBlog = {
            author: "testy testerson",
            url: "www.testyblog.com",
            likes: 22
        }

        await api.post("/api/blogs")
        .set("Authorization", "Bearer " + token)
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
        .set("Authorization", "Bearer " + token)
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
        .set("Authorization", "Bearer " + token)
        .send(testBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    }
    )
})

describe("delete test",  () => {
    it("delete nonexistant", async () => {
        const nonExistantId = await helper.nonExistantBlog();
        await api.delete(`/api/blogs/${nonExistantId}`)
        .set("Authorization", "Bearer " + token)
        .expect(401);
        const currentLength = (await helper.blogsInDb()).length;
        assert.strictEqual(currentLength, helper.initialBlogs.length);
    })

    it("delete success", async () => {
        const initialLength = helper.initialBlogs.length;
        const testBlog = {
            title: "test",
            author: "testy testerson",
            url: "www.testyblog.com",
            likes: 22
        }
        await api.post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send(testBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
        const savedTestBlog = (await Blog.findOne({title: "test"})).toJSON();
        await api.delete(`/api/blogs/${savedTestBlog.id}`)
        .set("Authorization", "Bearer " + token)
        .expect(204)
        const deletedBlog = await Blog.findById(savedTestBlog.id);
        assert.strictEqual(deletedBlog, null);
    })

})

describe("update test", () => {
    it("update nonexistant", async () => {
        const nonExistantId = await helper.nonExistantBlog();
        await api.put(`/api/blogs/${nonExistantId}`)
        .set("Authorization", "Bearer " + token)
        .send({title: "bogus"})
        .expect(404);
        

    })

    it("successful update", async () => {
        const changeTitle = {title: "changed"};
        
        const blogTitle = helper.initialBlogs[0].title;
        const blog = await Blog.findOne({title: blogTitle});
        const pickedBlog = blog.toJSON();
        await api.put(`/api/blogs/${pickedBlog.id}`)
        .set("Authorization", "Bearer " + token)
        .send(changeTitle)
        .expect(200)
        const changedBlog = await Blog.findOne({title: "changed"});
        assert.notDeepStrictEqual(changedBlog.toJSON(), helper.initialBlogs[0]);
        assert.strictEqual(changedBlog.title, "changed");
    })

})


describe("signup tests", () => {

    it ("password too short", async () => {
        const newUser = {
            username: "as",
            name: "amy schuler",
            password: "123124",
        }
        await api.post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)
    })

    it ("successful signup", async () => {
        const usersBeginning = await helper.usersInDb();
        const newUser = {
            username: "amyschu",
            name: "amy schuler",
            password: "1234"
        }
        await api.post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/)

        const usersNow = await helper.usersInDb();
        assert.strictEqual(usersNow.length, usersBeginning.length + 1);

        const usernames = usersNow.map(u => u.username);
        assert(usernames.includes(newUser.username));
    })

    it ("creation fails with proper status and message if username already exists", async () => {
        const saltRounds = 10;
        
        const takenUser = {
            username: "jojo",
            name: "joe schmo",
            password: "password1"
        }

        await api.post("/api/users")
        .send(takenUser)
        .expect(201)
        .expect("Content-Type", /application\/json/)
        const usersStart = await helper.usersInDb();
        const failToSign = {
            username: "jojo",
            name: "schmo joe",
            password: "password2"
        }

        await api.post("/api/users")
        .send(failToSign)
        .expect(400)
        .expect("Content-Type", /application\/json/)

        const usersNow = await helper.usersInDb();
        assert.strictEqual(usersNow.length, usersStart.length)
    })
    
})

describe("user posts somethings", () => {

    it ("initial user posts something", async () => {
        const initialUser = (await helper.usersInDb())[0];
        assert.equal(initialUser.username, "wendySoMe");
        const sendBlog = {
            title: "first blog",
            author: "me",
            url: "me.com",
            user: token,
            likes: 5
        };
        await api.post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send(sendBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
        const changedUser = await User.findById(initialUser.id);
        const uploadedBlog = (await helper.blogsInDb())[2];
        assert.strictEqual(uploadedBlog.id, changedUser.blogs[0].toString());



    })
})