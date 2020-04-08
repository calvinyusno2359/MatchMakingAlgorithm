const tags = document.querySelector(".problems");
const buttons = document.querySelector(".support_buttons").querySelectorAll(".button");
let active = null;

function selectTag(e) {
    let target = e.toElement;

    if (target.className == "active") {
        target.className = null;
        active = null;
        buttons.forEach((button) => {
            button.disabled = true;
        })
    } else {
        if (active) active.className = null;
        target.className = "active";
        active = target;
        buttons.forEach((button) => {
            button.disabled = false;
        });
    }
}

function getSupport(e) {
    let target = e.toElement;
    let data = JSON.stringify({ "data": active.innerText });
    window.localStorage.setItem("tag", data);
    if (target.id === "chat") {
        window.location = "chat";
    } else if (target.id === "call") {
        window.location = "call";
    }
}

tags.addEventListener("click", selectTag);
buttons.forEach(button => {
    button.addEventListener("click", getSupport);
});