// =========================
// ADMIN ROLE PROTECTION
// =========================

let loggedInRole =
    localStorage.getItem("loggedInRole");


if (
    loggedInRole !== "admin"
) {

    window.location.href =
        "login.html";

}


// =========================
// COUNT EMPLOYEES
// =========================

function countEmployees() {

    let total = 0;

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        let key =
            localStorage.key(i);

        if (
            key.startsWith("employee_")
        ) {

            total++;

        }

    }

    document
        .getElementById("totalEmployees")
        .textContent = total;

}


// =========================
// COUNT PAYROLL
// =========================

function countPayroll() {

    let payrollData =
        localStorage.getItem(
            "payrollRecords"
        );

    if (
        payrollData === null
    ) {

        document
            .getElementById("totalPayroll")
            .textContent = 0;

        return;

    }

    let payrollRecords =
        JSON.parse(payrollData);

    document
        .getElementById("totalPayroll")
        .textContent =
        payrollRecords.length;

}


// =========================
// COUNT ATTENDANCE
// =========================

function countAttendance() {

    let attendanceData =
        localStorage.getItem(
            "attendanceRecords"
        );

    if (
        attendanceData === null
    ) {

        document
            .getElementById("totalAttendance")
            .textContent = 0;

        return;

    }

    let attendanceRecords =
        JSON.parse(attendanceData);

    document
        .getElementById("totalAttendance")
        .textContent =
        attendanceRecords.length;

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


// =========================
// LOAD DASHBOARD
// =========================

countEmployees();

countPayroll();

countAttendance();