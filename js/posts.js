import { getPosts, addPost, updatePost } from './api_mock/posts_api.js';

let posts = [];

// Load posts from API
getPosts().then(data => {
    posts = data;
    displayPosts();
});

// Display posts
function displayPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear the container

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Create a post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    const contentElement = document.createElement('p');
    contentElement.textContent = post.content;
    postElement.appendChild(contentElement);

    if (post.image) {
        const imgElement = document.createElement('img');
        imgElement.src = post.image;
        imgElement.alt = "Image du post";
        imgElement.onclick = () => openFullscreen(post.image);
        postElement.appendChild(imgElement);
    }

    const reactionsElement = createReactionsElement(post);
    postElement.appendChild(reactionsElement);

    // Add comments section
    const commentsSection = createCommentsSection(post);
    postElement.appendChild(commentsSection);

    return postElement;
}

// Create reactions element
function createReactionsElement(post) {
    const reactionsElement = document.createElement('div');
    reactionsElement.classList.add('reactions');

    const likeButton = createReactionButton("👍", post.likes, "like", post);
    const dislikeButton = createReactionButton("👎", post.dislikes, "dislike", post);
    const loveButton = createReactionButton("❤️", post.loves, "love", post);

    reactionsElement.appendChild(likeButton);
    reactionsElement.appendChild(dislikeButton);
    reactionsElement.appendChild(loveButton);

    return reactionsElement;
}

// Create reaction button
function createReactionButton(icon, count, type, post) {
    const button = document.createElement('button');
    button.innerHTML = `${icon} ${count}`;
    button.onclick = () => handleReaction(type, post, button);
    return button;
}

// Handle reaction
function handleReaction(type, post, button) {
    if (post[type + 's'] > 0) {
        post[type + 's'] = 0;
    } else {
        post[type + 's']++;
    }
    button.innerHTML = `${button.innerHTML.split(' ')[0]} ${post[type + 's']}`;
}

// Open full-screen image
function openFullscreen(imageSrc) {
    const fullScreenImage = document.getElementById('full-screen-image');
    const imageDisplay = document.getElementById('image-display');
    imageDisplay.src = imageSrc;
    fullScreenImage.style.display = 'flex';

    const closeButton = document.getElementById('close-button');
    closeButton.onclick = closeFullscreen;
}

// Close full-screen image
function closeFullscreen() {
    document.getElementById('full-screen-image').style.display = 'none';
}

// Add a new post
document.getElementById('new-post-form').onsubmit = function(event) {
    event.preventDefault();
    const content = document.getElementById('post-content').value;
    const imageFile = document.getElementById('post-image').files[0];

    const newPost = {
        id: Date.now().toString(),
        content: content,
        image: imageFile ? URL.createObjectURL(imageFile) : "",
        likes: 0,
        dislikes: 0,
        loves: 0,
        comments: [] // New property for comments
    };

    addPost(newPost).then(() => {
        displayPosts(); // Display posts (the new one will be on top)
        document.getElementById('new-post-form').reset(); // Reset the form
    });
};

// Create comments section
function createCommentsSection(post) {
    const commentsSection = document.createElement('div');
    commentsSection.classList.add('comments-section');

    const commentsList = document.createElement('ul');
    post.comments.forEach(comment => {
        const commentItem = createCommentElement(comment);
        commentsList.appendChild(commentItem);
    });

    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Ajoutez un commentaire...';

    const commentButton = document.createElement('button');
    commentButton.textContent = 'Commenter';
    commentButton.onclick = () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            const newComment = {
                user: 'Vous', // Replace with user name
                avatar: 'images/avatar/utilisateur.png', // Replace with user avatar path
                text: commentText,
                replies: [] // New property for replies
            };

            updatePost(post.id, newComment).then(() => {
                displayPosts(); // Refresh posts to show the new comment
                commentInput.value = ''; // Reset input field
            });
        }
    };

    commentsSection.appendChild(commentsList);
    commentsSection.appendChild(commentInput);
    commentsSection.appendChild(commentButton);

    return commentsSection;
}

// Create a comment element
function createCommentElement(comment) {
    const commentItem = document.createElement('li');
    commentItem.classList.add('comment-item'); // Add a class for styling

    const avatar = document.createElement('img');
    avatar.src = comment.avatar;
    avatar.alt = "Avatar";
    avatar.classList.add('avatar');
    
    const commentText = document.createElement('span');
    commentText.textContent = `${comment.user}: ${comment.text}`;
    commentText.classList.add('comment-text'); // Add a class for styling

    commentItem.appendChild(avatar);
    commentItem.appendChild(commentText);

    // Add a button to reply to this comment
    const replyButton = document.createElement('button');
    replyButton.textContent = 'Répondre';
    replyButton.classList.add('reply-button'); // Add a class for styling
    replyButton.onclick = () => {
        let replyInput = commentItem.querySelector('.reply-input');
        let replySubmit = commentItem.querySelector('.reply-submit');

        // If reply input already exists, toggle its visibility
        if (replyInput) {
            replyInput.style.display = replyInput.style.display === 'none' ? 'block' : 'none';
            replySubmit.style.display = replySubmit.style.display === 'none' ? 'block' : 'none';
        } else {
            // Create a new reply input and submit button if they don't exist
            replyInput = document.createElement('input');
            replyInput.classList.add('reply-input');
            replyInput.type = 'text';
            replyInput.placeholder = 'Ajoutez une réponse...';

            replySubmit = document.createElement('button');
            replySubmit.classList.add('reply-submit');
            replySubmit.textContent = 'Envoyer';
            replySubmit.onclick = () => {
                const replyText = replyInput.value.trim();
                if (replyText) {
                    const newReply = {
                        user: 'Vous', // Replace with user name
                        avatar: 'images/avatar/utilisateur.png', // Replace with user avatar path
                        text: replyText
                    };
                    comment.replies.push(newReply); // Add the reply to the comment
                    displayPosts(); // Refresh posts to show the new reply
                    replyInput.value = ''; // Reset input field
                }
            };

            // Append the reply input and submit button
            commentItem.appendChild(replyInput);
            commentItem.appendChild(replySubmit);
        }
    };

    commentItem.appendChild(replyButton);

    // Create a section for displaying replies
    const repliesList = document.createElement('ul');
    comment.replies.forEach(reply => {
        const replyItem = createReplyElement(reply);
        repliesList.appendChild(replyItem);
    });

    commentItem.appendChild(repliesList); // Add replies list to comment

    return commentItem;
}

// Create a reply element
function createReplyElement(reply) {
    const replyItem = document.createElement('li');
    replyItem.classList.add('reply-item'); // Add a class for styling

    const avatar = document.createElement('img');
    avatar.src = reply.avatar;
    avatar.alt = "Avatar";
    avatar.classList.add('avatar');
    const replyText = document.createElement('span');
    replyText.textContent = `${reply.user}: ${reply.text}`;

    replyItem.appendChild(avatar);
    replyItem.appendChild(replyText);

    return replyItem;
}

// Display posts on page load
displayPosts();
