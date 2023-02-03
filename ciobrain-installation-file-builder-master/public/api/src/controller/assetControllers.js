const assetModels = require('../model/assetModels');
const AssetController = require('./BaseAssetController');

const assetControllers = Object.fromEntries(
    Object.entries(assetModels).map(([type, model]) => [
        type,
        new AssetController(model)
    ])
)

module.exports = assetControllers
