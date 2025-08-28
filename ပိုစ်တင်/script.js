// Sample data storage (for simplicity, using localStorage)
const posts = JSON.parse(localStorage.getItem('posts')) || [];
const comments = JSON.parse(localStorage.getItem('comments')) || {};

// DOM Elements
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminPanel = document.getElementById('admin-panel');
const newPostForm = document.getElementById('newPostForm');
const postsContainer = document.getElementById('posts-container');

let isAdminLoggedIn = false;
const adminCode = "zawzaw"; // သင့်အက်ဒမင်ကုတ်

// Function to render all posts on the page
function renderPosts() {
    postsContainer.innerHTML = ''; // Clear existing posts
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
            <p>${post.content}</p>
            <div class="comments-section">
                <h4>မှတ်ချက်များ</h4>
                <div id="comments-for-post-${index}"></div>
            </div>
            <hr>
            <form class="comment-form" data-post-index="${index}">
                <input type="text" placeholder="သင့်နာမည်" required>
                <textarea placeholder="သင့်မှတ်ချက်" required></textarea>
                <button type="submit">မှတ်ချက်ပေးမည်</button>
            </form>
        `;
        postsContainer.appendChild(postElement);

        // Render comments for this specific post
        renderComments(index);

        // Add event listener for the comment form
        postElement.querySelector('.comment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const commenterName = e.target.querySelector('input').value;
            const commentText = e.target.querySelector('textarea').value;
            addComment(index, commenterName, commentText);
            e.target.reset(); // Clear the form fields
        });
    });
}

// Function to render comments for a specific post
function renderComments(postIndex) {
    const commentsContainer = document.getElementById(`comments-for-post-${postIndex}`);
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';
    const postComments = comments[postIndex] || [];
    postComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <strong>${comment.name}:</strong> ${comment.text}
        `;
        commentsContainer.appendChild(commentElement);
    });
}

// Function to add a comment
function addComment(postIndex, name, text) {
    if (!comments[postIndex]) {
        comments[postIndex] = [];
    }
    comments[postIndex].push({ name, text });
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments(postIndex); // Re-render comments for this post
}

// Function to handle admin login
adminLoginBtn.addEventListener('click', () => {
    const password = prompt("အက်ဒမင်စနစ်ဝင်ရန် ကုတ်ထည့်ပါ:");
    if (password === adminCode) {
        isAdminLoggedIn = true;
        adminLoginBtn.style.display = 'none'; // Hide the login button
        adminPanel.style.display = 'block'; // Show the admin panel
        alert("အက်ဒမင်စနစ်သို့ အောင်မြင်စွာ ဝင်ရောက်ပါပြီ။");
    } else {
        alert("ကုတ်မှားယွင်းနေပါသည်။");
    }
});

// Function to handle new post submission
newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
        alert("အက်ဒမင်အဖြစ် အရင်ဝင်ရောက်ပါ။");
        return;
    }

    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const imageFile = document.getElementById('postImage').files[0];

    let imageUrl = '';
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imageUrl = event.target.result;
            const newPost = { title, content, image: imageUrl };
            posts.unshift(newPost); // Add to the beginning of the array
            localStorage.setItem('posts', JSON.stringify(posts));
            renderPosts();
            newPostForm.reset(); // Clear form
        };
        reader.readAsDataURL(imageFile);
    } else {
        const newPost = { title, content, image: '' };
        posts.unshift(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
        newPostForm.reset();
    }
});

// Initial render of posts when the page loads
renderPosts();