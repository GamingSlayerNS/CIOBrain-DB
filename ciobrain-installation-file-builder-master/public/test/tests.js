const {
    By,
    Key,
    Builder,
    Capabilities,
    Capability,
    promise
} = require("selenium-webdriver")
require("chromedriver")

/* Test: firstTest()
 *  LOCAL
 *  Waits for page to load, clicks on an asset type, clicks asset, checks for asset details appearance
 *  Make sure CIOBrain API and CIOBrain app are running prior to running the test.
 */
async function displayAssetDetails() {
    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser("chrome").build()

    // Navigates to localhost port where app is running
    await driver.get("http://localhost:3000/")

    //locate asset menu and option
    await driver.findElement(By.id("assetMenuHeader"))
    const assetCategoryOption = driver.findElement(
        By.className("assetCategoryOption")
    )

    //click asset category and option
    await assetCategoryOption.click()
    await driver.findElement(By.className("assetOption")).click()

    //check if asset details are shown
    await driver.findElement(By.id("assetName"))

    console.log("Test passed")
}

displayAssetDetails()
