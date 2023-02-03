const loggingModel = require('../model/loggingModel');

let loggingController = {
    push: (req, res) => {
        res.json(
            loggingModel.push(req.body.data, req.body.details, req.body.time)
        )
    }
}

module.exports = loggingController
