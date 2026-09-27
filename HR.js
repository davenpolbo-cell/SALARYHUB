// =========================
// HR ROLE PROTECTION
// =========================

let loggedInRole =
    localStorage.getItem("loggedInRole");


if (
    loggedInRole !== "hr"
) {

    window.location.href =
        "login.html";

}


// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem(
        "loggedInRole"
    );

    localStorage.removeItem(
        "loggedInEmployee"
    );

    window.location.href =
        "login.html";

}