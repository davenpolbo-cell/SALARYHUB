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

let currentPayroll = null;

let attendanceSummary = {

    fullDays: 0,

    halfDays: 0,

    daysWorked: 0,

    absentDays: 0,

    workingDays: 0

};


// =========================
// GET EMPLOYEE
// =========================

document
    .getElementById("searchEmployeeBtn")
    .addEventListener(
        "click",
        function () {

            let number =
                document
                    .getElementById(
                        "employeeNumber"
                    )
                    .value
                    .trim();


            if (number === "") {

                alert(
                    "Enter employee number."
                );

                return;

            }


            let payrollMonth =
                document.getElementById(
                    "payrollMonth"
                ).value;


            if (payrollMonth === "") {

                alert(
                    "Select payroll month."
                );

                return;

            }


            let cutoff =
                document.getElementById(
                    "payrollCutoff"
                ).value;


            if (cutoff === "") {

                alert(
                    "Select payroll cutoff."
                );

                return;

            }


            number =
                number
                    .toUpperCase()
                    .replace("EMP", "");


            let employeeId =
                "EMP" +
                String(
                    Number(number)
                ).padStart(3, "0");


            selectedEmployee = null;


            for (
                let i = 0;
                i < localStorage.length;
                i++
            ) {

                let key =
                    localStorage.key(i);


                if (
                    key &&
                    key.startsWith(
                        "employee_"
                    )
                ) {

                    let data =
                        localStorage.getItem(
                            key
                        );


                    try {

                        let employee =
                            JSON.parse(data);


                        if (
                            employee.employeeId ===
                            employeeId
                        ) {

                            selectedEmployee =
                                employee;

                            break;

                        }

                    } catch (error) {

                        console.log(error);

                    }

                }

            }


            if (
                selectedEmployee === null
            ) {

                alert(
                    "Employee not found."
                );

                return;

            }


            document.getElementById(
                "resultName"
            ).textContent =
                selectedEmployee.employeeName;


            document.getElementById(
                "resultId"
            ).textContent =
                selectedEmployee.employeeId;


            document.getElementById(
                "basicSalary"
            ).textContent =
                money(
                    selectedEmployee.basicSalary
                );


            loadSalaryHistory();

            loadAttendanceDays();

        }
    );


// =========================
// PAYROLL MONTH CHANGE
// =========================

document
    .getElementById("payrollMonth")
    .addEventListener(
        "change",
        function () {

            if (
                selectedEmployee !== null
            ) {

                loadSalaryHistory();

                loadAttendanceDays();

            }

        }
    );


// =========================
// CUTOFF CHANGE
// =========================

document
    .getElementById("payrollCutoff")
    .addEventListener(
        "change",
        function () {

            if (
                selectedEmployee !== null
            ) {

                loadSalaryHistory();

                loadAttendanceDays();

            }

        }
    );


// =========================
// GET CUTOFF RANGE
// =========================

function getCutoffRange() {

    let payrollMonth =
        document.getElementById(
            "payrollMonth"
        ).value;


    let cutoff =
        document.getElementById(
            "payrollCutoff"
        ).value;


    if (
        payrollMonth === "" ||
        cutoff === ""
    ) {

        return null;

    }


    let year =
        Number(
            payrollMonth.substring(
                0,
                4
            )
        );


    let month =
        Number(
            payrollMonth.substring(
                5,
                7
            )
        );


    let startDay;

    let endDay;


    if (
        cutoff === "1-15"
    ) {

        startDay = 1;

        endDay = 15;

    } else {

        startDay = 16;

        endDay =
            new Date(
                year,
                month,
                0
            ).getDate();

    }


    return {

        year: year,

        month: month,

        startDay: startDay,

        endDay: endDay

    };

}


// =========================
// CHECK WEEKDAY
// =========================

function isWeekday(
    year,
    month,
    day
) {

    let date =
        new Date(
            year,
            month - 1,
            day
        );


    let dayOfWeek =
        date.getDay();


    return (
        dayOfWeek !== 0 &&
        dayOfWeek !== 6
    );

}


// =========================
// GET MONTH WORKING DAYS
// =========================

