function pushText(text, side, sending=false) {
    let container = document.createElement("div");
    container.className = "container";
    let bubble = document.createElement("div");
    if (sending == true) {
        bubble.className = `${side} sending`;
    } else {
        bubble.className = side;
    }
    let message = document.createElement("p");
    message.textContent = text;

    bubble.appendChild(message);
    container.appendChild(bubble);
    chat.appendChild(container);

    chat.scrollTop = chat.scrollHeight;

    return bubble;
}

function sendMessage() {
    if (content.textContent != "") {
        receipt_queue.push(pushText(content.textContent, "right", true));
        rainbowSDK.im.sendMessageToConversation(conversation, content.textContent);
    }
    content.textContent = "";
}

function keyPress(e) {
    if (e.key == "Enter") {
        sendMessage();
    }
    if (content.textContent != "") {
        send.disabled = false;
    } else {
        send.disabled = true;
    }
}

// end chat and close conversation
function endChat() {
    const id = {
        userId: user_id
    }
    disconnect('/chat/disconnect', id).then(() => {
        closeConversation().then(() => {
            console.log("Conversation closed successfully")
            window.location.pathname = '/'
        }).catch(() => {
            console.log("Conversation closed unsuccessfully ")
        })
    })
}

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

const closeConversation = async() => {
    await rainbowSDK.conversations.closeConversation(conversation)
}

async function waitConnection() {
    // ping server for token and id
    let header = {"tags":tags};
    let response = await fetch("/chat/request", {headers: header});
    let result = await response.json();
    let token = result.token;
    let agent_id = result.agent_id;
    user_id = result.user_id;
    response = await rainbowSDK.connection.signinSandBoxWithToken(token);

    // get agent, add to network, and open conversation
    let contact = await rainbowSDK.contacts.searchById(agent_id);
    conversation = await rainbowSDK.conversations.openConversationForContact(contact);
    await rainbowSDK.im.getMessagesFromConversation(conversation);

    document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMMESSAGERECEIVED, receive);
    document.addEventListener(rainbowSDK.im.RAINBOW_ONNEWIMRECEIPTRECEIVED, receipt);

    document.body.appendChild(chat);
    document.body.appendChild(content);
    document.body.appendChild(send);
    document.body.appendChild(end); 

    send.addEventListener("click", sendMessage);
    content.addEventListener("keyup", keyPress);
    end.addEventListener("click", endChat);

    conversation.messages.forEach(message => {
        if (message.side === "R") {
            pushText(message.data, "right");
        } else if (message.side === "L") {
            pushText(message.data, "left");
        }
    });
}

function receive(e) {
    let message = e.detail.message;
    pushText(message.data, "left");
}

function receipt(e) {
    if (e.detail.evt !== "received") {
        return;
    }

    let message = e.detail.message.data;

    for(let i=0; i<receipt_queue.length; i++) {
        if (receipt_queue[i].querySelector("p").textContent == message) {
            receipt_queue[i].className = "right";
            receipt_queue.splice(i, 1);
            break;
        }
    }
}

function onLoaded() {
    rainbowSDK.setVerboseLog(false);
    rainbowSDK.initialize();
}

// window.onbeforeunload = async function() {
//     if (account_id == "") return;

//     // unregister visitor from db
//     let init = {"method": "POST", "body": {"account_id": account_id}};
//     await fetch("https://esc.xuliang.dev/api/chat/done", init);
// }

let conversation;
let user_id = "";
let receipt_queue = [];
let logs = []
let tags = JSON.parse(window.localStorage.getItem("tag")).data;

const chat = document.createElement("div");
const content = document.createElement("div");
const send = document.createElement("button");
const end = document.createElement("end")
chat.className = "chat_content";
content.className = "text_box";
content.contentEditable = true;
send.className = "send_button";
send.textContent = "Send";
end.className = "end_button";
end.textContent = "End Chat"
send.disabled = true;

angular.bootstrap(document, ["sdk"]).get("rainbowSDK");

document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.RAINBOW_ONREADY, waitConnection);

rainbowSDK.load();

