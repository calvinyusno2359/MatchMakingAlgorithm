function setCookie(cname, cvalue, seconds) {
    var d = new Date();
    d.setTime(d.getTime() + (seconds * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function removeCookie(cname) {

    document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

//pre-condition: true
//post-condition: return a list of all cookies
function listCookies() {
	var theCookies = document.cookie.split(';');

	return theCookies;
}


function updateCookies() {
	var win_id_cookie_duration = 10; // in seconds

	if (!window.name) {
		window.name = Math.random().toString();
	}

	setCookie(window.name.toString(),window.name, win_id_cookie_duration );

}

function checkLimit(){
	if(listCookies().length<5){

		window.onunload = window.onbeforeunload = (function(){
			removeCookie(window.name);
		});
		
		callCenterInterval = setInterval(updateCookies, 500);
	}
	else{
		window.location = "/fail"
		
	}	
}

checkLimit();
