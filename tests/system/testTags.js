const {Builder, By, until} = require("selenium-webdriver");
let chrome = require('selenium-webdriver/chrome');
//require("chromedriver");
const fs = require("fs");
let path = require("path");

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Send some text to the agent.
async function testChat(count) {
	let textbox = await driver.findElement(By.css(".text_box"));
	let submit = await driver.findElement(By.css(".send_button"));

	for (let i=0; i<count; i++) {
		await textbox.sendKeys(randomLine());
		await submit.click();
		await sleep(1000);
	}
}

// Select a tag and access the chat page.
async function testTag(tag) {
	let elm = await driver.findElement(By.linkText(tag));
	await driver.executeScript("arguments[0].scrollIntoView()", elm);
	await sleep(1000);
	await elm.click();
	await driver.findElement(By.css("#chat")).click();
	await driver.wait(until.elementLocated(By.css(".text_box")));
}

// Exit from the chat page.
async function testExit() {
	let exit = await driver.findElement(By.css(".end_button"));
	await exit.click();
    await sleep(1000);

	// let alert = await driver.switchTo().alert();
	// await alert.accept();
	// await sleep(1000);
	// alert = await driver.switchTo().alert();
    // await alert.dismiss();


    //temporarily replaced with testFull portion coz got 3 prompts now
    await driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    await driver.sleep(3000);

    await driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    await driver.sleep(5000);

    // await driver.wait( until.alertIsPresent(),20000);
    // await driver.sleep(3000);

    // await driver.switchTo().alert().accept();
    // await driver.sleep(5000);
}

// Access chat page directly without choosing a tag.
async function testFail(url) {
	await driver.manage().window().maximize();
	await driver.get(`${url}chat`);
}

function randomString(length) {
	let string = ""
	for (let i=0; i<length; i++) {
		string += Math.random().toString(36).substr(2)
	}
	return string;
}

// Get a random neural-network generated pickup line
function randomLine() {
	let index = Math.floor(Math.random() * lines.length);
	return lines[index];
}

async function testMain(url) {
	await driver.manage().window().maximize();
	await driver.get(url);

	await testFail(url);
	await sleep(1000);

	for (let i=0; i<tags.length; i++) {
		tag = tags[i];
		await testTag(tag);
		await testChat(5);
		await testExit();
		await sleep(1000);
	}

	driver.close();
}


// let tags = ["General Enquiry", "Abdomen", "Back", "Chest", "Ear", "Extremeties", "Head", "Pelvis", "Rectum", "Skin", "Tooth"];
let tags = ["General Enquiry", "Back", "Abdomen"]
//let tags = ["General Enquiry", "Back", "Extremeties"]
let lines = [];

var chromeOptions = new chrome.Options();

chromeOptions.addArguments('use-fake-ui-for-media-stream');
chromeOptions.addArguments('allow-file-access-from-files')
chromeOptions.addArguments('use-fake-device-for-media-stream')

const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

testMain("https://match-made-on-rainbow.herokuapp.com/");

let file = path.join(__dirname + '/lines.txt')
fs.readFile(file, (err, data) => {
	lines = data.toString().split("\n");
});
