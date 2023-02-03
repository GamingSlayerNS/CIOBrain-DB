import axios from "axios"

const URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3001/asset"
        : "https://ciobrainapi.azurewebsites.net/asset"
let errorLoggingURL = URL + "/log"

export async function log(error, details) {
    displayMessage(error)
    try {
        const response = await axios.post(errorLoggingURL, {
            time: getCurrentDateTime(),
            data: "ERROR: " + error,
            details: details
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

function displayMessage(error) {
    window.app.addMessage(error + ". See server log for more details. ")
}

function getCurrentDateTime() {
    const today = new Date()
    const date = `${today.getFullYear()}-${
        today.getMonth() + 1
    }-${today.getDate()}`
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    return `${date} ${time}`
}
