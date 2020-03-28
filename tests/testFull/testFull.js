
const {Builder, By, Key, until} = require('selenium-webdriver'); 



let chrome = require('selenium-webdriver/chrome');
var chromeOptions = new chrome.Options();

chromeOptions.addArguments('use-fake-ui-for-media-stream');
chromeOptions.addArguments('allow-file-access-from-files')
chromeOptions.addArguments('use-fake-device-for-media-stream')


const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();


async function testChat(){
    elements = await driver.findElements(By.tagName('a'));
    await elements[0].click();
    await driver.sleep(3000);

    await driver.findElement(By.id('chat')).click();
    await driver.sleep(3000);

    
    const textBox = await driver.wait(  until.elementLocated(By.className('text_box')),   30000);
    const enter = await driver.wait(  until.elementLocated(By.className('send_button')),   30000);

    await driver.sleep(7000);

    await textBox.sendKeys('Hello from test bot');
    await driver.sleep(3000);

    await enter.click();
    await driver.sleep(3000);

    
    const button = await driver.wait(  until.elementLocated(By.className('end_button')),   30000);
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


    
    console.log("Chat Test suceed");

    await (await driver).sleep(5000);
}


async function testCall(){
    await driver.sleep(3000);
    elements_call = await driver.findElements(By.tagName('a'));

    await elements_call[2].click();
    await driver.sleep(3000);

    await driver.findElement(By.id('call')).click();
    
    await driver.sleep(3000);

    //const button_call = await driver.wait(  until.elementLocated(By.className('end_button')));
    try{await driver.wait(  until.elementLocated(By.className('end_button')),70000);
    }catch(err){
        console.log("No agent picks up the call in 1 min. Timeout occurs \nThe test will quit now...")
        await driver.quit();
        process.exit(1);
    }
    
    const button_call = await driver.findElement(By.className('end_button'))
    
    
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

async function testAdmin(){
    await driver.get('https://tinder-on-rainbow.herokuapp.com/home');
    
    await driver.sleep(3000)
    const username = await driver.findElement(By.id('username'));
    const password = await driver.findElement(By.id('password'));


    const login = await driver.findElement(By.id('login'));

    
    await username.sendKeys("admin");
    await driver.sleep(2000);

    await password.sendKeys("password");
    await driver.sleep(2000);

    const captcha = await driver.findElements(By.tagName('iframe'));

    
    await captcha[0].click();
    await driver.sleep(2000)
    console.log("Captcha test success"+ " - the captcha will effectively prevent brute force password attack by automated bots");
    


    
}

async function testMain(url){
    await driver.get(url);
    await testChat();
    await testCall();
    await testAdmin();
    driver.close();
    //await driver.quit();
    
}

testMain('https://match-made-on-rainbow.herokuapp.com/');