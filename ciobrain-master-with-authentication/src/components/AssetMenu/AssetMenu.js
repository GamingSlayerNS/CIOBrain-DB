import React, { Component } from "react"
import AssetCategoryOption from "./AssetCategoryOption"
import { AssetCategoryEnum } from "../AssetCategoryEnum"
import AssetImport from "../AssetImport/AssetImport.js"

export default class AssetMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategory: null,
            selectedAssetKey: null
        }
    }

    selectCategory(category) {
        this.setState({ selectedCategory: category })
    }

    selectAsset(assetKey) {
        this.setState({ selectedAssetKey: assetKey })
        this.props.selectAsset(this.state.selectedCategory, assetKey)
    }

    render() {
        return (
            <div id="assetMenu" className="card">
                <div id="assetMenuHeader">
                    <div>Assets</div>
                    <AssetImport />
                </div>
                {Object.values(AssetCategoryEnum).map(category => (
                    <AssetCategoryOption
                        key={category.name}
                        category={category.name}
                        selected={this.state.selectedCategory === category.name}
                        color={category.color}
                        backgroundColor={
                            category.name === this.state.selectedCategory
                                ? category.backgroundColor
                                : "white"
                        }
                        selectCategory={this.selectCategory.bind(this)}
                        selectAsset={this.selectAsset.bind(this)}
                    />
                ))}
            </div>
        )
    }
}
