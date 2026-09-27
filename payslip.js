// =========================
// ROLE CHECK
// =========================

let role =
    localStorage.getItem(
        "loggedInRole"
    );


if (
    role !== "hr" &&
    role !== "employee"
) {

    window.location.href =
        "login.html";

}


// =========================
// GET PAYROLL
// =========================

let payrollData =
    localStorage.getItem(
        "payrollRecords"
    );


let payrollRecords =
    payrollData === null
        ? []
        : JSON.parse(payrollData);


let selectedRecord = null;


// =========================
// EMPLOYEE ACCESS
// =========================

if (role === "employee") {

    let username =
        localStorage.getItem(
            "loggedInEmployee"
        );


    let employeeData =
        localStorage.getItem(
            "employee_" + username
        );


    if (employeeData === null) {

        window.location.href =
            "login.html";

    }


    let employee =
        JSON.parse(employeeData);


    let month =
        localStorage.getItem(
            "payslipMonth"
        );


    selectedRecord =
        payrollRecords.find(
            function(record) {

                return (
                    record.employeeId ===
                    employee.employeeId &&
                    (
                        month === null ||
                        record.payrollMonth === month
                    )
                );

            }
        );

}


// =========================
// HR ACCESS
// =========================

if (role === "hr") {

    let employeeId =
        localStorage.getItem(
            "payslipEmployeeNumber"
        );


    let month =
        localStorage.getItem(
            "payslipMonth"
        );


    selectedRecord =
        payrollRecords.find(
            function(record) {

                return (
                    record.employeeId ===
                    employeeId &&
                    (
                        month === null ||
                        record.payrollMonth === month
                    )
                );

            }
        );

}


// =========================
// DISPLAY
// =========================

if (
    selectedRecord === null
) {

    alert(
        "Payslip record not found."
    );

} else {

    document.getElementById(
        "resultEmployeeName"
    ).textContent =
        selectedRecord.employeeName;


    document.getElementById(
        "resultEmployeeId"
    ).textContent =
        selectedRecord.employeeId;


    document.getElementById(
        "resultPayrollMonth"
    ).textContent =
        selectedRecord.payrollMonth;


    document.getElementById(
        "resultBasicSalary"
    ).textContent =
        money(
            selectedRecord.basicSalary
        );


    document.getElementById(
        "resultDaysWorked"
    ).textContent =
        selectedRecord.daysWorked;


    document.getElementById(
        "resultAbsentDays"
    ).textContent =
        selectedRecord.absenceDays;


    document.getElementById(
        "resultGrossPay"
    ).textContent =
        money(
            selectedRecord.grossPay
        );


    document.getElementById(
        "resultSSS"
    ).textContent =
        money(
            selectedRecord.sss
        );


    document.getElementById(
        "resultPhilHealth"
    ).textContent =
        money(
            selectedRecord.philhealth
        );


    document.getElementById(
        "resultPagIBIG"
    ).textContent =
        money(
            selectedRecord.pagibig
        );


    document.getElementById(
        "resultWithholdingTax"
    ).textContent =
        money(
            selectedRecord.withholdingTax
        );


    document.getElementById(
        "resultTotalDeductions"
    ).textContent =
        money(
            selectedRecord.totalDeductions
        );


    document.getElementById(
        "resultNetPay"
    ).textContent =
        money(
            selectedRecord.netPay
        );

}


// =========================
// MONEY
// =========================

function money(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// =========================
// BACK
// =========================

function goBack() {

    if (role === "employee") {

        window.location.href =
            "employee.html";

    } else {

        window.location.href =
            "payroll_history.html";

    }

}