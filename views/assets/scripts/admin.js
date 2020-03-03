var rIndex,
    table = document.getElementById("table");

// check the empty input
function checkEmptyInput() {
    var isEmpty = false,
        id = document.getElementById("id").value,
        email = document.getElementById("email").value,
        tag = document.getElementById("tag").value;

    if (id === "") {
        alert("ID cannot be empty");
        isEmpty = true;
    } else if (email === "") {
        alert("Email address cannot be empty");
        isEmpty = true;
    } else if (tag === "") {
        alert("Tag cannot be empty");
        isEmpty = true;
    }
    return isEmpty;
}

// add Row
function addHtmlTableRow() {
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
            tag = document.getElementById("tag").value;

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
            document.getElementById("id").value = this.cells[0].innerHTML;
            document.getElementById("email").value = this.cells[1].innerHTML;
            document.getElementById("tag").value = this.cells[2].innerHTML;
        };
    }
}
selectedRowToInput();

function editHtmlTbleSelectedRow() {
    var id = document.getElementById("id").value,
        email = document.getElementById("email").value,
        tag = document.getElementById("tag").value;
    if (!checkEmptyInput()) {
        table.rows[rIndex].cells[0].innerHTML = id;
        table.rows[rIndex].cells[1].innerHTML = email;
        table.rows[rIndex].cells[2].innerHTML = tag;
    }
}

function removeSelectedRow() {
    table.deleteRow(rIndex);
    // clear input text
    document.getElementById("id").value = "";
    document.getElementById("email").value = "";
    document.getElementById("tag").value = "";
}