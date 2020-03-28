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
    if (!checkEmptyInput()) {
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

        var data = { id: id, email: email, tag: tag, availability: false };
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        var res = await fetch("/admin/addagent", options);
        var json = await res.json();
        if (json.status == "success") {
            var newRow = table.insertRow(table.length),
                cell1 = newRow.insertCell(0),
                cell2 = newRow.insertCell(1),
                cell3 = newRow.insertCell(2);
            cell1.innerHTML = id;
            cell2.innerHTML = email;
            cell3.innerHTML = tag;
            // call the function to set the event to the new row
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
            if (tag == "") {
                tag += tagname.value;
            } else {
                tag += "," + tagname.value;
            }
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
        var res = await fetch("/admin/updateagent", options);
        var json = await res.json();
        if (json.status == "success") {
            table.rows[rIndex].cells[0].innerHTML = id;
            table.rows[rIndex].cells[1].innerHTML = email;
            table.rows[rIndex].cells[2].innerHTML = tag;
            clearFields();
            alert("Successfully updated entry.");
        } else {
            alert("Failed to update entry.");
        }
    }
}

async function removeSelectedRow() {
    if (!checkEmptyInput()) {
        id = document.getElementById("id").value;
        var res = await fetch("/admin/deleteagent/" + id);
        var json = await res.json();
        if (json.status == "success") {
            if (rIndex > 0) table.deleteRow(rIndex);
            // clear input text
            clearFields();
            alert("Sucessfully deleted entry.");
        } else {
            alert("Failed to delete entry.");
        }
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