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

function getPayrollRecords() {

    let data =
        localStorage.getItem(
            "payrollRecords"
        );

    if (data === null) {

        return [];

    }

    return JSON.parse(data);

}


// =========================
// DISPLAY
// =========================

function displayHistory() {

    let records =
        getPayrollRecords();


    let table =
        document.getElementById(
            "historyTableBody"
        );


    table.innerHTML = "";


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

            return;

        }


        let employee =
            JSON.parse(employeeData);


        records =
            records.filter(
                function(record) {

                    return (
                        record.employeeId ===
                        employee.employeeId
                    );

                }
            );

    }


    records.forEach(
        function(record, index) {

            let row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${record.employeeId}
                </td>

                <td>
                    ${record.employeeName}
                </td>

                <td>
                    ${record.payrollMonth}
                </td>

                <td>
                    ₱${money(record.grossPay)}
                </td>

                <td>
                    ₱${money(record.totalDeductions)}
                </td>

                <td>
                    ₱${money(record.netPay)}
                </td>

                <td>

                    <button
                        class="action-button"
                        onclick="viewPayslip(
                            '${record.employeeId}',
                            '${record.payrollMonth}'
                        )"
                    >
                        VIEW
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// =========================
// VIEW PAYSLIP
// =========================

function viewPayslip(
    employeeId,
    month
) {

    localStorage.setItem(
        "payslipEmployeeNumber",
        employeeId
    );


    localStorage.setItem(
        "payslipMonth",
        month
    );


    window.location.href =
        "payslip.html";

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
            "hr.html";

    }

}


displayHistory();