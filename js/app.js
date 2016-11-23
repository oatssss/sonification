// Import Configurations
import './config';

// Other Imports
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

// React Components
import { Router, Route, browserHistory } from 'react-router';
import { Tabs, Tab } from 'react-bootstrap';
import Centered from './components/Centered.jsx';
import InverseDFT from './components/tabs/InverseDFT.jsx';
import GoogleVisionAPI from './components/tabs/GoogleVisionAPI.jsx';
import FileSelect from './components/FileSelect.jsx';
import injectSheet from 'react-jss';

const TAB_IDFT = 0;
const TAB_GVAPI = 1;

const jssClasses = {
    tabContent: {
        textAlign: 'center',
    },
};

@injectSheet(jssClasses)
class App extends Component {
    constructor(props) {
        super(props);

        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.handleImgSelect = this.handleImgSelect.bind(this);

        this.state = {
            tab: 0,
        }
    }

    handleTabSelect(tab) {
        let sonify;
        if      (tab == TAB_IDFT) {
            sonify = this.idft.sonify;
        }
        else if (tab == TAB_GVAPI) {
            sonify = this.gvapi.sonify;
        }

        this.setState({tab, sonify});
    }

    handleImgSelect(imgSrc) {
        this.setState({imgSrc});
    }

    componentDidMount() {
        this.setState({
            sonify: this.idft.sonify
        });
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <Tabs activeKey={this.state.tab} onSelect={this.handleTabSelect} id='tabs'>
                <div className={classes.tabContent}>
                    <FileSelect onImgSelect={this.handleImgSelect} onSonify={this.state.sonify}/>
                </div>
                <Tab eventKey={TAB_IDFT} title="Row/Column IDFT">
                    <InverseDFT hocRef={(idft) => this.idft = idft} imgSrc={this.state.imgSrc}/>
                </Tab>
                <Tab eventKey={TAB_GVAPI} title="Google Vision API">
                    <Centered>
                        <GoogleVisionAPI hocRef={(gvapi) => this.gvapi = gvapi} imgSrc={this.state.imgSrc}/>
                    </Centered>
                </Tab>
            </Tabs>
        );
    }
}

App.proptypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
};

ReactDOM.render(<App/>, document.getElementById('app-container'));