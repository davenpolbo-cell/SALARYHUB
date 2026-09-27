// ============================
// CURRENT EMPLOYEE
// ============================

let currentEmployee = null;


// ============================
// SEARCH EMPLOYEE
// ============================

document.getElementById("searchEmployeeBtn")
    .addEventListener("click", function () {

        let employeeNumber =
            document.getElementById("employeeNumber").value.trim();

        let employeeInfo =
            document.getElementById("employeeInfo");


        if (employeeNumber === "") {

            employeeInfo.textContent =
                "Please enter Employee ID.";

            return;

        }


        let employeeId =
            "EMP" +
            String(employeeNumber).padStart(3, "0");


        currentEmployee = null;


        // SEARCH EMPLOYEE

        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            let key =
                localStorage.key(i);


            if (key.startsWith("employee_")) {

                let employeeData =
                    localStorage.getItem(key);

                let employee =
                    JSON.parse(employeeData);


                if (
                    employee.employeeId ===
                    employeeId
                ) {

                    currentEmployee =
                        employee;

                    break;

                }

            }

        }


        // EMPLOYEE NOT FOUND

        if (currentEmployee === null) {

            employeeInfo.textContent =
                employeeId + " not found.";

            return;

        }


        employeeInfo.textContent =
            "Employee Found: " +
            currentEmployee.employeeName +
            " (" +
            currentEmployee.employeeId +
            ")";

    });


// ============================
// SAVE ATTENDANCE
// ============================

document.getElementById("saveAttendanceBtn")
    .addEventListener("click", function () {


        // CHECK EMPLOYEE

        if (currentEmployee === null) {

            alert(
                "Please search for an employee first."
            );

            return;

        }


        // GET TIME

        let timeIn =
            document.getElementById("timeIn").value;

        let timeOut =
            document.getElementById("timeOut").value;


        // CHECK TIME

        if (
            timeIn === "" ||
            timeOut === ""
        ) {

            alert(
                "Please enter Time In and Time Out."
            );

            return;

        }


        // CHECK TIME ORDER

        let start =
            new Date(
                "2000-01-01 " + timeIn
            );

        let end =
            new Date(
                "2000-01-01 " + timeOut
            );


        if (end <= start) {

            alert(
                "Time Out must be later than Time In."
            );

            return;

        }


        // ============================
        // GET TODAY'S DATE
        // ============================

        let today =
      new Date().toISOString().split("T")[0];


        // ============================
        // GET EXISTING ATTENDANCE
        // ============================

        let attendanceData =
            localStorage.getItem(
                "attendanceRecords"
            );


        let attendanceRecords;


        if (attendanceData === null) {

            attendanceRecords = [];

        }

        else {

            attendanceRecords =
                JSON.parse(attendanceData);

        }


        // ============================
        // CHECK DUPLICATE ATTENDANCE
        // ============================

        for (
            let i = 0;
            i < attendanceRecords.length;
            i++
        ) {

            if (
                attendanceRecords[i].employeeId ===
                currentEmployee.employeeId
                &&
                attendanceRecords[i].date ===
                today
            ) {

                alert(
                    "Attendance already recorded for this employee today."
                );

                return;

            }

        }


        // ============================
        // CALCULATE HOURS
        // ============================

        let difference =
            end - start;


        let hoursWorked =
            difference /
            (1000 * 60 * 60);


        // ============================
        // DETERMINE STATUS
        // ============================

        let status;


        if (hoursWorked >= 8) {

            status = "FULL DAY";

        }

        else if (hoursWorked >= 4) {

            status = "HALF DAY";

        }

        else {

            status = "ABSENT";

        }


        // ============================
        // CREATE ATTENDANCE RECORD
        // ============================

        let attendanceRecord = {

            employeeId:
                currentEmployee.employeeId,

            employeeName:
                currentEmployee.employeeName,

            date:
                today,

            timeIn:
                timeIn,

            timeOut:
                timeOut,

            hoursWorked:
                hoursWorked,

            status:
                status

        };


        // ============================
        // SAVE RECORD
        // ============================

        attendanceRecords.push(
            attendanceRecord
        );


        localStorage.setItem(
            "attendanceRecords",
            JSON.stringify(
                attendanceRecords
            )
        );


        // ============================
        // DISPLAY RESULT
        // ============================

        document.getElementById(
            "resultName"
        ).textContent =
            currentEmployee.employeeName;


        document.getElementById(
            "resultId"
        ).textContent =
            currentEmployee.employeeId;


        document.getElementById(
            "resultTimeIn"
        ).textContent =
            timeIn;


        document.getElementById(
            "resultTimeOut"
        ).textContent =
            timeOut;


        document.getElementById(
            "hoursWorked"
        ).textContent =
            hoursWorked.toFixed(2);


        document.getElementById(
            "attendanceStatus"
        ).textContent =
            status;


        alert(
            "Attendance saved successfully!"
        );

    });