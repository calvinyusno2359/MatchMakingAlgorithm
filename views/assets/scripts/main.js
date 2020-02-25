const tags = document.querySelector(".problems");
const buttons = document.querySelector(".support_buttons").querySelectorAll(".button");
let active = null;

function selectTag(e) {
	let target = e.toElement;
	target.className = "active"
	if (active !== null) {
		active.className = null;
	}
	active = target;

	buttons.forEach(button => {
		button.disabled = false;
	});
}

function getSupport(e) {
	let target = e.toElement;
	if (target.id === "chat") {
		window.location = "/support/chat";
	} else if (target.id === "call") {
		window.location = "/support/call";
	}
}

tags.addEventListener("click", selectTag);
buttons.forEach(button => {
	button.addEventListener("click", getSupport);
});