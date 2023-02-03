import React, { Component } from "react"
import cloud from "../images/cloud.png"
import toggle from "../images/toggle.png"
import "./Header.css"

export default class Header extends Component {
    render() {
        return (
            <div className="header-text">
                <div id="knowledge-graph-text">Knowledge Graph</div>
                <div id="cloud-img">
                    <img src={cloud} alt="Cloud" />
                </div>
                <div id="toggle-img">
                    <img src={toggle} alt="Toggle" />
                </div>
                <div id="ciobrain-text">CIOBrain</div>
            </div>
        )
    }
}
