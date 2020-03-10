const tags = document.querySelector(".problems");
const buttons = document.querySelector(".support_buttons").querySelectorAll(".button");
let active = [];

function selectTag(e) {
	let target = e.toElement;

	if (target.className == "active") {
		target.className = null;
		active.splice(active.indexOf(target.innerText), 1);
	} else {
		target.className = "active";
		active.push(target.innerText);
	}

	if (active.length == 0) {
		buttons.forEach(button => {
			button.disabled = true;
		});
	} else {
		buttons.forEach(button => {
			button.disabled = false;
		});
	}
}

function getSupport(e) {
	let target = e.toElement;
	let data = JSON.stringify({"data":active});
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
