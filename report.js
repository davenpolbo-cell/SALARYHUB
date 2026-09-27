// =========================
// ADMIN ACCESS CHECK
// =========================

let loggedInRole =
    localStorage.getItem("loggedInRole");

if (loggedInRole !== "admin") {

    window.location.href =
        "login.html";

}


// =========================
// GET PAYROLL RECORDS
// =========================

function getPayrollRecords() {

    let payrollData =
        localStorage.getItem("payrollRecords");

    if (payrollData === null) {

        return [];

    }

    try {

        return JSON.parse(payrollData);

    } catch (error) {

        return [];

    }

}


// =========================
// GET EMPLOYEES
// =========================

function getEmployees() {

    let employees = [];

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        let key =
            localStorage.key(i);

        if (
            key &&
            key.startsWith("employee_")
        ) {

            try {

                let employee =
                    JSON.parse(
                        localStorage.getItem(key)
                    );

                employees.push(employee);

            } catch (error) {

                console.log(
                    "Invalid employee data:",
                    key
                );

            }

        }

    }

    return employees;

}


// =========================
// FORMAT MONEY
// =========================

function formatMoney(amount) {

    return "₱" +
        Number(amount || 0)
            .toLocaleString(
                "en-PH",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

}


// =========================
// DISPLAY REPORT
// =========================

function displayReport(records) {

    let tableBody =
        document.getElementById(
            "reportTableBody"
        );

    tableBody.innerHTML = "";


    let totalGross = 0;

    let totalDeductions = 0;

    let totalNet = 0;


    records.forEach(function (record) {

        let row =
            document.createElement("tr");


        let employeeId =
            record.employeeId ||
            record.employeeNumber ||
            record.id ||
            "-";


        let employeeName =
            record.employeeName ||
            record.name ||
            "-";


        let payrollMonth =
            record.payrollMonth ||
            record.month ||
            "-";


        let grossPay =
            Number(
                record.grossPay || 0
            );


        let deductions =
            Number(
                record.totalDeductions || 0
            );


        let netPay =
            Number(
                record.netPay || 0
            );


        totalGross += grossPay;

        totalDeductions += deductions;

        totalNet += netPay;


        row.innerHTML = `

            <td>
                ${employeeId}
            </td>

            <td>
                ${employeeName}
            </td>

            <td>
                ${payrollMonth}
            </td>

            <td>
                ${formatMoney(grossPay)}
            </td>

            <td>
                ${formatMoney(deductions)}
            </td>

            <td>
                ${formatMoney(netPay)}
            </td>

        `;


        tableBody.appendChild(row);

    });


    document.getElementById(
        "totalPayrollRecords"
    ).textContent =
        records.length;


    document.getElementById(
        "totalGrossPay"
    ).textContent =
        formatMoney(totalGross);


    document.getElementById(
        "totalDeductions"
    ).textContent =
        formatMoney(totalDeductions);


    document.getElementById(
        "totalNetPay"
    ).textContent =
        formatMoney(totalNet);

}


// =========================
// LOAD ALL REPORTS
// =========================

function loadAllReports() {

    let records =
        getPayrollRecords();

    let employees =
        getEmployees();


    document.getElementById(
        "totalEmployees"
    ).textContent =
        employees.length;


    displayReport(records);

}


// =========================
// FILTER REPORT
// =========================

document
    .getElementById("filterReportBtn")
    .addEventListener(
        "click",
        function () {

            let selectedMonth =
                document.getElementById(
                    "reportMonth"
                ).value;


            if (selectedMonth === "") {

                loadAllReports();

                return;

            }


            let records =
                getPayrollRecords();


            let filteredRecords =
                records.filter(
                    function (record) {

                        return (
                            record.payrollMonth ===
                            selectedMonth
                        );

                    }
                );


            let employees =
                getEmployees();


            document.getElementById(
                "totalEmployees"
            ).textContent =
                employees.length;


            displayReport(
                filteredRecords
            );

        }
    );


// =========================
// SHOW ALL
// =========================

document
    .getElementById("showAllBtn")
    .addEventListener(
        "click",
        function () {

            loadAllReports();

        }
    );


// =========================
// BACK
// =========================

function goBack() {

    window.location.href =
        "admin.html";

}


// =========================
// INITIAL LOAD
// =========================

loadAllReports();