import { Router } from "express"
import assetControllers from "../controller/assetControllers.js"
import { authenticate } from "./authenticate.js"

const assetRouter = Router()

const getAssetController = (req, res, next) => {
    const controller = assetControllers[req.params.type.toLowerCase()]
    if (controller) {
        req.assetController = controller
        next()
        return
    }
    res.json({ error: "Invalid asset type" })
}

const findAll = (req, res) => req.assetController.findAll(req, res)

const push = (req, res) => req.assetController.push(req, res)

const findById = (req, res) => req.assetController.findById(req, res)

const findChildrenById = (req, res) =>
    req.assetController.findChildrenById(req, res)

assetRouter.use("/:type", getAssetController)

assetRouter.route("/:type").get(findAll).post(authenticate, push)
assetRouter.get("/:type/:id", findById)
assetRouter.get("/:type/:id/children", findChildrenById)

export default assetRouter
