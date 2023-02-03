import { Component } from "react"
import Popup from "reactjs-popup"
import transfer from "./Transfer"

const modalStyle = {
    maxWidth: "600px",
    width: "80%",
    borderRadius: "10px",
    border: "1px solid #D6D6D6",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)"
}

const formStyle = {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    justifyContent: "center"
}

export default class AssetTransfer extends Component {
    
    constructor(props) {
        super(props)
        this.state = { result: null }
    }

    render() {
        return (
            <Popup
                trigger={<button className="importButton">Upload</button>}
                modal={true}
                closeOnEscape={false}
                closeOnDocumentClick={false}
                contentStyle={modalStyle}>
                {close => this.popupContent(close)}
            </Popup>
        )
    }

    popupContent(close) {
        const closeAndReset = event => {
            close(event)
            this.setState({ category: null, asset: null, result: null })
        }

        const submit = async event => {
            event.preventDefault()
            const url = document.getElementById('Azure-API-URL').value;
            const password = document.getElementById('Azure-API-Password').value
            const result = await transfer(url, password);
            this.setState({result: result});
        }

        const validateResult = () => {
            const result = this.state.result
            if (!result) return null
            const error = result["error"]
            if (error)
                return (
                    <div className="importDetails" style={{ color: "red" }}>
                        {error}
                    </div>
                )

            const [imported, duplicate, invalid] = [
                result["imported"],
                result["duplicate"],
                result["invalid"]
            ]
            const importedCount = parseInt(imported)
            return (
                <>
                    <div className="importDetails">
                        <div>
                            Imported: <b>{imported}</b>
                        </div>
                        <div>
                            Duplicate: <b>{duplicate}</b>
                        </div>
                        <div>
                            Invalid: <b>{invalid}</b>
                        </div>
                    </div>
                    {importedCount ? (
                        <div style={{ textAlign: "center" }}>
                            <button
                                type="button"
                                className="loadButton"
                                onClick={() => window.location.reload()}>
                                Refresh
                            </button>
                        </div>
                    ) : null}
                </>
            )
        }

        return (
            <div className="modal">
                <div className="close" onClick={closeAndReset}>
                    &times;
                </div>
                <div className="header">Upload Data</div>
                <div className="content">
                    <form onSubmit={submit} style={formStyle}>
                        <input
                            type="text"
                            placeholder="Azure API URL"
                            style={{ width: "33.34%", margin: "auto" }}
                            id="Azure-API-URL"
                        />
                        <input
                            type="password"
                            placeholder="API Password"
                            style={{ width: "33.34%", margin: "auto" }}
                            id="Azure-API-Password"
                        />
                        <input 
                            type="submit"
                        />
                    </form>
                    {validateResult()}
                </div>
            </div>
        )
    }
}