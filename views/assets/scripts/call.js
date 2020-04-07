/*
TODO:
- Move browser check to landing page, and disable call button if not supported
*/

async function waitConnection() {

    if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
        console.log("brower is supported");
    } else {
        console.log("browser not supported");
    }

    if (!rainbowSDK.webRTC.hasAMicrophone()) {
        console.log("No microphone detected.");
    }

    console.log("requesting microphone access");

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
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


    let header = { "tag": tag };    
    let  response  =  await  fetch("/call/request", { headers: header });    
    let  result  =  await  response.json();    
    let  token  =  result.token;    
    let  agent_id  =  result.agent_id;
    user_id = result.user_id;    
    response  =  await  rainbowSDK.connection.signinSandBoxWithToken(token);

    if (agent_id == "WAIT") {
        loading.innerText = "Sit tight while we find you an agent.";
        while (agent_id == "WAIT") {
            await new Promise(r => setTimeout(r, 1000));
            let header = { "user_id": user_id };
            let response = await fetch("/polling", { headers: header });
            let result = await response.json();
            agent_id = result.agent_id;
        }
        loading.innerText = "Connecting";
    }

         // get agent, add to network, and open conversation

    open_chat.style.display = "none";
    dialog.style.display = "none";
    let contact  =  await  rainbowSDK.contacts.searchById(agent_id);
    var res = rainbowSDK.webRTC.callInAudio(contact);
    console.log("res label: " + res.label);

    if (res.label === "OK") {
        /* Your call has been correctly initiated. Waiting for the other peer to answer */
        console.log("waiting for rply");
        // go to the next page
        //window.location = "calling";
        // TODO: 1 if call established --> go to next page
        //TODO: 2 release call function

    }
    document.addEventListener(rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED, onWebRTCCallChanged);

    //end.addEventListener("click", endCall);


}

function onWebRTCCallChanged(event) {

    console.log("OnWebRTCCallChanged event", event.detail.status.value);
    // if call picked up, exit button appears
    if (event.detail.status.value == "active") {

        document.body.appendChild(background);
        document.body.appendChild(end); 
        end.addEventListener("click",  endCall);
    } else if (event.detail.status.value == "Unknown") {
        const id = {
            userId: user_id
        }
        disconnect('/call/disconnect', id).then(() => {
            window.location.pathname = '/'
        })

    }
}


function  endCall()  {
    const id = {
        userId: user_id
    }
    if (confirm('Are you sure you want to exit the call?')) {

        window.location.pathname = '/'

    } else {
        // Do nothing!
    }
}

//OG end call --> this will double erase the agent table

// function endCall() {
// 	const id = {
// 		userId: user_id
// 	}
// 	if (confirm('Are you sure you want to exit the call?')) {

// 		disconnect('/call/disconnect', id).then(() => {
// 			window.location.pathname = '/'
// 		})
// 	} else {
// 		// Do nothing!
// 	}
// }


async function disconnect(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

function  onLoaded()  {    
    rainbowSDK.setVerboseLog(false);    
    rainbowSDK.initialize();
}



let tag = JSON.parse(window.localStorage.getItem("tag")).data;

let dialog = document.getElementById("chat-popup")
let open_chat = document.getElementById("chat-open")
const  end  =  document.createElement("button")
end.className  =  "end_button";
end.textContent  =  "Exit"
end.className  =  "end_button";
end.textContent  =  "✖";
end.title = "End";

const  background  =  document.createElement("div");
background.className  =  "background";
background.textContent = "Our agent is now attending to you , feel free to let us know your enquiry.";

const loading = document.querySelector(".loading");

angular.bootstrap(document, ["sdk"]).get("rainbowSDK");
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.RAINBOW_ONREADY, waitConnection);


rainbowSDK.load();