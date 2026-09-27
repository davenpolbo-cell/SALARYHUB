// =========================
// HR ACCESS
// =========================

let role =
    localStorage.getItem(
        "loggedInRole"
    );


if (role !== "hr") {

    window.location.href =
        "login.html";

}


// =========================
// GET LEAVE
// =========================

function getLeaves() {

    let data =
        localStorage.getItem(
            "leaveRecords"
        );

    if (data === null) {

        return [];

    }

    return JSON.parse(data);

}


// =========================
// DISPLAY
// =========================

function displayLeaves() {

    let leaves =
        getLeaves();


    let table =
        document.getElementById(
            "leaveTableBody"
        );


    table.innerHTML = "";


    leaves.forEach(
        function(leave, index) {

            let row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${leave.employeeId}
                </td>

                <td>
                    ${leave.employeeName}
                </td>

                <td>
                    ${leave.leaveType}
                </td>

                <td>
                    ${leave.startDate}
                </td>

                <td>
                    ${leave.endDate}
                </td>

                <td>
                    ${leave.reason}
                </td>

                <td>
                    ${leave.status}
                </td>

                <td>

                    ${
                        leave.status === "Pending"
                        ?

                        `
                        <div class="leave-action">

                            <button
                                class="approve"
                                onclick="updateLeave(
                                    ${index},
                                    'Approved'
                                )"
                            >
                                Approve
                            </button>

                            <button
                                class="reject"
                                onclick="updateLeave(
                                    ${index},
                                    'Rejected'
                                )"
                            >
                                Reject
                            </button>

                        </div>
                        `

                        :

                        "-"

                    }

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// =========================
// UPDATE
// =========================

function updateLeave(
    index,
    status
) {

    let leaves =
        getLeaves();


    if (
        leaves[index] === undefined
    ) {

        return;

    }


    leaves[index].status =
        status;


    localStorage.setItem(
        "leaveRecords",
        JSON.stringify(leaves)
    );


    displayLeaves();

}


// =========================
// BACK
// =========================

function goBack() {

    window.location.href =
        "hr.html";

}


displayLeaves();