import React, {Component} from "react"
import * as d3 from "d3"
import "./Graph.css"
import {AssetCategoryEnum} from "./AssetCategoryEnum"
import {getAllAssets, getAssetChildrenById} from "../common/Asset.js"

export default class Graph extends Component {
    constructor(props) {
        super(props)
        this.graphReference = React.createRef()
        this.state = {
            selectedCategory: this.props.selectedCategory,
            selectedAssetKey: this.props.selectedAssetKey,
            assets: null,
            width: null,
            height: null,
            resizeTimeout: null,
            data: { nodes: [], links: [] },
            zoomTransform: null,
            expanded: []
        }
    }

    async componentWillReceiveProps(nextProps) {
        const newCategory = nextProps.selectedCategory
        const newKey = nextProps.selectedAssetKey
        if (
            this.state.selectedCategory === newCategory &&
            this.state.selectedAssetKey === newKey
        )
            return
        this.setState(
            {
                selectedCategory: newCategory,
                selectedAssetKey: newKey,
                data: { nodes: [], links: [] },
                expanded: []
            },
            async _ => {
                if (!newCategory || !newKey) return
                await this.expandAsset(newCategory, newKey)
            }
        )
    }

    async componentDidMount() {
        this.initDimensions()
        window.addEventListener("resize", async _ => {
            if (!this.state.selectedCategory || !this.state.selectedAssetKey)
                return
            clearTimeout(this.state.resizeTimeout)
            this.setState({
                resizeTimeout: setTimeout(await this.updateDimensions, 500)
            })
        })
    }

    async componentWillUnmount() {
        window.removeEventListener("resize", await this.updateDimensions)
    }

    initDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight })
    };

    updateDimensions = async () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight })
        await this.update(this.state.selectedCategory, this.state.selectedAssetKey)
    };

    clearGraph() {
        d3.selectAll("svg").remove().exit()
    }

    // Add assets to the graph.
    async expandAsset(category, key) {
        const id = `${category.charAt(0)}-${key}`
        const expanded = this.state.expanded
        if (expanded.includes(id)) return
        const nodesAndLink = await this.getNodesAndLinks(
            category,
            key,
            this.state.data.nodes
        )
        await this.setState({ data: nodesAndLink })
        await this.update(
            this.state.selectedCategory,
            this.state.selectedAssetKey
        )
        expanded.push(id)
    }

    tagAndAddIfNew = (asset, nodes) => {
        const type = asset["Asset Type"]
        asset.id = `${type.charAt(0)}-${asset[type + " ID"]}`
        asset.Connections = 0
        const id = asset.id
        if (nodes[id] != null) return
        nodes[id] = asset
    }

    // Get nodes and its links to initialize the graph.
    async getNodesAndLinks(category, key, existingAssets = []) {
        let assets = this.state.assets
        if (!assets) {
            assets = await getAllAssets()
            this.setState({ assets: assets })
        }

        // create object for existing assets based on its id
        // ex: { "A-1": {asset}, ... }
        const nodesObj = Object.fromEntries(
            existingAssets.map(asset => {
                // recalculated when creating links
                asset.Connections = 0
                return [asset.id, asset]
            })
        )

        // get root asset with its children
        const root = await getAssetChildrenById(category, key)
        const direct = root.children // direct connections
        delete root.children // separate root and children

        // add the root to nodesObj if it does not already exist
        this.tagAndAddIfNew(root, nodesObj)
        // do the same with its children
        direct.forEach(asset => this.tagAndAddIfNew(asset, nodesObj))

        // get implicit connections to root asset
        const connectionColumn = category + " Connections"
        assets.forEach(asset => {
            const conString = asset[connectionColumn]
            if (!conString || conString.trim().length === 0) return
            const connected = conString
                .split(";")
                .map(item => item.trim())
                .includes(root.id)
            if (!connected) return
            this.tagAndAddIfNew(asset, nodesObj)
        })

        // generate links between all nodes
        const links = []
        const nodes = Object.values(nodesObj)
        const conCategories = Object.values(AssetCategoryEnum).map(
            c => c.name + " Connections"
        )
        nodes.forEach(node => {
            conCategories.forEach(conType => {
                const conString = node[conType]
                if (!conString || conString.trim().length === 0) return
                conString
                    .split(";")
                    .map(item => item.trim())
                    .forEach(connection => {
                        const targetNode = nodesObj[connection]
                        if (!targetNode) return
                        node.Connections++
                        targetNode.Connections++
                        links.push({ source: node.id, target: targetNode.id })
                    })
            })
        })

        return { nodes: nodes, links: links }
    }

    // Check if two assets are the same using their asset type and ID.
    equal(asset1, asset2) {
        const type = asset1["Asset Type"]
        const idCol = type + " ID"
        return asset1[idCol] && asset2[idCol]
            ? asset1[idCol] === asset2[idCol]
            : false
    }

    /**
     * Draw the graph with D3.
     * @param {string} selectedCategory Category of selected asset
     * @param {number} selectedAssetKey Key/ID of selected asset
     * @returns {Promise<void>}
     */
    async update(selectedCategory, selectedAssetKey) {
        this.clearGraph()
        d3.selectAll("div.hoverInfo").remove().exit()

        const container = d3.select(this.graphReference.current)
        const width = this.state.width
        const height = this.state.height

        // tooltip to show info on node when hovering over it
        const hoverInfo = d3
            .select(this.graphReference.current)
            .append("div")
            .attr("class", "hoverInfo")
            .style("opacity", 0)

        const matchSelected = (d, ifMatch, otherwise) => {
            const assetID = d[selectedCategory + " ID"]
            return assetID && assetID === selectedAssetKey ? ifMatch : otherwise
        }

        const zoom = d3.zoom()
        let [x, y, k] = [50, 50, 1];
        
        const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom.transform, () => {
                const t = this.state.zoomTransform
                if (t) {
                    [x, y, k] = [t.x, t.y, t.k];
                    return d3.zoomIdentity.translate(x, y).scale(k);
                } else {
                    return d3.zoomIdentity;
                }
            })
            .call(zoom.on("zoom", e => {
                        svg.attr("transform", e.transform);
                        this.setState({zoomTransform: e.transform})
                    })
                    .scaleExtent([0.45, 3.5]) // zoom scale restriction
                //.translateExtent() // can be used to restrict pan
            )
            .append("g")
            .attr("transform", `translate(${x},${y})scale(${k})`)

        const data = this.state.data

        // initialize the links
        const link = svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa")

        // initialize the nodes
        const node = svg
            .selectAll(".node")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr("class", "node")

        const getType = d => AssetCategoryEnum[d["Asset Type"].toUpperCase()]

        // draw circles for the nodes
        node.append("circle")
            .attr(
                "r",
                d => matchSelected(d, 22, 20) + (d["Connections"] - 1) * 1.4
            )
            .style("fill", d => getType(d).color)
            .attr("stroke", d => getType(d).color)
            .style("stroke-width", 2)

        // and add images on top
        node.append("image")
            .attr("xlink:href", d => getType(d).icon)
            // the size grows with the number of connections it has
            .attr("x", d => -10 - (d["Connections"] - 1))
            .attr("y", d => -10 - (d["Connections"] - 1))
            .attr("width", d => 20 + (d["Connections"] - 1) * 2)
            .attr("height", d => 20 + (d["Connections"] - 1) * 2)

        // and add the name under the nodes
        node.append("text")
            .style("text-anchor", "middle")
            .attr("y", d => 40 + (d["Connections"] - 1))
            .attr("font-weight", d => matchSelected(d, "bold", "normal"))
            .attr("font-size", d => matchSelected(d, "large", "medium"))
            .attr("text-decoration", d => matchSelected(d, "underline", "none"))
            .text(d => d["Name"])

        //Container for the gradients
        const defs = svg.append("defs")

        // filter for the glow around non-selected nodes
        const normalFilter = defs.append("filter").attr("id", "normalGlow")
        normalFilter
            .append("feGaussianBlur")
            .attr("stdDeviation", "1.5")
            .attr("result", "coloredBlur")

        // filter for the glow around the selected node
        const selectedFilter = defs.append("filter").attr("id", "selectedGlow")
        selectedFilter
            .append("feGaussianBlur")
            .attr("stdDeviation", "2.5")
            .attr("result", "coloredBlur")

        // apply it to the nodes
        svg.selectAll("circle").style("filter", d =>
            matchSelected(d, "url(#selectedGlow)", "url(#normalGlow)")
        )

        const forceY = width <= 812 ? height/7 : (2 * height) / 5

        // draw the graph
        const simulation = d3
            .forceSimulation(data.nodes)
            .force(
                "link",
                d3.forceLink(data.links).id(d => d["id"])
            ) // .distance(50)    // play around with this if you want
            .force("charge", d3.forceManyBody().strength(-30))
            .force("collide", d3.forceCollide().radius(65))
            .force("center", d3.forceCenter((2 * width) / 5, forceY))
            .on("tick", _ => {
                // position the links and nodes in the window where the simulation puts them
                link.attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)

                node.attr(
                    "transform",
                    d => "translate(" + d.x + "," + d.y + ")"
                )
            })

        simulation.tick(1000)

        // move the nodes around when dragging them
        let dragStart = event => {
            // make tooltip disappear when starting to drag
            hoverInfo.transition().duration(250).style("opacity", 0)
            if (!event.active) simulation.alphaTarget(0.3).restart()
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        let dragging = event => {
            // without this, the tooltip will reappear while dragging
            hoverInfo.transition().duration(0).style("opacity", 0)
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        let dragEnd = event => {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null
            event.subject.fy = null
        }

        let nodeClick = (_, d) => {
            const category = d["Asset Type"]
            const key = d[category + " ID"]
            this.expandAsset(category, key)
        }

        let nodeHoverEnter = (event, assetData) => {
            // highlight connected links
            svg.selectAll("line")
                .filter(d => d.source === assetData || d.target === assetData)
                .style("stroke", "red")
                .style("stroke-width", 3)

            // reset hover panel
            const detailText = hoverInfo.text("")
            // detailed type of asset
            const type =
                assetData["Asset Type"] === "Infrastructure"
                    ? assetData["Long Type"]
                    : assetData["Type"]

            // labels to add to the tooltip
            const labels = [
                "Name",
                "Connections",
                "Type",
                "Owner",
                "Vendor",
                "Language",
                "Software",
                "Business Function",
                "Comment"
            ]

            labels.forEach(label => {
                // value to display
                const value = label === "Type" ? type : assetData[label]
                if (!value) return

                // add it to the tooltip
                detailText
                    .append("text")
                    .text(label + ": ")
                    .append("text")
                    .style("font-weight", "bold")
                    .text(value)
                    .append("br")
            })

            // ensure hover panel does not go out of the screen
            const posX = event.x
            const posY = event.y
            const panelWidth = hoverInfo.node().getBoundingClientRect().width
            const panelHeight = hoverInfo.node().getBoundingClientRect().height
            const infoX =
                posX >= window.innerWidth * 0.85
                    ? posX - panelWidth - 10
                    : posX + 10
            const infoY =
                posY >= window.innerHeight * 0.85
                    ? posY - panelHeight - 10
                    : posY + 10

            // display the hover panel
            hoverInfo.style("left", infoX + "px").style("top", infoY + "px")
            hoverInfo.transition().duration(250).style("opacity", 1)
        }

        let nodeHoverExit = () => {
            // remove connection highlight on links
            svg.selectAll("line")
                .style("stroke", "#aaa")
                .style("stroke-width", 1)

            // hide hover panel
            hoverInfo.transition().duration(250).style("opacity", 0)
        }

        // expand the asset when clicking on a node and handle dragging them
        node.on("click", nodeClick)
            .on("mouseover", nodeHoverEnter)
            .on("mouseout", nodeHoverExit)
            .call(
                d3
                    .drag()
                    .on("start", dragStart)
                    .on("drag", dragging)
                    .on("end", dragEnd)
            )

        // get the selected node from the list of nodes and update connection in AssetDetails
        // this is a cheap fix. need to find a better way
        data.nodes.forEach(node => {
            if (matchSelected(node, true, false)) {
                const elem = document.getElementById("asset_connections")
                if (!elem) return
                elem.innerHTML = "Connections: " + node.Connections
            }
        })
    }

    render() {
        return <div className="graph" ref={this.graphReference} />
    }
}