function getMonthWorkingDays(
    year,
    month
) {

    let lastDay =
        new Date(
            year,
            month,
            0
        ).getDate();


    let count = 0;


    for (
        let day = 1;
        day <= lastDay;
        day++
    ) {

        if (
            isWeekday(
                year,
                month,
                day
            )
        ) {

            count++;

        }

    }


    return count;

}


// =========================
// LOAD ATTENDANCE
// =========================

function loadAttendanceDays() {

    if (
        selectedEmployee === null
    ) {

        return;

    }


    let range =
        getCutoffRange();


    if (
        range === null
    ) {

        return;

    }


    let attendanceData =
        localStorage.getItem(
            "attendanceRecords"
        );


    let records = [];


    if (
        attendanceData !== null
    ) {

        try {

            records =
                JSON.parse(
                    attendanceData
                );

        } catch (error) {

            records = [];

        }

    }


    // =========================
    // FILTER CUTOFF
    // =========================

    let cutoffRecords =
        records.filter(
            function(record) {

                if (
                    record.employeeId !==
                    selectedEmployee.employeeId
                ) {

                    return false;

                }


                if (
                    !record.date
                ) {

                    return false;

                }


                let recordDate =
                    new Date(
                        record.date
                    );


                let year =
                    recordDate.getFullYear();


                let month =
                    recordDate.getMonth() + 1;


                let day =
                    recordDate.getDate();


                return (
                    year === range.year &&
                    month === range.month &&
                    day >= range.startDay &&
                    day <= range.endDay
                );

            }
        );


    // =========================
    // COUNT ATTENDANCE
    // =========================

    let fullDays = 0;

    let halfDays = 0;


    cutoffRecords.forEach(
        function(record) {

            let status =
                String(
                    record.status || ""
                ).toLowerCase();


            if (
                status === "half day"
            ) {

                halfDays++;

            } else {

                fullDays++;

            }

        }
    );


    let daysWorked =
        fullDays +
        (halfDays * 0.5);


    // =========================
    // WORKING DAYS
    // =========================

    let workingDays = 0;


    for (
        let day = range.startDay;
        day <= range.endDay;
        day++
    ) {

        if (
            isWeekday(
                range.year,
                range.month,
                day
            )
        ) {

            workingDays++;

        }

    }


    let absentDays =
        Math.max(
            0,
            workingDays -
            daysWorked
        );


    attendanceSummary = {

        fullDays: fullDays,

        halfDays: halfDays,

        daysWorked: daysWorked,

        absentDays: absentDays,

        workingDays: workingDays

    };


    // =========================
    // DISPLAY
    // =========================

    document.getElementById(
        "resultCutoff"
    ).textContent =
        range.startDay +
        " - " +
        range.endDay;


    document.getElementById(
        "workingDays"
    ).textContent =
        workingDays;


    document.getElementById(
        "fullDays"
    ).textContent =
        fullDays;


    document.getElementById(
        "halfDays"
    ).textContent =
        halfDays;


    document.getElementById(
        "daysWorked"
    ).textContent =
        daysWorked;


    document.getElementById(
        "absentDays"
    ).textContent =
        absentDays;

}


// =========================
// LOAD SALARY HISTORY
// =========================

