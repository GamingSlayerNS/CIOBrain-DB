import AssetController from "./BaseAssetController.js"
import assetModels from "../model/assetModels.js"

const assetControllers = Object.fromEntries(
    Object.entries(assetModels).map(([type, model]) => [
        type,
        new AssetController(model)
    ])
)

export default assetControllers
