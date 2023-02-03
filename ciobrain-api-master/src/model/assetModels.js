import BaseAssetModel from "./BaseAssetModel.js"

const assetModels = {
    application: new BaseAssetModel(
        "./src/data/Application.xlsx",
        "Application"
    ),
    data: new BaseAssetModel("./src/data/Data.xlsx", "Data"),
    infrastructure: new BaseAssetModel(
        "./src/data/Infrastructure.xlsx",
        "Infrastructure"
    ),
    talent: new BaseAssetModel("./src/data/Talent.xlsx", "Talent"),
    projects: new BaseAssetModel("./src/data/Projects.xlsx", "Projects"),
    business: new BaseAssetModel("./src/data/Business.xlsx", "Business")
}

export default assetModels
