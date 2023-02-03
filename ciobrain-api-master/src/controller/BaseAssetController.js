import assetModels from "../model/assetModels.js"
import assetFunctions from "../assetFunctions.js"

export default class BaseAssetController {
    /**
     * @param {BaseAssetModel} assetModel
     */
    constructor(assetModel) {
        this._assetModel = assetModel
    }

    push = (req, res) => {
        const assets = req.body.data
        res.json(
            Array.isArray(assets)
                ? this._assetModel.push(req.body.data)
                : { error: "Invalid Body" }
        )
    }

    findById = (req, res) => {
        const id = req.params.id
        const asset = this._assetModel.findById(id)
        if (asset) res.json(asset)
        else
            res.json({
                error: `${id} is not a valid ${this._assetModel.assetType} ID`
            })
    }

    findAll = (req, res) => {
        res.json(this._assetModel.findAll())
    }

    findChildrenById = (req, res) => {
        const id = req.params.id
        let children = []
        let parent = this._assetModel.findById(id)
        if (!parent) {
            res.json({
                error: `${id} is not a valid ${this._assetModel.assetType} ID`
            })
            return
        }

        for (const key in assetModels) {
            const model = assetModels[key]
            const connectionType = model.assetType + " Connections"
            const connections = parent[connectionType]
            if (connections && connections.trim().length) {
                const childrenIds = connections
                    .split(";")
                    .map(item => parseInt(item.replace(/\D/g, "")))
                children.push(
                    ...assetFunctions.filterForValidChildren(
                        parent,
                        childrenIds,
                        model
                    )
                )
            }
        }

        const hierarchy = {
            ...parent,
            children: children
        }

        res.json(hierarchy)
    }
}
