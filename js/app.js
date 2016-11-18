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

        this.state = {
            tab: 0,
        }
    }

    handleTabSelect(tab) {
        this.setState({tab});
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <Tabs activeKey={this.state.tab} onSelect={this.handleTabSelect} id='tabs'>
                <div className={classes.tabContent}>
                    <FileSelect/>
                </div>
                <Tab eventKey={0} title="Row/Column IDFT">
                    <InverseDFT/>
                </Tab>
                <Tab eventKey={1} title="Google Vision API" disabled>
                    <Centered>
                        <GoogleVisionAPI/>
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