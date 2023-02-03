import loggingModel from "../model/loggingModel.js"

let loggingController = {
    push: (req, res) => {
        res.json(
            loggingModel.push(req.body.data, req.body.details, req.body.time)
        )
    }
}

export default loggingController
