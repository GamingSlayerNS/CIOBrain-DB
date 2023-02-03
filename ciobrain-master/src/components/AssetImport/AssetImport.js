import React, { Component } from "react"
import Popup from "reactjs-popup"
import { AssetCategoryEnum } from "../AssetCategoryEnum.js"
import "./AssetImport.css"
import "reactjs-popup/dist/index.css"
import XLSX from "xlsx"
import * as ASSET from "../../common/Asset.js"

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

const INVALID_FILE = {}

export default class AssetImport extends Component {
    constructor(props) {
        super(props)
        this.state = { category: null, asset: null, result: null }
    }

    render() {
        return (
            <Popup
                trigger={<button className="importButton">Import</button>}
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

        const labelStyle = color => ({
            display: "flex",
            width: "33.33%",
            color: color,
            margin: "auto",
            fontSize: "20px",
            justifyContent: "center"
        })

        const inputResult = () => {
            const category = this.state.category
            switch (category) {
                case null:
                    return ""
                case INVALID_FILE:
                    return <label style={labelStyle("red")}>Invalid File</label>
                default:
                    return (
                        <>
                            <label style={labelStyle(category.color)}>
                                {category.name}
                            </label>
                            <button
                                className="loadButton"
                                disabled={this.state.result}
                                type="submit"
                                style={{ width: "33.33%" }}>
                                Confirm
                            </button>
                        </>
                    )
            }
        }

        const submit = event => {
            event.preventDefault()
            this.pushAssets().then(result => {
                this.setState({ result: result })
            })
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
                <div className="header">Import Assets</div>
                <div className="content">
                    <form onSubmit={submit} style={formStyle}>
                        <input
                            type="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            style={{ width: "33.34%", margin: "auto" }}
                            id="asset-data"
                            onChange={event =>
                                this.validateFile(event.target.files[0])
                            }
                        />
                        {inputResult()}
                    </form>
                    {validateResult()}
                </div>
            </div>
        )
    }

    async pushAssets() {
        const state = this.state
        const category = state.category
        const asset = state.asset
        if (!category || !asset) return { error: "Invalid Asset" }
        return await ASSET.pushAssets(category.name, asset)
    }

    validateFile(file) {
        if (!file) {
            this.setState({ category: null, asset: null, result: null })
            return
        }
        const invalidFile = {
            category: INVALID_FILE,
            asset: INVALID_FILE,
            result: null
        }
        const reader = new FileReader()
        reader.onload = ev => {
            try {
                const workbook = XLSX.read(ev.target.result, { type: "binary" })
                const assets = XLSX.utils.sheet_to_json(
                    workbook.Sheets[workbook.SheetNames[0]]
                )
                const category = Object.values(AssetCategoryEnum).find(c =>
                    assets[0].hasOwnProperty(c.name + " ID")
                )
                const valid =
                    category &&
                    assets.every(asset =>
                        asset.hasOwnProperty(category.name + " ID")
                    )
                this.setState(
                    valid
                        ? { category: category, asset: assets, result: null }
                        : invalidFile
                )
            } catch (ex) {
                this.setState(invalidFile)
            }
        }
        reader.onerror = () => this.setState(invalidFile)
        reader.readAsBinaryString(file)
    }
}
