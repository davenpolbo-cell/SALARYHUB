let loggedInRole =
    localStorage.getItem("loggedInRole");

let username =
    localStorage.getItem("loggedInEmployee");


/* CHECK LOGIN */

if (
    loggedInRole !== "employee" ||
    username === null
) {
    window.location.href =
        "login.html";
}


/* GET EMPLOYEE */

let employeeData =
    localStorage.getItem(
        "employee_" + username
    );

if (employeeData === null) {

    localStorage.removeItem(
        "loggedInEmployee"
    );

    localStorage.removeItem(
        "loggedInRole"
    );

    window.location.href =
        "login.html";
}


let employee =
    JSON.parse(employeeData);


/* EMPLOYEE INFORMATION */

document
    .getElementById("employeeName")
    .textContent =
    employee.firstName ||
    employee.employeeName ||
    "---";


document
    .getElementById("employeeId")
    .textContent =
    employee.employeeId ||
    "---";


document
    .getElementById("employeeFullName")
    .textContent =
    employee.employeeName ||
    "---";


document
    .getElementById("birthDate")
    .textContent =
    employee.birthDate ||
    "---";


document
    .getElementById("age")
    .textContent =
    employee.age ||
    "---";


document
    .getElementById("gender")
    .textContent =
    employee.gender ||
    "---";


document
    .getElementById("contactNumber")
    .textContent =
    employee.contactNumber ||
    "---";


document
    .getElementById("email")
    .textContent =
    employee.email ||
    "---";


document
    .getElementById("address")
    .textContent =
    employee.address ||
    "---";


/* EMPLOYMENT INFORMATION */

document
    .getElementById("position")
    .textContent =
    employee.position ||
    "---";


document
    .getElementById("department")
    .textContent =
    employee.department ||
    "---";


document
    .getElementById("employmentStatus")
    .textContent =
    employee.employmentStatus ||
    "---";


document
    .getElementById("dateHired")
    .textContent =
    employee.dateHired ||
    "---";


document
    .getElementById("employeeUsername")
    .textContent =
    employee.username ||
    "---";


/* SALARY */

document
    .getElementById("basicSalary")
    .textContent =
    Number(
        employee.basicSalary || 0
    ).toFixed(2);


/* =========================
   ATTENDANCE
========================= */

function loadAttendance() {

    let attendanceContainer =
        document.getElementById(
            "attendanceContainer"
        );

    let attendanceData =
        localStorage.getItem(
            "attendanceRecords"
        );

    if (
        attendanceData === null
    ) {
        attendanceContainer.innerHTML =
            '<p class="empty-message">No attendance records found.</p>';

        return;
    }


    let attendanceRecords =
        JSON.parse(attendanceData);


    let myAttendance = [];


    for (
        let i = 0;
        i < attendanceRecords.length;
        i++
    ) {

        if (
            attendanceRecords[i].employeeId ===
            employee.employeeId
        ) {

            myAttendance.push(
                attendanceRecords[i]
            );
        }
    }


    if (
        myAttendance.length === 0
    ) {

        attendanceContainer.innerHTML =
            '<p class="empty-message">No attendance records found.</p>';

        return;
    }


    attendanceContainer.innerHTML = "";


    for (
        let i = 0;
        i < myAttendance.length;
        i++
    ) {

        let record =
            myAttendance[i];


        let attendanceHTML = `
            <div class="attendance-record">

                <p>
                    <strong>Date:</strong>
                    ${record.date || "---"}
                </p>

                <p>
                    <strong>Time In:</strong>
                    ${record.timeIn || "---"}
                </p>

                <p>
                    <strong>Time Out:</strong>
                    ${record.timeOut || "---"}
                </p>

                <p>
                    <strong>Hours Worked:</strong>
                    ${Number(record.hoursWorked || 0).toFixed(2)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${record.status || "---"}
                </p>

            </div>
        `;


        attendanceContainer.innerHTML +=
            attendanceHTML;
    }
}


/* =========================
   PAYROLL HISTORY
========================= */

function loadPayrollHistory() {

    let payrollContainer =
        document.getElementById(
            "payrollHistoryContainer"
        );

    let payrollData =
        localStorage.getItem(
            "payrollRecords"
        );


    if (
        payrollData === null
    ) {

        payrollContainer.innerHTML =
            '<p class="empty-message">No payroll records found.</p>';

        return;
    }


    let payrollRecords =
        JSON.parse(payrollData);


    let myPayroll = [];


    for (
        let i = 0;
        i < payrollRecords.length;
        i++
    ) {

        if (
            payrollRecords[i].employeeId ===
            employee.employeeId
        ) {

            myPayroll.push(
                payrollRecords[i]
            );
        }
    }


    if (
        myPayroll.length === 0
    ) {

        payrollContainer.innerHTML =
            '<p class="empty-message">No payroll records found.</p>';

        return;
    }


    payrollContainer.innerHTML = "";


    for (
        let i = 0;
        i < myPayroll.length;
        i++
    ) {

        let payroll =
            myPayroll[i];


        let payrollHTML = `
            <div class="payroll-record">

                <h3>
                    ${payroll.payrollMonth || "---"}
                </h3>

                <p>
                    Basic Salary:
                    ₱${Number(
                        payroll.basicSalary || 0
                    ).toFixed(2)}
                </p>

                <p>
                    Gross Pay:
                    ₱${Number(
                        payroll.grossPay || 0
                    ).toFixed(2)}
                </p>

                <p>
                    Total Deductions:
                    ₱${Number(
                        payroll.totalDeductions || 0
                    ).toFixed(2)}
                </p>

                <p>
                    Net Pay:
                    ₱${Number(
                        payroll.netPay || 0
                    ).toFixed(2)}
                </p>

            </div>
        `;


        payrollContainer.innerHTML +=
            payrollHTML;
    }
}


/* =========================
   VIEW PAYSLIP
========================= */

document
    .getElementById("viewPayslipBtn")
    .addEventListener(
        "click",
        function () {

            let payrollMonth =
                document
                    .getElementById(
                        "employeePayslipMonth"
                    )
                    .value;


            let payslipMessage =
                document.getElementById(
                    "payslipMessage"
                );


            if (
                payrollMonth === ""
            ) {

                payslipMessage.textContent =
                    "Please select payroll month.";

                return;
            }


            let payrollData =
                localStorage.getItem(
                    "payrollRecords"
                );


            if (
                payrollData === null
            ) {

                payslipMessage.textContent =
                    "No payroll records found.";

                return;
            }


            let payrollRecords =
                JSON.parse(payrollData);


            let payrollFound = false;


            for (
                let i = 0;
                i < payrollRecords.length;
                i++
            ) {

                if (
                    payrollRecords[i].employeeId ===
                    employee.employeeId
                    &&
                    payrollRecords[i].payrollMonth ===
                    payrollMonth
                ) {

                    payrollFound = true;

                    break;
                }
            }


            if (
                !payrollFound
            ) {

                payslipMessage.textContent =
                    "No payslip found for " +
                    payrollMonth + ".";

                return;
            }


            /*
                Save the employee ID and month
                for payslip.html
            */

            localStorage.setItem(
                "payslipEmployeeNumber",
                employee.employeeId.replace(
                    "EMP",
                    ""
                )
            );


            localStorage.setItem(
                "payslipMonth",
                payrollMonth
            );


            window.location.href =
                "payslip.html";
        }
    );


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem(
        "loggedInEmployee"
    );

    localStorage.removeItem(
        "loggedInRole"
    );

    window.location.href =
        "login.html";
}


/* LOAD DATA */

loadAttendance();

loadPayrollHistory();