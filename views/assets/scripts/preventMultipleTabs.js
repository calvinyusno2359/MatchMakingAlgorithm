
function setCookie(cname, cvalue, seconds) {
    var d = new Date();
    d.setTime(d.getTime() + (seconds * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function removeCookie(cname) {

    document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// helper function to get a cookie
// function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(';');
//     for(var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }

function listCookies() {

	var theCookies = document.cookie.split(';');

	return theCookies;
}


function updateCookies() {
	var win_id_cookie_duration = 10; // in seconds

	if (!window.name) {
		window.name = Math.random().toString();
	}

	window.onunload = window.onbeforeunload = (function(){
		removeCookie(window.name);
	});

	console.log("cookieList", listCookies());

	setCookie(window.name.toString(),window.name, win_id_cookie_duration );

}


function checkLimit(){
    console.log("checkLimit called");
	if(listCookies().length<5){

		window.onunload = window.onbeforeunload = (function(){
			removeCookie(window.name);
		});
		
		callCenterInterval = setInterval(updateCookies, 1000);
	}
	else{
		window.location = "/fail"
		
	}	
}

checkLimit();




//sexports.security = checkLimit;