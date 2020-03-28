
const {Builder, By, Key, until} = require('selenium-webdriver'); 



let chrome = require('selenium-webdriver/chrome');
var chromeOptions = new chrome.Options();

chromeOptions.addArguments('use-fake-ui-for-media-stream');
chromeOptions.addArguments('allow-file-access-from-files')
chromeOptions.addArguments('use-fake-device-for-media-stream')

//chromeOptions.addxperimental_option('excludeSwitches', ['enable-logging']);
//options.add_experimental_option('excludeSwitches', ['enable-logging'])

const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
//const driver2 = new Builder().forBrowser('firefox').build();


async function test(){
    await driver.get('https://match-made-on-rainbow.herokuapp.com/');
    
    elements = await driver.findElements(By.tagName('a'));
    await elements[0].click();
    await driver.sleep(3000);

    await driver.findElement(By.id('chat')).click();
    await driver.sleep(3000);

    
    const textBox = driver.wait(  until.elementLocated(By.className('text_box')),   20000);
    const enter = driver.wait(  until.elementLocated(By.className('send_button')),   20000);

    await driver.sleep(7000);

    await textBox.sendKeys('Hello from test bot');
    await driver.sleep(3000);

    await enter.click();
    await driver.sleep(3000);

    
    const button = driver.wait(  until.elementLocated(By.className('end_button')),   20000);
    await button.click();
    await driver.sleep(3000);



    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    await driver.sleep(3000);

    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    driver.sleep(5000);

    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();


    await driver.sleep(3000);
    console.log("Chat Test suceed");


    elements_call = await driver.findElements(By.tagName('a'));

    await elements_call[2].click();
    await driver.sleep(3000);

    await driver.findElement(By.id('call')).click();
    
    await driver.sleep(3000);
    const button_call = await driver.wait(  until.elementLocated(By.className('end_button')));
    await driver.sleep(10000);

    await button_call.click();
    await driver.sleep(3000);

    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    await driver.sleep(3000);

    console.log("Call Test Suceed");
    console.log("Blackbox testing Suceed");




    await testAdmin();
    await driver.quit();

}


async function testAdmin(){
    await driver.get('https://tinder-on-rainbow.herokuapp.com/home');
    
    await driver.sleep(3000)
    const username = await driver.findElement(By.id('username'));
    const password = await driver.findElement(By.id('password'));


    const login = await driver.findElement(By.id('login'));

    
    await username.sendKeys("admin")
    await password.sendKeys("password");

    const captcha = await driver.findElements(By.tagName('iframe'));

    
    await captcha[0].click();
    console.log("Captcha test success");


    
}



//test();





async function testChat(){
    elements = await driver.findElements(By.tagName('a'));
    await elements[0].click();
    await driver.sleep(3000);

    await driver.findElement(By.id('chat')).click();
    await driver.sleep(3000);

    
    const textBox = driver.wait(  until.elementLocated(By.className('text_box')),   20000);
    const enter = driver.wait(  until.elementLocated(By.className('send_button')),   20000);

    await driver.sleep(7000);

    await textBox.sendKeys('Hello from test bot');
    await driver.sleep(3000);

    await enter.click();
    await driver.sleep(3000);

    
    const button = driver.wait(  until.elementLocated(By.className('end_button')),   20000);
    await button.click();
    await driver.sleep(3000);



    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    await driver.sleep(3000);

    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    driver.sleep(5000);

    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();


    
    console.log("Chat Test suceed" +" - the captcha will effectively prevent brute force password attack by automated bots");

    await (await driver).sleep(5000);
}


async function testCall(){
    
    elements_call = await driver.findElements(By.tagName('a'));

    await elements_call[2].click();
    await driver.sleep(3000);

    await driver.findElement(By.id('call')).click();
    
    await driver.sleep(3000);

    const button_call = await driver.wait(  until.elementLocated(By.className('end_button')),20000);
    await driver.sleep(10000);

    await button_call.click();
    await driver.sleep(3000);

    driver.wait( until.alertIsPresent(),20000);
    await driver.sleep(3000);

    await driver.switchTo().alert().accept();
    await driver.sleep(3000);

    console.log("Call Test Suceed");
    console.log("Blackbox testing Suceed");

}

async function testMain(url){
    await driver.get(url);
    await testChat();
    await testCall();
    await testAdmin();
    await driver.quit();
    
}

testMain('https://match-made-on-rainbow.herokuapp.com/');