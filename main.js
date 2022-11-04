const { Builder, By } = require('selenium-webdriver');
const { papers } = require('./paper.json');
const { username, password } = require('./user.json');

const sleep = async (time) => {
    await new Promise(res => setTimeout(res, time));
}

const login = async (driver) => {
    await driver.get('https://ersp.lib.whu.edu.cn/s/net/cnki/www/G.https');
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await sleep(500);
    await driver.findElement(By.className('auth_login_btn primary full_width')).click();
    await sleep(3000);
}

const download = async (driver, paper) => {
    await driver.findElement(By.id('txt_SearchText')).clear();
    await sleep(500);
    await driver.findElement(By.id('txt_SearchText')).sendKeys(paper);
    await sleep(500);
    
    await driver.findElement(By.className('search-btn')).click();
    await sleep(3000);
    
    await driver.findElement(By.xpath('//*[@id="gridTable"]/table/tbody/tr[1]/td[2]/a/font')).click();
    await sleep(1000);
    
    const windows = await driver.getAllWindowHandles();
    await driver.switchTo().window(windows[1])
    
    await sleep(500);
    await driver.findElement(By.id('pdfDown')).click();
    await sleep(500);
    await driver.close();
    await driver.switchTo().window(windows[0])
    
    await sleep(500);
    await driver.navigate().back();
}

(async () => {
    let driver;
    try {
        driver = await new Builder().forBrowser('chrome').build();
        await login(driver);

        for (const paper of papers) {
            console.log(`download paper: ${paper}...`);
            await download(driver, paper);
            await sleep(500);
            console.log(`download paper: ${paper} done`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        console.log('script down');
        // 关闭浏览器
        await driver.quit();
    }
})();