// =========================
// CREATE EMPLOYEE ACCOUNT
// =========================

document
    .getElementById("createAccountBtn")
    .addEventListener("click", function () {


        // =========================
        // GET PERSONAL INFORMATION
        // =========================

        let firstName =
            document.getElementById("firstName").value.trim();

        let middleName =
            document.getElementById("middleName").value.trim();

        let lastName =
            document.getElementById("lastName").value.trim();

        let suffix =
            document.getElementById("suffix").value;

        let birthDate =
            document.getElementById("birthDate").value;

        let age =
            document.getElementById("age").value;

        let gender =
            document.getElementById("gender").value;

        let address =
            document.getElementById("address").value.trim();

        let contactNumber =
            document.getElementById("contactNumber").value.trim();

        let email =
            document.getElementById("email").value.trim();


        // =========================
        // GET EMPLOYMENT INFORMATION
        // =========================

        let position =
            document.getElementById("position").value.trim();

        let department =
            document.getElementById("department").value;

        let employmentStatus =
            document.getElementById("employmentStatus").value;

        let dateHired =
            document.getElementById("dateHired").value;


        // =========================
        // GET ACCOUNT INFORMATION
        // =========================

        let username =
            document
                .getElementById("employeeUsername")
                .value
                .trim();

        let password =
            document
                .getElementById("employeePassword")
                .value
                .trim();

        let confirmPassword =
            document
                .getElementById("confirmPassword")
                .value
                .trim();


        let message =
            document.getElementById("message");


        // =========================
        // CHECK REQUIRED FIELDS
        // =========================

        if (
            firstName === "" ||
            lastName === "" ||
            birthDate === "" ||
            gender === "" ||
            address === "" ||
            contactNumber === "" ||
            email === "" ||
            position === "" ||
            department === "" ||
            employmentStatus === "" ||
            dateHired === "" ||
            username === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            message.textContent =
                "Please complete all required fields.";

            return;
        }


        // =========================
        // CHECK PASSWORD
        // =========================

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        // =========================
        // CHECK USERNAME
        // =========================

        let existingEmployee =
            localStorage.getItem(
                "employee_" + username
            );


        if (existingEmployee !== null) {

            message.textContent =
                "Username already exists.";

            return;
        }


        // =========================
        // GENERATE EMPLOYEE ID
        // =========================

        let employeeNumber =
            Number(
                localStorage.getItem(
                    "lastEmployeeNumber"
                )
            ) || 0;

        employeeNumber++;


        let employeeId =
            "EMP" +
            String(employeeNumber)
                .padStart(3, "0");


        // =========================
        // CREATE FULL NAME
        // =========================

        let fullName =
            firstName + " ";

        if (middleName !== "") {

            fullName +=
                middleName + " ";

        }

        fullName += lastName;


        if (suffix !== "") {

            fullName +=
                " " + suffix;

        }


        // =========================
        // CREATE EMPLOYEE OBJECT
        // =========================

        let employee = {

            employeeId: employeeId,

            firstName: firstName,

            middleName: middleName,

            lastName: lastName,

            suffix: suffix,

            employeeName: fullName,

            birthDate: birthDate,

            age: Number(age),

            gender: gender,

            address: address,

            contactNumber: contactNumber,

            email: email,

            position: position,

            department: department,

            employmentStatus: employmentStatus,

            dateHired: dateHired,

            username: username,

            password: password,

            basicSalary: 0

        };


        // =========================
        // SAVE EMPLOYEE
        // =========================

        localStorage.setItem(
            "employee_" + username,
            JSON.stringify(employee)
        );


        // =========================
        // SAVE LAST EMPLOYEE NUMBER
        // =========================

        localStorage.setItem(
            "lastEmployeeNumber",
            employeeNumber
        );


        // =========================
        // CHECK SAVED DATA
        // =========================

        let savedEmployee =
            localStorage.getItem(
                "employee_" + username
            );


        console.log(
            "Employee account saved:",
            savedEmployee
        );


        // =========================
        // SUCCESS MESSAGE
        // =========================

        message.textContent =
            "Account created successfully! Employee ID: " +
            employeeId;


        // =========================
        // CLEAR FORM
        // =========================

        document
            .getElementById("employeeForm")
            .reset();


        // =========================
        // GO TO LOGIN
        // =========================

        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1500);

    });


// =========================
// AUTOMATIC AGE CALCULATION
// =========================

document
    .getElementById("birthDate")
    .addEventListener("change", function () {

        let birthDate =
            new Date(this.value);

        let today =
            new Date();

        let age =
            today.getFullYear() -
            birthDate.getFullYear();


        let monthDifference =
            today.getMonth() -
            birthDate.getMonth();


        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {

            age--;

        }


        if (age >= 0) {

            document
                .getElementById("age")
                .value = age;

        }

    });