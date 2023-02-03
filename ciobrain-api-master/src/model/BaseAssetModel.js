import XLSX from "xlsx"

export default class BaseAssetModel {
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
            const name = asset['Name']
            if (!id) {
                invalidAssets++
            } else if (this.findByIdAndName(id, name)) {
                duplicateAssets++
            } else {
                asset["Asset Type"] = this.assetType
                if (this.findById(id)) {
                    asset[this.assetType + " ID"] = this.getNextId();
                }
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

    findByIdAndName = (id, name) => this.data.find(item => parseInt(item[this.assetType + " ID"]) === parseInt(id) && item['Name'] === name)

    findAll = _ => this.data

    getNextId = _ => {
        let maxId = 1;
        for (let asset of this.data) {
            if (parseInt(asset[this.assetType + " ID"]) > maxId) {
                maxId = parseInt(asset[this.assetType + " ID"]);
            }
        }
        return maxId;
    }
}
