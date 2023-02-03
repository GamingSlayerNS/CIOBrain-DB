import { getAllAssets, pushAssetsWithUrlPassword } from "../../common/Asset";
import { AssetCategoryEnum } from "../AssetCategoryEnum";

export const CONTACT_API_ERROR = "Could not contact API Server at URL"
const API_AUTHENTICATION_ERROR = "Could not authenticate using password"

const transfer = async (url, password) => {
    if (!url || url.length === 0) return false;
    const categories = await getData();
    const result = {
        error: null,
        imported: 0,
        duplicate: 0,
        invalid: 0
    }
    for (const category in categories) {
        console.log(category);
        const response = await pushAssetsWithUrlPassword(category, categories[category], url, password);
        console.log(response);
        if (response && response.status === 200) {
            result.imported += response.data.imported | 0
            result.duplicate += response.data.duplicate | 0
            result.invalid += response.data.invalid | 0
        } else if (response && response.status === 401) {
            result.error = API_AUTHENTICATION_ERROR
        } else if (!response || response.status === 500) {
            result.error = CONTACT_API_ERROR
        }
    }
    return result;
}

const getData = async () => {
    const categories = {};
    const assets = await getAllAssets();
    Object.values(AssetCategoryEnum).forEach(c =>
        categories[c.name] = []
    );
    assets.forEach(asset => {
        const category = Object.values(AssetCategoryEnum).find(c =>
            asset.hasOwnProperty(c.name + " ID"));
        if (category.name) {
            categories[category.name].push(asset);
        }
    });
    return categories;
}

export default transfer;