function loadSalaryHistory() {

    if (
        selectedEmployee === null
    ) {

        return;

    }


    let payrollMonth =
        document.getElementById(
            "payrollMonth"
        ).value;


    if (
        payrollMonth === ""
    ) {

        return;

    }


    let cutoff =
        document.getElementById(
            "payrollCutoff"
        ).value;


    let range =
        getCutoffRange();


    let currentSalary =
        Number(
            selectedEmployee.basicSalary ||
            0
        );


    let effectiveDate = "-";


    let historyData =
        localStorage.getItem(
            "salaryHistory"
        );


    if (
        historyData !== null
    ) {

        try {

            let history =
                JSON.parse(
                    historyData
                );


            let employeeHistory =
                history.filter(
                    function(record) {

                        return (
                            record.employeeId ===
                            selectedEmployee.employeeId
                        );

                    }
                );


            if (
                employeeHistory.length > 0
            ) {

                // Sort oldest to newest

                employeeHistory.sort(
                    function(a, b) {

                        return (
                            new Date(
                                a.effectiveDate
                            ) -
                            new Date(
                                b.effectiveDate
                            )
                        );

                    }
                );


                let cutoffEndDate =
                    new Date(
                        range.year,
                        range.month - 1,
                        range.endDay
                    );


                let applicableSalary = null;


                employeeHistory.forEach(
                    function(record) {

                        let recordDate =
                            new Date(
                                record.effectiveDate
                            );


                        if (
                            recordDate <=
                            cutoffEndDate
                        ) {

                            applicableSalary =
                                Number(
                                    record.basicSalary
                                );

                            effectiveDate =
                                record.effectiveDate;

                        }

                    }
                );


                if (
                    applicableSalary !== null
                ) {

                    currentSalary =
                        applicableSalary;

                }

            }

        } catch (error) {

            console.log(
                "Salary history error:",
                error
            );

        }

    }


    document.getElementById(
        "salaryUsed"
    ).textContent =
        money(currentSalary);


    document.getElementById(
        "salaryEffectiveDate"
    ).textContent =
        effectiveDate;


    // Keep employee's current salary visible

    document.getElementById(
        "basicSalary"
    ).textContent =
        money(
            selectedEmployee.basicSalary
        );

}


// =========================
// GET SALARY FOR PAYROLL
// =========================

function getSalaryForPayroll() {

    let salary =
        Number(
            document
                .getElementById(
                    "salaryUsed"
                )
                .textContent
                .replace(/,/g, "")
        );


    return salary || 0;

}


// =========================
// CALCULATE PAYROLL
// =========================

document
    .getElementById(
        "calculatePayrollBtn"
    )
    .addEventListener(
        "click",
        calculatePayroll
    );


function calculatePayroll() {

    if (
        selectedEmployee === null
    ) {

        alert(
            "Search an employee first."
        );

        return;

    }


    let payrollMonth =
        document.getElementById(
            "payrollMonth"
        ).value;


    if (
        payrollMonth === ""
    ) {

        alert(
            "Select payroll month."
        );

        return;

    }


    let cutoff =
        document.getElementById(
            "payrollCutoff"
        ).value;


    if (
        cutoff === ""
    ) {

        alert(
            "Select payroll cutoff."
        );

        return;

    }


    let basicSalary =
        getSalaryForPayroll();


    if (
        basicSalary <= 0
    ) {

        alert(
            "Please set the employee basic salary first."
        );

        return;

    }


    // =========================
    // ATTENDANCE
    // =========================

    loadAttendanceDays();


    let workingDays =
        attendanceSummary.workingDays;


    let daysWorked =
        attendanceSummary.daysWorked;


    let absenceDays =
        attendanceSummary.absentDays;


    if (
        workingDays <= 0
    ) {

        alert(
            "No working days found."
        );

        return;

    }


    // =========================
    // EARNINGS
    // =========================

    let overtimePay =
        Number(
            document.getElementById(
                "overtimePay"
            ).value
        ) || 0;


    let holidayPay =
        Number(
            document.getElementById(
                "holidayPay"
            ).value
        ) || 0;


    let otherEarnings =
        Number(
            document.getElementById(
                "otherEarnings"
            ).value
        ) || 0;


    // =========================
    // DAILY RATE
    // =========================

    let range =
        getCutoffRange();


    let totalMonthWorkingDays =
        getMonthWorkingDays(
            range.year,
            range.month
        );


    let dailyRate =
        basicSalary /
        totalMonthWorkingDays;


    // =========================
    // BASIC PAY
    // =========================

    let basicPay =
        dailyRate *
        daysWorked;


    // =========================
    // ABSENCE
    // =========================

    let absenceDeduction =
        dailyRate *
        absenceDays;


    // =========================
    // GROSS PAY
    // =========================

    let grossPay =
        basicPay +
        overtimePay +
        holidayPay +
        otherEarnings;


    /*
        SCHOOL PROJECT SAMPLE RATES

        These can be replaced with
        professor-required rates.
    */

    let sss =
        grossPay * 0.05;


    let philhealth =
        grossPay * 0.025;


    let pagibig =
        Math.min(
            grossPay * 0.02,
            200
        );


    let taxableIncome =
        grossPay -
        sss -
        philhealth -
        pagibig;


    let withholdingTax = 0;


    if (
        taxableIncome > 20833
    ) {

        withholdingTax =
            (
                taxableIncome -
                20833
            ) * 0.15;

    }


    // =========================
    // TOTAL DEDUCTIONS
    // =========================

    let totalDeductions =
        sss +
        philhealth +
        pagibig +
        withholdingTax +
        absenceDeduction;


    // =========================
    // NET PAY
    // =========================

    let netPay =
        grossPay -
        totalDeductions;


    // =========================
    // DISPLAY
    // =========================

    document.getElementById(
        "sss"
    ).textContent =
        money(sss);


    document.getElementById(
        "philhealth"
    ).textContent =
        money(philhealth);


    document.getElementById(
        "pagibig"
    ).textContent =
        money(pagibig);


    document.getElementById(
        "withholdingTax"
    ).textContent =
        money(withholdingTax);


    document.getElementById(
        "absenceDeduction"
    ).textContent =
        money(absenceDeduction);


    document.getElementById(
        "totalDeductions"
    ).textContent =
        money(totalDeductions);


    document.getElementById(
        "basicPay"
    ).textContent =
        money(basicPay);


    document.getElementById(
        "grossPay"
    ).textContent =
        money(grossPay);


    document.getElementById(
        "netPay"
    ).textContent =
        money(netPay);


    // =========================
    // CURRENT PAYROLL OBJECT
    // =========================

    currentPayroll = {

        employeeId:
            selectedEmployee.employeeId,

        employeeName:
            selectedEmployee.employeeName,

        payrollMonth:
            payrollMonth,

        payrollCutoff:
            cutoff,

        cutoffStart:
            range.startDay,

        cutoffEnd:
            range.endDay,

        basicSalary:
            basicSalary,

        workingDays:
            workingDays,

        totalMonthWorkingDays:
            totalMonthWorkingDays,

        fullDays:
            attendanceSummary.fullDays,

        halfDays:
            attendanceSummary.halfDays,

        daysWorked:
            daysWorked,

        absenceDays:
            absenceDays,

        dailyRate:
            dailyRate,

        basicPay:
            basicPay,

        overtimePay:
            overtimePay,

        holidayPay:
            holidayPay,

        otherEarnings:
            otherEarnings,

        grossPay:
            grossPay,

        sss:
            sss,

        philhealth:
            philhealth,

        pagibig:
            pagibig,

        withholdingTax:
            withholdingTax,

        absenceDeduction:
            absenceDeduction,

        totalDeductions:
            totalDeductions,

        netPay:
            netPay,

        createdAt:
            new Date().toISOString()

    };

}


