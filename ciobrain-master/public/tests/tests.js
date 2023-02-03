import {
    By,
    Key,
    Builder,
    Capabilities,
    Capability,
    promise
} from "selenium-webdriver"
import "chromedriver"
import "geckodriver"
import * as asset from "./Asset.js"
var assert = import("assert")

function getAssetConnections(asset) {
    let connections = 0

    if (
        asset["Application Connections"] &&
        asset["Application Connections"].trim().length
    ) {
        connections += asset["Application Connections"].split(";").length
    }
    if (asset["Data Connections"] && asset["Data Connections"].trim().length) {
        connections += asset["Data Connections"].split(";").length
    }
    if (
        asset["Infrastructure Connections"] &&
        asset["Infrastructure Connections"].trim().length
    ) {
        connections += asset["Infrastructure Connections"].split(";").length
    }

    return connections
}

/* Test: firstTest()
 *  LOCAL
 *  Waits for page to load, clicks on an asset type, clicks asset, checks for asset details appearance
 *  Make sure CIOBrain API and CIOBrain app are running prior to running the test.
 */
async function displayAssetDetails(browser) {
    // To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser(browser).build()
    //let caps = await driver.getCapabilities();
    //console.log(caps);
    // Navigates to localhost port where app is running
    await driver.get("http://localhost:3000/")

    // Locate asset category options
    const assetCategoryOptions = await driver.findElements(
        By.className("assetCategoryOption")
    )

    // Parse through list of asset category options
    for (let category of assetCategoryOptions) {
        await category.click()
        // Retireve asset options list
        const assetOptions = await driver.findElements(
            By.className("assetOption")
        )
        for (let option of assetOptions) {
            // Check if asset has a name
            let assetName = await option.getText()
            if (assetName != "") {
                await option.click()
                // Compare if selected asset's name matches the name displayed in the asset details menu
                if (
                    (await driver.findElement(By.id("assetName")).getText()) !=
                    assetName
                ) {
                    throw (
                        "Selected asset (" +
                        assetName +
                        ") does not match asset details in " +
                        browser
                    )
                }
            }
        }
    }

    console.log("Display Asset Details passed for " + browser)

    await driver.quit()
}

async function verifyGraphNodes(browser) {
    // To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser(browser).build()
    //let caps = await driver.getCapabilities();
    //console.log(caps);
    // Navigates to localhost port where app is running
    await driver.get("http://localhost:3000/")

    // Locate asset category options
    const assetCategoryOptions = await driver.findElements(
        By.className("assetCategoryOption")
    )

    // Parse through list of asset category options
    for (let category of assetCategoryOptions) {
        let categoryName = await category.getText()
        var assets = []
        if (categoryName == "Application")
            assets = await asset.getAllApplicationAssets()
        else if (categoryName == "Data") assets = await asset.getAllDataAssets()
        else if (categoryName == "Infrastructure")
            assets = await asset.getAllInfrastructureAssets()
        else continue
        await category.click()

        // Retireve asset options list
        const assetOptions = await driver.findElements(
            By.className("assetOption")
        )
        for (let option of assetOptions) {
            // Match asset name to an object in the assets array
            let assetName = await option.getText()
            if (assetName != "") {
                await option.click()
                let selectedAsset
                for (let a of assets) {
                    if (a["Name"] == assetName) {
                        selectedAsset = a
                        break
                    }
                }

                if (selectedAsset) {
                    let expectedNumberOfNodes =
                        getAssetConnections(selectedAsset) + 1
                    let numberOfNodesDisplayed = (
                        await driver.findElements(By.css("circle"))
                    ).length
                    if (expectedNumberOfNodes != numberOfNodesDisplayed)
                        throw (
                            "Selected asset (" +
                            assetName +
                            ") is not showing correct number of nodes"
                        )
                }
            }
        }
    }

    console.log("Verify Graph Nodes passed for " + browser)

    await driver.quit()
}

async function verifyGraphExpand(browser) {
    // To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser(browser).build()
    //let caps = await driver.getCapabilities();
    //console.log(caps);
    // Navigates to localhost port where app is running
    await driver.get("http://localhost:3000/")

    // Locate asset category options
    const assetCategoryOptions = await driver.findElements(
        By.className("assetCategoryOption")
    )

    // Parse through list of asset category options
    for (let category of assetCategoryOptions) {
        await category.click()
        // Retireve asset options list
        const assetOptions = await driver.findElements(
            By.className("assetOption")
        )
        for (let option of assetOptions) {
            // Check if asset has a name
            let assetName = await option.getText()
            if (assetName != "") {
                await option.click()
                let expandButtons = await driver.findElements(
                    By.css("polygon[points]")
                )
                while (expandButtons != "") {
                    await expandButtons[0].click()
                    expandButtons = await driver.findElements(
                        By.css("polygon[points]")
                    )
                }
            }
        }
    }

    console.log("Verify Graph Expand passed for " + browser)

    await driver.quit()
}

/* Test: displayNodeColors()
 *  LOCAL
 *  Waits for page to load, clicks on an asset type, clicks asset, checks that parent node that appears on the graph is the same
 *  color as the asset type's color
 */
async function displayNodeColors(browser) {
    //To wait for browser to build and launch properly
    let driver = await new Builder().forBrowser(browser).build()

    // Navigates to localhost port where app is running
    await driver.get("http://localhost:3000/%22")

    //locate asset menu and option
    await driver.findElement(By.id("assetMenuHeader"))
    const assetCategoryOption = driver.findElement(
        By.className("assetCategoryOption")
    )
    console.log(JSON.stringify(assetCategoryOption))

    //click asset category and option
    await assetCategoryOption.click()
    await driver
        .findElement(
            By.css(
                "#assetMenu > div:nth-child(2) > div.assetCategoryDropdown > div:nth-child(1)"
            )
        )
        .click()

    //locate parent node
    const node = await driver.findElement(By.css("circle"))
    //get color of parent node (application type)
    var attribute_color = await node.getAttribute("stroke")

    await driver.findElement(By.className("assetOption")).click()

    //assert that it's red
    var rightColor = "var(--red)"
    ;(await assert).equal(attribute_color, rightColor)

    //test colors of data and infrastructures
    console.log("Display Node Colors passed for " + browser)
    await driver.quit()
}

async function runTestCases() {
    await displayAssetDetails("chrome")
    await displayAssetDetails("firefox")

    await verifyGraphNodes("chrome")
    await verifyGraphNodes("firefox")

    await verifyGraphExpand("chrome")
    await verifyGraphExpand("firefox")

    await displayNodeColors("chrome")
    await displayNodeColors("firefox")
}

try {
    runTestCases()
} catch (e) {
    console.error(e)
}
