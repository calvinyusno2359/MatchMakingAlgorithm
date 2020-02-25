/*
TODO:
- Move browser check to landing page, and disable call button if not supported
*/

async function waitConnection() {
	// if (!rainbowSDK.webRTC.canMakeAudioVideoCall()) {
	// 	console.log("Browser not supported.");
	// 	return;
	// }
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

    await rainbowSDK.connection.signin("guest@xuliang.dev", "P@ssw0rd123");
    console.log("Login success");
    let contact = await rainbowSDK.contacts.getContactById("5e44f661e9f127306369598e");

    console.log("attempting call");
    rainbowSDK.webRTC.callInAudio(contact);
}

function onLoaded() {
    rainbowSDK.setVerboseLog(false);
    rainbowSDK.initialize("887748004c9811ea819a43cb4a9dae9b", "JweJRLKt48BjWohZJPpapGdK18dDmBQB1XnIOWIx10c87nTOWNavNbPFhsApBwtg");
}

angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.RAINBOW_ONREADY, waitConnection);

rainbowSDK.load();
