import axios from "axios"
import { axisBottom } from "d3-axis"

let URL = "http://localhost:3001/asset"
let applicationAssetURL = URL + "/application"
let dataAssetURL = URL + "/data"
let infrastructureAssetURL = URL + "/infrastructure"

export async function getApplicationAssetById(id) {
    try {
        const response = await axios.get(applicationAssetURL + "/" + id)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getDataAssetById(id) {
    try {
        const response = await axios.get(dataAssetURL + "/" + id)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getInfrastructureAssetById(id) {
    try {
        const response = await axios.get(infrastructureAssetURL + "/" + id)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getAllApplicationAssets(id) {
    try {
        const response = await axios.get(applicationAssetURL)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getAllDataAssets(id) {
    try {
        const response = await axios.get(dataAssetURL)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getAllInfrastructureAssets(id) {
    try {
        const response = await axios.get(infrastructureAssetURL)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getApplicationAssetChildrenById(id) {
    try {
        const response = await axios.get(
            applicationAssetURL + "/" + id + "/children"
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getDataAssetChildrenById(id) {
    try {
        const response = await axios.get(dataAssetURL + "/" + id + "/children")
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function getInfrastructureAssetChildrenById(id) {
    try {
        const response = await axios.get(
            infrastructureAssetURL + "/" + id + "/children"
        )
        return response.data
    } catch (error) {
        console.error(error)
    }
}
