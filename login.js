// =========================
// LOGIN SYSTEM
// =========================

document
    .getElementById("loginBtn")
    .addEventListener("click", function () {

        let username =
            document
                .getElementById("username")
                .value
                .trim();

        let password =
            document
                .getElementById("password")
                .value
                .trim();

        let loginError =
            document.getElementById("loginError");


        // =========================
        // CHECK EMPTY FIELDS
        // =========================

        if (
            username === "" ||
            password === ""
        ) {

            loginError.textContent =
                "Please enter username and password.";

            return;

        }


        // =========================
        // HR LOGIN
        // =========================

        if (
            username === "hr" &&
            password === "1234"
        ) {

            localStorage.setItem(
                "loggedInRole",
                "hr"
            );

            localStorage.removeItem(
                "loggedInEmployee"
            );

            window.location.href =
                "hr.html";

            return;

        }


        // =========================
        // ADMIN LOGIN
        // =========================

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "loggedInRole",
                "admin"
            );

            localStorage.removeItem(
                "loggedInEmployee"
            );

            window.location.href =
                "admin.html";

            return;

        }


        // =========================
        // EMPLOYEE LOGIN
        // =========================

        let employeeData =
            localStorage.getItem(
                "employee_" + username
            );


        // =========================
        // ACCOUNT NOT FOUND
        // =========================

        if (
            employeeData === null
        ) {

            loginError.textContent =
                "Username not found.";

            return;

        }


        // =========================
        // CONVERT JSON
        // =========================

        let employee =
            JSON.parse(employeeData);


        // =========================
        // CHECK PASSWORD
        // =========================

        if (
            employee.password !== password
        ) {

            loginError.textContent =
                "Incorrect password.";

            return;

        }


        // =========================
        // EMPLOYEE LOGIN SUCCESS
        // =========================

        localStorage.setItem(
            "loggedInEmployee",
            employee.username
        );

        localStorage.setItem(
            "loggedInRole",
            "employee"
        );


        // =========================
        // GO TO EMPLOYEE DASHBOARD
        // =========================

        window.location.href =
            "employee.html";

    });