// =========================
// SAVE PAYROLL
// =========================

document
    .getElementById(
        "savePayrollBtn"
    )
    .addEventListener(
        "click",
        function () {

            if (
                currentPayroll === null
            ) {

                alert(
                    "Calculate payroll first."
                );

                return;

            }


            let data =
                localStorage.getItem(
                    "payrollRecords"
                );


            let records =
                data === null
                    ? []
                    : JSON.parse(data);


            // =========================
            // PREVENT DUPLICATE
            // =========================

            let duplicate =
                records.find(
                    function(record) {

                        return (
                            record.employeeId ===
                            currentPayroll.employeeId &&

                            record.payrollMonth ===
                            currentPayroll.payrollMonth &&

                            record.payrollCutoff ===
                            currentPayroll.payrollCutoff
                        );

                    }
                );


            if (
                duplicate
            ) {

                let confirmUpdate =
                    confirm(
                        "Payroll already exists for this cutoff. Replace it?"
                    );


                if (
                    !confirmUpdate
                ) {

                    return;

                }


                records =
                    records.filter(
                        function(record) {

                            return !(
                                record.employeeId ===
                                currentPayroll.employeeId &&

                                record.payrollMonth ===
                                currentPayroll.payrollMonth &&

                                record.payrollCutoff ===
                                currentPayroll.payrollCutoff
                            );

                        }
                    );

            }


            records.push(
                currentPayroll
            );


            localStorage.setItem(
                "payrollRecords",
                JSON.stringify(records)
            );


            document.getElementById(
                "saveMessage"
            ).textContent =
                "Payroll saved successfully!";


            currentPayroll = null;

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