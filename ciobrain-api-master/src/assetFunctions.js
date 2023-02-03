import loggingModel from "./model/loggingModel.js"

let assetFunctions = {
    /**
     * @param {Object} asset
     * @param {Array<Object>} childrenIDs
     * @param {BaseAssetModel} assetModel
     */
    filterForValidChildren: (asset, childrenIDs, assetModel) => {
        return childrenIDs
            .map(id => {
                const child = assetModel.findById(id)
                const type = assetModel.assetType
                if (!child) {
                    loggingModel.push(
                        `${type} Connection with an ID of ${id} for asset "${asset["Name"]}" does not exist`,
                        JSON.stringify(asset)
                    )
                    return null
                } else if (!child["Name"]) {
                    loggingModel.push(
                        `${type} Connection with an ID of ${id} for asset "${asset["Name"]}" exists but is invalid`,
                        JSON.stringify(asset)
                    )
                    return null
                }
                return child
            })
            .filter(item => item != null)
    }
}

export default assetFunctions
