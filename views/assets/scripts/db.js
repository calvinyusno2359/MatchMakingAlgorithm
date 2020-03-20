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

// add Row
async function addHtmlTableRow() {
    // get the table by id
    // create a new row and cells
    // get value from input text
    // set the values into row cell's
    if (!checkEmptyInput()) {
        var newRow = table.insertRow(table.length),
            cell1 = newRow.insertCell(0),
            cell2 = newRow.insertCell(1),
            cell3 = newRow.insertCell(2),
            id = document.getElementById("id").value,
            email = document.getElementById("email").value,
            tag = "";

        tags.forEach(tagname => {
            if (tagname.checked) {
                tag += tagname.value + "\n";
            }
        });

        var data = { id: id, email: email, tag: tag, availability: false };
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch("/admin/addagent", options);
        cell1.innerHTML = id;
        cell2.innerHTML = email;
        cell3.innerHTML = tag;
        // call the function to set the event to the new row
        selectedRowToInput();
    }
}

// display selected row data into input text
function selectedRowToInput() {

    for (var i = 1; i < table.rows.length; i++) {
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
}

async function editHtmlTableSelectedRow() {
    var id = document.getElementById("id").value,
        email = document.getElementById("email").value,
        tag = "";

    tags.forEach(tagname => {
        if (tagname.checked) {
            tag += tagname.value + "\n";
        }
    });
    if (!checkEmptyInput()) {
        var data = { id: id, email: email, tag: tag };
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch("/admin/updateagent", options);
        table.rows[rIndex].cells[0].innerHTML = id;
        table.rows[rIndex].cells[1].innerHTML = email;
        table.rows[rIndex].cells[2].innerHTML = tag;
        clearFields();
    }
}

async function removeSelectedRow() {
    if (!checkEmptyInput()) {
        id = document.getElementById("id").value;
        await fetch("/admin/deleteagent/" + id);
        if (rIndex > 0) table.deleteRow(rIndex);
        // clear input text
        clearFields();
    }
}

function clearFields() {
    document.getElementById("id").disabled = false;
    document.getElementById("id").value = "";
    document.getElementById("email").value = "";
    tags.forEach(tagname => {
        tagname.checked = false;
    });
}

selectedRowToInput();