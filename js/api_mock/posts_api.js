let posts = [];

// Simulate fetching posts from an API
function getPosts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(posts);
        }, 500); // Simulate a delay
    });
}

// Simulate adding a new post
function addPost(post) {
    return new Promise((resolve) => {
        setTimeout(() => {
            posts.unshift(post);
            resolve(post);
        }, 500); // Simulate a delay
    });
}

// Simulate updating a post by adding a comment
function updatePost(postId, comment) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.comments.push(comment);
            }
            resolve(post);
        }, 500); // Simulate a delay
    });
}

// Initial load of posts
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        posts = data.posts;
    });


export { getPosts, addPost, updatePost };