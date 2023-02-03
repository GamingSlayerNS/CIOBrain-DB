import React, { Component } from "react"
import "./AssetCategoryOption.css"
import * as asset from "./../../common/Asset"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"

export default class AssetCategoryOption extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: false,
            backgroundColor: "white",
            assetCategoryOptions: [],
            idColumnName: "",
            selectedAssetKey: null,
            hoveredAssetKey: null,
            hovering: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selected,
            backgroundColor: nextProps.backgroundColor
        })
    }

    async componentDidMount() {
        let assetCategoryOption = await asset.getAllAssetsForCategory(
            this.props.category
        )
        this.setState({ assetCategoryOptions: assetCategoryOption })
    }

    selectCategory(event) {
        this.props.selectCategory(this.props.category)
        event.preventDefault()
    }

    selectAsset(event) {
        const arr = JSON.stringify(event.target.outerHTML).split(" ")
        const assetKey = parseInt(
            arr.find(element => element.includes("data-key")).match(/\d+/g)[0]
        )
        this.props.selectAsset(assetKey)
        this.setState({ selectedAssetKey: assetKey })
        event.preventDefault()
    }

    render() {
        return (
            <div>
                <div
                    className="assetCategoryOption"
                    style={{ backgroundColor: this.state.backgroundColor }}
                    onClick={this.selectCategory.bind(this)}>
                    <div style={{ color: this.props.color }}>
                        {this.props.category}
                    </div>
                </div>
                {this.state.selected && this.displayCategoryDropdown()}
            </div>
        )
    }

    displayCategoryDropdown() {
        const contentStyle = { minWidth: "max-content" }
        return (
            <div className="assetCategoryDropdown">
                {this.state.assetCategoryOptions &&
                    this.state.assetCategoryOptions.map(
                        (assetOption, index) => (
                            <Popup
                                trigger={this.createAssetOption(
                                    index,
                                    assetOption
                                )}
                                {...{ contentStyle }}
                                on="hover"
                                position="right center"
                                key={index}>
                                {this.displayHoverInfo(assetOption)}
                            </Popup>
                        )
                    )}
            </div>
        )
    }

    displayHoverInfo(assetOption) {
        // no connection displayed since its calculated when links are created
        const details = [
            "Name",
            "Type",
            "Owner",
            "Vendor",
            "Language",
            "Software",
            "Business Function",
            "Comment"
        ]
        return details.map(
            detail =>
                assetOption[detail] && (
                    <div key={detail}>
                        <label>{detail}:&nbsp;</label>
                        <label style={{ fontWeight: "bold" }}>
                            {assetOption[detail]}
                            <br />
                        </label>
                    </div>
                )
        )
    }

    createAssetOption(index, assetOption) {
        const idColumnName = this.props.category + " ID"
        const getTextDecorationStyle = assetId =>
            this.props.category === assetOption["Asset Type"] &&
            this.state.selectedAssetKey === assetId
                ? {
                      color: this.props.color,
                      textDecoration: "underline"
                  }
                : { color: this.props.color }

        return (
            <div
                className="assetOption"
                key={index}
                data-key={assetOption[idColumnName]}
                value={index}
                style={getTextDecorationStyle(assetOption[idColumnName])}
                onClick={this.selectAsset.bind(this)}>
                {assetOption["Name"]}
            </div>
        )
    }
}
