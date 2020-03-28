var rIndex;
var table = document.getElementById("table");
var tags = document.querySelector(".tag").querySelectorAll('input');

// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        id = document.getElementById("id").value,
        email = document.getElementById("email").value;

    if (id === "") {
        alert("ID cannot be empty");
        isEmpty = true;
    } else if (email === "") {
        alert("Email address cannot be empty");
        isEmpty = true;
    }
    return isEmpty;
}

function getInputFields() {
    var id = document.getElementById("id").value,
        email = document.getElementById("email").value,
        tag = "";

    tags.forEach(tagname => {
        if (tagname.checked) {
            if (tag == "") {
                tag += tagname.value;
            } else {
                tag += "," + tagname.value;
            }
        }
    });
    // availability is a required field in the db, and will be false by default
    var data = { id: id, email: email, tag: tag, availability: false };
    return data;
}

function populateInputFields(i) {
    table.rows[i].onclick = function() {
        // get the selected row index
        rIndex = this.rowIndex;
        document.getElementById("id").value = this.cells[0].innerHTML.trim();
        document.getElementById("id").disabled = true;
        document.getElementById("email").value = this.cells[1].innerHTML.trim();
        tags.forEach(tagname => {
            if (this.cells[2].innerHTML.trim().includes(tagname.value)) {
                tagname.checked = true;
            } else {
                tagname.checked = false;
            }
        });
    };
}

function modifySelectedTableRowData(data, cell1, cell2, cell3) {
    cell1.innerHTML = data.id;
    cell2.innerHTML = data.email;
    cell3.innerHTML = data.tag;
}

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
}

function clearFields() {
    document.getElementById("id").disabled = false;
    document.getElementById("id").value = "";
    document.getElementById("email").value = "";
    tags.forEach(tagname => {
        tagname.checked = false;
    });
}

// add Row
async function addHtmlTableRow() {
    if (!checkEmptyInput()) {
        var data = getInputFields();
        var res = await postData("/admin/addagent", data);

        if (res.status == 200) {
            var newRow = table.insertRow(table.length),
                cell1 = newRow.insertCell(0),
                cell2 = newRow.insertCell(1),
                cell3 = newRow.insertCell(2);
            modifySelectedTableRowData(data, cell1, cell2, cell3);
            selectedRowToInput();
            alert("Successfully added entry.");
        } else {
            alert("Failed to add entry. Check if there is any duplicate entry.");
        }
    }
}

// display selected row data into input fields
function selectedRowToInput() {

    for (var i = 1; i < table.rows.length; i++) {
        populateInputFields(i);
    }
}

async function editHtmlTableSelectedRow() {
    if (!checkEmptyInput()) {
        var data = getInputFields();
        var res = await postData("/admin/updateagent", data);

        if (res.status == 200) {
            var index = table.rows[rIndex];
            modifySelectedTableRowData(data, index.cells[0], index.cells[1], index.cells[2]);
            clearFields();
            alert("Successfully updated entry.");
        } else if (res.status == 304) {
            alert("Entry does not exist.");
        } else {
            alert("Failed to update entry.");
        }
    }
}

async function removeSelectedRow() {
    if (!checkEmptyInput()) {
        id = document.getElementById("id").value;
        var res = await fetch("/admin/deleteagent/" + id);
        if (res.status == 200) {
            if (rIndex > 0) table.deleteRow(rIndex);
            // clear input text
            clearFields();
            alert("Sucessfully deleted entry.");
        } else if (res.status == 304) {
            alert("Entry does not exist.");
        } else {
            alert("Failed to delete entry.");
        }
    }
}

selectedRowToInput();