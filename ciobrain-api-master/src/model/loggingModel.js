import { appendFile } from "fs"
import path from "path";

const __dirname = path.resolve()

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
            __dirname + "/src/data/log.txt",
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

export default loggingModel
