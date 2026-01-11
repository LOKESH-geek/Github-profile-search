
    const input = document.getElementById("username");

    // Search on Enter key
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchUser();
        }
    });

    async function searchUser() {
        const username = input.value.trim();
        const errorDiv = document.getElementById("error");
        errorDiv.textContent = "";

        if (username === "") {
            alert("Please enter a GitHub username");
            return;
        }

        try {
            const userRes = await fetch(`https://api.github.com/users/${username}`);

            if (!userRes.ok) {
                throw new Error("User not found");
            }

            const userData = await userRes.json();
            displayProfile(userData);

            const repoRes = await fetch(userData.repos_url);
            const repoData = await repoRes.json();
            displayRepos(repoData);

        } catch (error) {
            document.getElementById("profile").innerHTML = "";
            document.getElementById("repos").innerHTML = "";
            errorDiv.textContent = "User not found";
        }
    }

    function displayProfile(user) {
        document.getElementById("profile").innerHTML = `
            <div class="profile">
                <img src="${user.avatar_url}" alt="Avatar">
                <div>
                    <h2>${user.name || ""} ${user.login}</h2>
                    <p>${user.bio || "no bio available"}</p>
                    <p>📍 ${user.location || "Not specified"}</p>
                    <p>👥 Followers: ${user.followers} | Following: ${user.following}</p>
                    <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
                </div>
            </div>
        `;
    }

    function displayRepos(repos) {
        let repoHTML = `<div class="repos"><h2>Repositories</h2>`;

        repos.forEach(repo => {
            repoHTML += `
                <div class="repo">
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || "No description"}</p>
                    <p>⭐ Stars: ${repo.stargazers_count}</p>
                </div>
            `;
        });

        repoHTML += `</div>`;
        document.getElementById("repos").innerHTML = repoHTML;
    }

