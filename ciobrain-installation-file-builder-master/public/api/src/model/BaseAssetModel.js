const XLSX = require('xlsx');

class BaseAssetModel {
    constructor(filePath, assetType) {
        const workbook = XLSX.readFile(filePath, { type: "binary" })
        this.data = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
        )
        this.assetType = assetType
        this.data.forEach(asset => (asset["Asset Type"] = assetType))
    }

    push = assets => {
        let importedAssets = 0
        let invalidAssets = 0
        let duplicateAssets = 0
        assets.forEach(asset => {
            const id = asset[this.assetType + " ID"]
            if (!id) {
                invalidAssets++
            } else if (this.findById(id)) {
                duplicateAssets++
            } else {
                asset["Asset Type"] = this.assetType
                this.data.push(asset)
                importedAssets++
            }
        })
        return {
            imported: importedAssets,
            duplicate: duplicateAssets,
            invalid: invalidAssets
        }
    }

    findById = id =>
        this.data.find(
            item => parseInt(item[this.assetType + " ID"]) === parseInt(id)
        )

    findAll = _ => this.data
}

module.exports = BaseAssetModel;
