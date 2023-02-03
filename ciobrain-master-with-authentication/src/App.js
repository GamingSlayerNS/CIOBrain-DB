import "./App.css"
import React, {Component} from "react"
import Header from "./components/Header"
import AssetMenu from "./components/AssetMenu/AssetMenu"
import AssetDetails from "./components/AssetDetails"
import Graph from "./components/Graph"
import MessageModal from "./components/MessageModal"
import Popup from "reactjs-popup"

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategory: null,
            selectedAssetKey: null,
            messages: [],
            width: window.innerWidth
        }
        window.app = this
        this.removeMessage = this.removeMessage.bind(this)
    }

    addMessage(message) {
        let messages = this.state.messages
        messages.push(message)
        this.setState({ message: messages })
    }

    removeMessage(e) {
        const messages = this.state.messages
        messages.splice(e.currentTarget.outerHTML.replace(/\D/g, ""))
        this.setState({ message: messages })
    }

    selectAsset(selectedCategory, selectedAssetKey) {
        this.setState({
            selectedCategory: selectedCategory,
            selectedAssetKey: selectedAssetKey,
            messages: []
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this))
    }

    handleResize(){
        this.setState({width: window.innerWidth})
    }

    popupContent(close){
        return <div className="modal">
            <AssetMenu selectAsset={this.selectAsset.bind(this)}/>
            <div className="close" onClick={close}>&times;</div>
        </div>
    }

    render() {
        const isSmallScreen = this.state.width <= 812 // 812px is defined in App.css
        return (
            <div>
                <Header />
                {isSmallScreen && <div className="mobileAssetsContainer">
                        <Popup
                            trigger={<button className="chooseAssetButton">ASSETS</button>}
                            modal={true}
                            contentStyle={{backgroundColor: "rgb(0,0,0,0)", border: "none"}}
                            closeOnEscape={false}
                            closeOnDocumentClick={false}
                        >
                            {close => this.popupContent(close)}
                        </Popup>
                        <AssetDetails
                            selectedCategory={this.state.selectedCategory}
                            selectedAssetKey={this.state.selectedAssetKey}
                        />
                    </div>
                }
                <div className="assetsContainer">
                    <AssetDetails
                        selectedCategory={this.state.selectedCategory}
                        selectedAssetKey={this.state.selectedAssetKey}
                    />
                    <AssetMenu selectAsset={this.selectAsset.bind(this)} />
                </div>                
                <Graph
                    selectedCategory={this.state.selectedCategory}
                    selectedAssetKey={this.state.selectedAssetKey}
                />
                {this.state.messages &&
                    this.state.messages.map((message, index) => (
                        <MessageModal
                            key={index}
                            index={index}
                            message={message}
                            removeMessage={this.removeMessage}
                        />
                    ))}
            </div>
        )
    }
}
