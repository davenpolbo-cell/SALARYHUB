document.getElementById("managerLoginBtn")
    .addEventListener("click", function () {

        let username =
            document.getElementById("username").value.trim();

        let password =
            document.getElementById("password").value.trim();

        let loginError =
            document.getElementById("loginError");


        // CHECK EMPTY FIELDS

        if (username === "" || password === "") {

            loginError.textContent =
                "Please enter username and password.";

            return;

        }


        // MANAGER ACCOUNT

        if (
            username === "manager" &&
            password === "1234"
        ) {

            localStorage.setItem(
                "loggedInRole",
                "manager"
            );


            window.location.href =
                "manager.html";

            return;

        }


        // WRONG LOGIN

        loginError.textContent =
            "Incorrect manager username or password.";

    });