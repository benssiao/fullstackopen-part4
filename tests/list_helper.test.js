const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe("tests for totalLikes", () => {
    const testBlogs1 = [
        {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7
        },
      ];
      const testBlogs2 = [{
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
      },
      {
        title: "The Art of Functional Programming",
        author: "Douglas Crockford",
        url: "http://example.com/functional-programming",
        likes: 15
      },
      {
        title: "Understanding ECMAScript 6",
        author: "Nicholas C. Zakas",
        url: "http://example.com/es6-guide",
        likes: 8
      },
      {
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        url: "http://example.com/ydkjs",
        likes: 20
      },
      {
        title: "Clean Code Principles",
        author: "Robert C. Martin",
        url: "http://example.com/clean-code",
        likes: 14
      }
    ];
    test("test for single", () => {
        assert.strictEqual(listHelper.totalLikes(testBlogs1), 7);
    })
    
    test("test for many", () => {
        assert.strictEqual(listHelper.totalLikes(testBlogs2), 59);
    })
})

describe("tests for favoriteBlog", () => {

    const testBlogs1 = [
        {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7
        },
      ];

      const testBlogs2 = [{
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
      },
      {
        title: "The Art of Functional Programming",
        author: "Douglas Crockford",
        url: "http://example.com/functional-programming",
        likes: 15
      },
      {
        title: "Understanding ECMAScript 6",
        author: "Nicholas C. Zakas",
        url: "http://example.com/es6-guide",
        likes: 8
      },
      {
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        url: "http://example.com/ydkjs",
        likes: 20
      },
      {
        title: "Clean Code Principles",
        author: "Robert C. Martin",
        url: "http://example.com/clean-code",
        likes: 14
      }
    ];
    test("test for one", () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(testBlogs1), {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
          });
    })
    test("test for many", () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(testBlogs2), {
            title: "You Don't Know JS",
            author: "Kyle Simpson",
            url: "http://example.com/ydkjs",
            likes: 20
          });
    })
})

describe("tests for mostLikes", () => {

    const testBlogs1 = [
        {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7
        },
      ];

      const testBlogs2 = [{
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
      },
      {
        title: "The Art of Functional Programming",
        author: "Douglas Crockford",
        url: "http://example.com/functional-programming",
        likes: 15
      },
      {
        title: "Understanding ECMAScript 6",
        author: "Nicholas C. Zakas",
        url: "http://example.com/es6-guide",
        likes: 8
      },
      {
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        url: "http://example.com/ydkjs",
        likes: 20
      },
      {
        title: "Clean Code Principles",
        author: "Robert C. Martin",
        url: "http://example.com/clean-code",
        likes: 14
      }
    ];
    test("test for one", () => {
        assert.deepStrictEqual(listHelper.mostLikes(testBlogs1), {
            author: "Michael Chan",
            likes: 7
          });
    })
    test("test for many", () => {
        assert.deepStrictEqual(listHelper.mostLikes(testBlogs2), {
            author: "Kyle Simpson",
            likes: 20
          });
    })
})

describe("tests for mostBlogs", () => {

    const testBlogs1 = [
        {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7
        },
      ];

      const testBlogs2 = [
        {
          title: "Clean Code Principles",
          author: "Robert C. Martin",
          url: "http://example.com/clean-code",
          likes: 14
        },
        {
          title: "TDD Basics",
          author: "Robert C. Martin",
          url: "http://example.com/tdd-basics",
          likes: 10
        },
        {
          title: "SOLID Principles",
          author: "Robert C. Martin",
          url: "http://example.com/solid",
          likes: 25
        },
        {
          title: "JavaScript Best Practices",
          author: "Dan Abramov",
          url: "http://example.com/js-best-practices",
          likes: 30
        },
        {
          title: "Redux Fundamentals",
          author: "Dan Abramov",
          url: "http://example.com/redux-fundamentals",
          likes: 22
        },
        {
          title: "React Hooks in Depth",
          author: "Dan Abramov",
          url: "http://example.com/hooks-in-depth",
          likes: 18
        },
        {
          title: "Understanding TypeScript",
          author: "Anders Hejlsberg",
          url: "http://example.com/typescript-basics",
          likes: 15
        },
        {
          title: "TypeScript 2.0 Features",
          author: "Anders Hejlsberg",
          url: "http://example.com/typescript-2",
          likes: 12
        },
        {
          title: "Python for Beginners",
          author: "Guido van Rossum",
          url: "http://example.com/python-basics",
          likes: 20
        },
        {
          title: "Python Design Patterns",
          author: "Guido van Rossum",
          url: "http://example.com/python-patterns",
          likes: 17
        },
        {
          title: "Clean Architecture",
          author: "Robert C. Martin",
          url: "http://example.com/clean-architecture",
          likes: 28
        },
        {
          title: "Agile Principles",
          author: "Robert C. Martin",
          url: "http://example.com/agile",
          likes: 16
        },
        {
          title: "React Performance",
          author: "Dan Abramov",
          url: "http://example.com/react-performance",
          likes: 25
        },
        {
          title: "TypeScript 3.0 Features",
          author: "Anders Hejlsberg",
          url: "http://example.com/typescript-3",
          likes: 19
        },
        {
          title: "Python AsyncIO",
          author: "Guido van Rossum",
          url: "http://example.com/python-async",
          likes: 23
        }
      ]

    test("test for one", () => {
        assert.deepStrictEqual(listHelper.mostBlogs(testBlogs1), {
            author: "Michael Chan",
            blogs: 1
          });
    })
    test("test for many", () => {
        assert.deepStrictEqual(listHelper.mostBlogs(testBlogs2), {
            author: "Robert C. Martin",
            blogs: 5
          });
    })
})