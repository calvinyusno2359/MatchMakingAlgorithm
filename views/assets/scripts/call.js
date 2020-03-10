/*
TODO:
- Move browser check to landing page, and disable call button if not supported
*/

async function waitConnection() {
	// if (!rainbowSDK.webRTC.canMakeAudioVideoCall()) {
	// 	console.log("Browser not supported.");
	// 	return;
	// }
	if(rainbowSDK.webRTC.canMakeAudioVideoCall()){
		console.log("brower is supported");
	}
	else{
		console.log("browser not supported");
	}

	if (!rainbowSDK.webRTC.hasAMicrophone()) {
		console.log("No microphone detected.");
	}

	console.log("requesting microphone access");

	navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
		stream.getTracks().forEach(track => {
			track.stop();
		});

		navigator.mediaDevices.enumerateDevices().then(devices => {
			devices.forEach(device => {
				if (device.deviceId == "default") {
					console.log(device);
				}
			});
		});

		console.log("microphone access success")
		rainbowSDK.webRTC.useMicrophone("default");
		rainbowSDK.webRTC.useSpeaker("default");
	});

    // await rainbowSDK.connection.signin("test02@gmail.com", "QwE123asd@");
    // console.log("Login success");
    // let contact = await rainbowSDK.contacts.getContactById("5e63ba74d8084c29e64ec3b0");

    // console.log("attempting call");
	// //rainbowSDK.webRTC.callInAudio(contact);        
	// var res = rainbowSDK.webRTC.callInAudio(contact);
	// console.log("res label: "+res.label);
	// if(res.label === "OK") {
	// 	/* Your call has been correctly initiated. Waiting for the other peer to answer */
	// 	console.log("waiting for rply");
	// }
    let response = await fetch("/call/request");
    let result = await response.json();
    let token = result.token;
    let agent_id = result.agent_id;
    user_id = result.user_id;
    response = await rainbowSDK.connection.signinSandBoxWithToken(token);

    // get agent, add to network, and open conversation
    let contact = await rainbowSDK.contacts.searchById(agent_id);	
	var res = rainbowSDK.webRTC.callInAudio(contact);
	console.log("res label: "+res.label);
	if(res.label === "OK") {
		/* Your call has been correctly initiated. Waiting for the other peer to answer */
		console.log("waiting for rply");
		// go to the next page
		//window.location = "calling";
		// TODO: 1 if call established --> go to next page
		//TODO: 2 release call function
	}
	
}

function onLoaded() {
	    rainbowSDK.setVerboseLog(false);
	    rainbowSDK.initialize();
	}


angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.RAINBOW_ONREADY, waitConnection);


rainbowSDK.load();
