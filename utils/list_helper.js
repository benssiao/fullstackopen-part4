
function dummy(blogs) {
    return 1;
}

function totalLikes(blogList) {
  
    return blogList.map(blog => blog.likes).reduce((sum, curr) => {
        return sum + curr;

    }, 0)
}

function favoriteBlog(blogList) {
    if (blogList.length === 0) {
        return null;
    }
    const maxLikes = Math.max(...blogList.map(blog => blog.likes));
    for (let blog of blogList) {
        if (blog.likes === maxLikes) {
            return blog;
        }
    }
}

function mostBlogs(blogList) {
    if (blogList.length === 0) {
        return null;
    }
    let maxBlogs = 0;
    const authorBlogCount = new Map();
    for (let blog of blogList) {
        if (authorBlogCount.has(blog.author)) {
            authorBlogCount.set(blog.author, authorBlogCount.get(blog.author)+1);
        }
        else {
            authorBlogCount.set(blog.author, 1);
        }
        maxBlogs = Math.max(maxBlogs, authorBlogCount.get(blog.author));
    }
    for (let author of authorBlogCount.keys()) {
        if (authorBlogCount.get(author) === maxBlogs) {
            return {author: author, blogs: maxBlogs};
        }

    }
}

function mostLikes(blogList) {
    if (blogList.length === 0) {
        return null;
    }

    const maxLikes = favoriteBlog(blogList).likes;
    for (let blog of blogList) {
        if (blog.likes === maxLikes) {
            return {author: blog.author, likes: maxLikes};
        }
    }

}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}