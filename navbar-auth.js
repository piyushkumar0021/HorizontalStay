// =====================================
// NAVBAR USER AUTH (Logged-in Display)
// =====================================
// Session ke hisaab se navbar me logged-in user
// ka real naam (MongoDB/session se) aur Logout
// option dikhata hai.
// Logged in nahi hai to default Login button
// waise hi rehta hai - koi stale info nahi.

(function () {
    document.addEventListener("DOMContentLoaded", function () {

        var authArea = document.getElementById("userAuth");

        if (!authArea) {
            return;
        }

        fetch("/api/me", {
            credentials: "same-origin",
            headers: { "Accept": "application/json" }
        })
            .then(function (response) {
                return response.ok ? response.json() : null;
            })
            .then(function (data) {

                // Logged in nahi hai -> default button rakho,
                // galat/purana naam kabhi mat dikhao
                if (!data || !data.loggedIn || !data.name) {
                    return;
                }

                authArea.innerHTML = "";

                // USER NAME (sirf text - injection safe)
                var nameSpan = document.createElement("span");
                nameSpan.className = "user-name";
                nameSpan.textContent = data.name;

                // LOGOUT (existing /logout route reuse)
                var logoutLink = document.createElement("a");
                logoutLink.className = "login logout-btn";
                logoutLink.href = "/logout";
                logoutLink.textContent = "Logout";

                authArea.appendChild(nameSpan);
                authArea.appendChild(logoutLink);

            })
            .catch(function () {
                // Network error -> default Login button hi rehne do
            });

    });
})();