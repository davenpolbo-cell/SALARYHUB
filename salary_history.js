// =========================
// HR ACCESS
// =========================

let loggedInRole =
    localStorage.getItem("loggedInRole");


if (loggedInRole !== "hr") {

    window.location.href =
        "login.html";

}


// =========================
// VARIABLES
// =========================

let selectedEmployee = null;


// =========================
// HIDE EMPLOYEE SECTION
// =========================

document.getElementById(
    "employeeSection"
).style.display = "none";


document.getElementById(
    "salarySection"
).style.display = "none";


// =========================
// SEARCH EMPLOYEE
// =========================

document
    .getElementById("searchEmployeeBtn")
    .addEventListener(
        "click",
        function () {

            let employeeId =
                document
                    .getElementById(
                        "employeeNumber"
                    )
                    .value
                    .trim()
                    .toUpperCase();


            if (employeeId === "") {

                document.getElementById(
                    "searchMessage"
                ).textContent =
                    "Please enter an Employee ID.";

                return;

            }


            // Allow 001 or EMP001

            if (
                !employeeId.startsWith("EMP")
            ) {

                employeeId =
                    "EMP" +
                    employeeId;

            }


            selectedEmployee =
                findEmployee(employeeId);


            if (
                selectedEmployee === null
            ) {

                document.getElementById(
                    "searchMessage"
                ).textContent =
                    "Employee not found.";

                document.getElementById(
                    "employeeSection"
                ).style.display = "none";

                document.getElementById(
                    "salarySection"
                ).style.display = "none";

                return;

            }


            document.getElementById(
                "searchMessage"
            ).textContent =
                "";


            displayEmployee();

            displaySalaryHistory();

        }
    );


// =========================
// FIND EMPLOYEE
// =========================

function findEmployee(employeeId) {

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


                if (
                    employee.employeeId ===
                    employeeId
                ) {

                    return employee;

                }

            } catch (error) {

                console.log(error);

            }

        }

    }


    return null;

}


// =========================
// DISPLAY EMPLOYEE
// =========================

function displayEmployee() {

    document.getElementById(
        "employeeSection"
    ).style.display = "block";


    document.getElementById(
        "salarySection"
    ).style.display = "block";


    document.getElementById(
        "resultEmployeeId"
    ).textContent =
        selectedEmployee.employeeId;


    document.getElementById(
        "resultEmployeeName"
    ).textContent =
        selectedEmployee.employeeName;


    document.getElementById(
        "currentSalary"
    ).textContent =
        money(
            selectedEmployee.basicSalary
        );

}


// =========================
// GET SALARY HISTORY
// =========================

function getSalaryHistory() {

    let data =
        localStorage.getItem(
            "salaryHistory"
        );


    if (data === null) {

        return [];

    }


    try {

        return JSON.parse(data);

    } catch (error) {

        return [];

    }

}


// =========================
// SAVE SALARY HISTORY
// =========================

function saveSalaryHistory(records) {

    localStorage.setItem(
        "salaryHistory",
        JSON.stringify(records)
    );

}


// =========================
// DISPLAY HISTORY
// =========================

function displaySalaryHistory() {

    let records =
        getSalaryHistory();


    let employeeRecords =
        records.filter(
            function(record) {

                return (
                    record.employeeId ===
                    selectedEmployee.employeeId
                );

            }
        );


    let table =
        document.getElementById(
            "salaryHistoryBody"
        );


    table.innerHTML = "";


    if (
        employeeRecords.length === 0
    ) {

        let row =
            document.createElement("tr");


        row.innerHTML = `

            <td colspan="5">
                No salary history found.
            </td>

        `;


        table.appendChild(row);

        return;

    }


    employeeRecords.sort(
        function(a, b) {

            return (
                new Date(b.effectiveDate) -
                new Date(a.effectiveDate)
            );

        }
    );


    employeeRecords.forEach(
        function(record) {

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
                    ₱${money(record.basicSalary)}
                </td>

                <td>
                    ${record.effectiveDate}
                </td>

                <td>
                    ${record.updatedDate}
                </td>

            `;


            table.appendChild(row);

        }
    );

}


// =========================
// UPDATE SALARY
// =========================

document
    .getElementById("updateSalaryBtn")
    .addEventListener(
        "click",
        function () {

            if (
                selectedEmployee === null
            ) {

                return;

            }


            let newSalary =
                Number(
                    document.getElementById(
                        "newSalary"
                    ).value
                );


            let effectiveDate =
                document.getElementById(
                    "effectiveDate"
                ).value;


            let message =
                document.getElementById(
                    "updateMessage"
                );


            if (
                newSalary <= 0
            ) {

                message.textContent =
                    "Enter a valid salary.";

                return;

            }


            if (
                effectiveDate === ""
            ) {

                message.textContent =
                    "Please select the effective date.";

                return;

            }


            let oldSalary =
                Number(
                    selectedEmployee.basicSalary ||
                    0
                );


            // =========================
            // SAVE HISTORY
            // =========================

            let history =
                getSalaryHistory();


            let historyRecord = {

                employeeId:
                    selectedEmployee.employeeId,

                employeeName:
                    selectedEmployee.employeeName,

                oldSalary:
                    oldSalary,

                basicSalary:
                    newSalary,

                effectiveDate:
                    effectiveDate,

                updatedDate:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            };


            history.push(
                historyRecord
            );


            saveSalaryHistory(history);


            // =========================
            // UPDATE EMPLOYEE
            // =========================

            selectedEmployee.basicSalary =
                newSalary;


            localStorage.setItem(

                "employee_" +
                selectedEmployee.username,

                JSON.stringify(
                    selectedEmployee
                )

            );


            // =========================
            // UPDATE DISPLAY
            // =========================

            document.getElementById(
                "currentSalary"
            ).textContent =
                money(newSalary);


            document.getElementById(
                "newSalary"
            ).value = "";


            document.getElementById(
                "effectiveDate"
            ).value = "";


            message.textContent =
                "Salary updated successfully.";


            displaySalaryHistory();

        }
    );


// =========================
// MONEY FORMAT
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

    window.location.href =
        "hr.html";

}