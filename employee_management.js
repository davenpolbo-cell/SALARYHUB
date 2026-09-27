// ============================
// GET EMPLOYEE TABLE
// ============================

let employeeTable =
    document.getElementById(
        "employeeTable"
    );


// ============================
// CURRENT EMPLOYEE BEING EDITED
// ============================

let currentEmployeeUsername = null;


// ============================
// LOAD EMPLOYEES
// ============================

function loadEmployees() {

    employeeTable.innerHTML = "";

    let employeesFound = false;


    // CHECK ALL LOCAL STORAGE DATA

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        let key =
            localStorage.key(i);


        // ONLY EMPLOYEE ACCOUNTS

        if (
            key.startsWith("employee_")
        ) {

            employeesFound = true;


            let employeeData =
                localStorage.getItem(key);


            let employee =
                JSON.parse(employeeData);


            // CREATE TABLE ROW

            let row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${employee.employeeId}
                </td>

                <td>
                    ${employee.employeeName}
                </td>

                <td>
                    ${employee.username}
                </td>

                <td>
                    ₱${Number(
                        employee.basicSalary
                    ).toFixed(2)}
                </td>

                <td>

                    <button
                        onclick="editEmployee('${employee.username}')">

                        Edit

                    </button>

                    <button
                        onclick="deleteEmployee('${employee.username}')">

                        Delete

                    </button>

                </td>

            `;


            employeeTable.appendChild(row);

        }

    }


    // NO EMPLOYEES

    if (!employeesFound) {

        employeeTable.innerHTML = `

            <tr>

                <td colspan="5">

                    No employee accounts found.

                </td>

            </tr>

        `;

    }

}


// ============================
// EDIT EMPLOYEE
// ============================

function editEmployee(username) {

    let employeeData =
        localStorage.getItem(
            "employee_" + username
        );


    if (employeeData === null) {

        return;

    }


    let employee =
        JSON.parse(employeeData);


    currentEmployeeUsername =
        employee.username;


    document.getElementById(
        "editEmployeeId"
    ).textContent =
        employee.employeeId;


    document.getElementById(
        "editEmployeeName"
    ).value =
        employee.employeeName;


    document.getElementById(
        "editEmployeeUsername"
    ).value =
        employee.username;


    document.getElementById(
        "editBasicSalary"
    ).value =
        employee.basicSalary;


    document.getElementById(
        "message"
    ).textContent =
        "Editing " +
        employee.employeeId;

}


// ============================
// SAVE CHANGES
// ============================

document.getElementById(
    "saveChangesBtn"
)
.addEventListener(
    "click",
    function () {

        if (
            currentEmployeeUsername === null
        ) {

            document.getElementById(
                "message"
            ).textContent =
                "Please select an employee first.";

            return;

        }


        let newName =
            document.getElementById(
                "editEmployeeName"
            ).value.trim();


        let newUsername =
            document.getElementById(
                "editEmployeeUsername"
            ).value.trim();


        let newSalary =
            Number(
                document.getElementById(
                    "editBasicSalary"
                ).value
            );


        // CHECK EMPTY FIELDS

        if (
            newName === "" ||
            newUsername === ""
        ) {

            document.getElementById(
                "message"
            ).textContent =
                "Please complete all fields.";

            return;

        }


        // CHECK SALARY

        if (
            newSalary < 0 ||
            isNaN(newSalary)
        ) {

            document.getElementById(
                "message"
            ).textContent =
                "Invalid salary.";

            return;

        }


        // GET OLD EMPLOYEE DATA

        let employeeData =
            localStorage.getItem(
                "employee_" +
                currentEmployeeUsername
            );


        if (employeeData === null) {

            return;

        }


        let employee =
            JSON.parse(employeeData);


        // CHECK NEW USERNAME

        if (
            newUsername !==
            currentEmployeeUsername
        ) {

            let existingEmployee =
                localStorage.getItem(
                    "employee_" +
                    newUsername
                );


            if (
                existingEmployee !== null
            ) {

                document.getElementById(
                    "message"
                ).textContent =
                    "Username already exists.";

                return;

            }

        }


        // UPDATE INFORMATION

        employee.employeeName =
            newName;

        employee.username =
            newUsername;

        employee.basicSalary =
            newSalary;


        // USERNAME CHANGED

        if (
            newUsername !==
            currentEmployeeUsername
        ) {

            localStorage.removeItem(
                "employee_" +
                currentEmployeeUsername
            );


            localStorage.setItem(

                "employee_" +
                newUsername,

                JSON.stringify(employee)

            );

        }

        else {

            localStorage.setItem(

                "employee_" +
                currentEmployeeUsername,

                JSON.stringify(employee)

            );

        }


        document.getElementById(
            "message"
        ).textContent =
            "Employee information updated successfully!";


        cancelEdit();

        loadEmployees();

    }
);


// ============================
// CANCEL EDIT
// ============================

document.getElementById(
    "cancelEditBtn"
)
.addEventListener(
    "click",
    function () {

        cancelEdit();

    }
);


// ============================
// CLEAR EDIT FORM
// ============================

function cancelEdit() {

    currentEmployeeUsername = null;


    document.getElementById(
        "editEmployeeId"
    ).textContent =
        "---";


    document.getElementById(
        "editEmployeeName"
    ).value =
        "";


    document.getElementById(
        "editEmployeeUsername"
    ).value =
        "";


    document.getElementById(
        "editBasicSalary"
    ).value =
        "";

}


// ============================
// DELETE EMPLOYEE
// ============================

function deleteEmployee(username) {

    let employeeData =
        localStorage.getItem(
            "employee_" + username
        );


    if (employeeData === null) {

        return;

    }


    let employee =
        JSON.parse(employeeData);


    // CONFIRM DELETE

    let confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            employee.employeeId +
            " - " +
            employee.employeeName +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    // DELETE EMPLOYEE ACCOUNT ONLY

    localStorage.removeItem(
        "employee_" + username
    );


    // CLEAR EDIT FORM IF SAME EMPLOYEE

    if (
        currentEmployeeUsername ===
        username
    ) {

        cancelEdit();

    }


    document.getElementById(
        "message"
    ).textContent =
        "Employee account deleted successfully.";


    // RELOAD TABLE

    loadEmployees();

}


// ============================
// LOAD EMPLOYEES WHEN PAGE OPENS
// ============================

loadEmployees();