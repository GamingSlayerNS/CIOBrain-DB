import axios from "axios"
import { AssetCategoryEnum } from "../components/AssetCategoryEnum.js"

const URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3001/asset"
        : "https://ciobrainapi.azurewebsites.net/asset"
const api = axios.create({ baseURL: URL })

const get = async url => {
    try {
        return (await api.get(url)).data
    } catch (error) {
        console.log(error)
    }
}

const post = async (url, data) => {
    try {
        return (await api.post(url, data)).data
    } catch (error) {
        console.log(error)
    }
}

export const getAssetById = async (category, id) =>
    await get(`/${category}/${id}`)

export const getAssetChildrenById = async (category, id) =>
    await get(`/${category}/${id}/children`)

export const getAllAssetsForCategory = async category =>
    await get(`/${category}`)

export const pushAssets = async (category, assets) =>
    await post(`/${category}`, assets)

export const getAllAssets = async () =>
    (
        await Promise.all(
            Object.values(AssetCategoryEnum).map(c =>
                getAllAssetsForCategory(c.name)
            )
        )
    ).flat()
