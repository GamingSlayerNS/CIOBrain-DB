const BaseAssetModel = require('./BaseAssetModel');
const path = require('path');

const assetModels = {
    application: new BaseAssetModel(
        path.join(__dirname, '/..', 'data', 'Application.xlsx'),
        "Application"
    ),
    data: new BaseAssetModel(path.join(__dirname, '/..', 'data', 'Data.xlsx'), "Data"),
    infrastructure: new BaseAssetModel(
        path.join(__dirname, '/..', 'data', 'Infrastructure.xlsx'),
        "Infrastructure"
    ),
    talent: new BaseAssetModel(path.join(__dirname, '/..', 'data', 'Talent.xlsx'), "Talent"),
    projects: new BaseAssetModel(path.join(__dirname, '/..', 'data', 'Projects.xlsx'), "Projects"),
    business: new BaseAssetModel(path.join(__dirname, '/..', 'data', 'Business.xlsx'), "Business")
}

module.exports = assetModels
