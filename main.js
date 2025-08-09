document.addEventListener("DOMContentLoaded", () => {
    console.log("JS Loaded");

    /* -------------------- LOGIN PAGE -------------------- */
    const loginBtn = document.querySelector("button");
    const inputs = document.querySelectorAll("input");
    const loader = document.getElementById("loader");

    if (loginBtn && inputs.length >= 2 && loader) {
        loginBtn.addEventListener("click", () => {
            const email = inputs[0].value.trim();
            const password = inputs[1].value.trim();

            if (email === "" || password === "") {
                alert("Please fill in both fields.");
                return;
            }

            loader.classList.remove("hidden");
            loginBtn.disabled = true;
            loginBtn.textContent = "Logging in...";

            setTimeout(() => {
                loader.classList.add("hidden");
                loginBtn.disabled = false;
                loginBtn.textContent = "Log In";
                alert("Login successful!");
                window.location.href = "home.html";
            }, 2000);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                loginBtn.click();
            }
        });
    }

    /* -------------------- HOME PAGE POST CREATION -------------------- */
    const postBtn = document.getElementById("submitPost");
    const statusInput = document.getElementById("postText");
    const feed = document.getElementById("dynamicPostFeed");

    if (postBtn && statusInput && feed) {
        const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

        // Render saved posts
        savedPosts.forEach(post => addPostToFeed(post.text, post.time));

        postBtn.addEventListener("click", () => {
            const text = statusInput.value.trim();
            if (text === "") {
                alert("Please write something before posting.");
                return;
            }

            const time = new Date().toLocaleString();
            const newPost = { text, time };
            savedPosts.unshift(newPost);
            localStorage.setItem("posts", JSON.stringify(savedPosts));

            addPostToFeed(text, time);
            statusInput.value = "";
        });
    }

    function addPostToFeed(text, time) {
        if (!feed) return;
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <p>${text}</p>
            <span class="time">${time}</span>
        `;
        feed.appendChild(postElement);
    }

    /* -------------------- GREETING -------------------- */
    const greeting = document.getElementById("greeting");
    if (greeting) {
        const hours = new Date().getHours();
        let greetText = "Hello";
        if (hours < 12) greetText = "Good Morning";
        else if (hours < 18) greetText = "Good Afternoon";
        else greetText = "Good Evening";
        greeting.textContent = greetText + "!";
    }

    /* -------------------- THEME TOGGLE -------------------- */
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);

        themeToggle.addEventListener("click", () => {
            const newTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    function setTheme(mode) {
        document.body.classList.remove("light-mode", "dark-mode");
        document.body.classList.add(`${mode}-mode`);
    }

    /* -------------------- API POSTS (DummyJSON) -------------------- */
    if (feed) {
        fetch("https://dummyjson.com/posts?limit=5")
            .then(res => res.json())
            .then(data => {
                data.posts.forEach(post => {
                    const postElement = document.createElement("div");
                    postElement.className = "post";
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                    `;
                    feed.appendChild(postElement);
                });
            })
            .catch(err => console.error("Error loading API posts:", err));
    }
});
