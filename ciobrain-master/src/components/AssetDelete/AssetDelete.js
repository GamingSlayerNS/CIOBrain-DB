import React, { Component } from "react"
import Popup from "reactjs-popup"
//import { AssetCategoryEnum } from "../AssetCategoryEnum.js"
import "./AssetDelete.css"
import "reactjs-popup/dist/index.css"
//import XLSX from "xlsx"
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

export default class AssetDelete extends Component {
    
    constructor(props) {
        super(props)
        this.state = { category: null, asset: null, result: null }
    }

    render() {
        return (
                <Popup
                    trigger={<button className="deleteButton">Delete</button>}
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

        // const labelStyle = color => ({
        //     display: "flex",
        //     width: "33.33%",
        //     color: color,
        //     margin: "auto",
        //     fontSize: "20px",
        //     justifyContent: "center"
        // })

        function handleSubmit(event) {
            //event.preventDefault();
            const formData = new FormData(event.target);
            const selectedValue = formData.get('selectedOption');
            const textInput = event.target.textInput.value
            ASSET.deleteAsset(selectedValue,textInput)
        }

        return (
                <div className="modal">
                    <div className="close" onClick={closeAndReset}>
                        &times;
                    </div>
                    <div className="header">Choose a type</div>
                    <div className="content">
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div>
                            <label htmlFor="selectedOption">Select a type:</label>
                            <input list="browsers" name="selectedOption" autoComplete="off" />
                            <datalist id="browsers">
                                <option value="Application" />
                                <option value="Data" />
                                <option value="Infrastructure" />
                                <option value="Talent" />
                                <option value="Projects" />
                                <option value="Business" />
                            </datalist>
                        </div>
                        <div>
                            <label htmlFor="textInput">ID:</label>
                            <input type="text" name="textInput" />
                        </div>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }

    async deleteAsset(selectedAsset,id) {
        const state = this.state
        const category = state.category
        const asset = state.asset
        if (!category || !asset) return { error: "Invalid Asset" }
        return await ASSET.deleteAsset(selectedAsset,id)
    }
}
