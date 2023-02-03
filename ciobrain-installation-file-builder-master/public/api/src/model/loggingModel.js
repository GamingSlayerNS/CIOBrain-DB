const { appendFile } = require('fs');
const path = require('path');

let loggingModel = {
    push: (data, details, dateTime = null) => {
        if (!dateTime) {
            const today = new Date()
            const date =
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate()
            const time =
                today.getHours() +
                ":" +
                today.getMinutes() +
                ":" +
                today.getSeconds()
            dateTime = date + " " + time
        }
        appendFile(
            path.join(__dirname, '/..', 'data', 'log.txt'),
            dateTime + " " + data + "\n\tDetails: " + details + "\n",
            err => {
                if (err) {
                    console.log(err)
                    return false
                }
            }
        )
    }
}

module.exports = loggingModel
