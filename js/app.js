// Import Configurations
import './config';

// Other Imports
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

// React Components
import { Router, Route, browserHistory } from 'react-router';
import { Tab, Nav, NavItem } from 'react-bootstrap';
import InverseDFT from './components/tabs/InverseDFT.jsx';
import GoogleVisionAPI from './components/tabs/GoogleVisionAPI.jsx';
import FileSelect from './components/FileSelect.jsx';
import injectSheet from 'react-jss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CustomMuiTheme from './config/material-ui-config';

const TAB_IDFT = 0;
const TAB_GVAPI = 1;

const jssClasses = {
    tabContent: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 42px)',
    },
    innerContent: {
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

@injectSheet(jssClasses)
class App extends Component {
    constructor(props) {
        super(props);

        this.handleTabSelect = this.handleTabSelect.bind(this);
        this.handleImgSelect = this.handleImgSelect.bind(this);

        this.state = {
            tab: 0,
            imgSrc: '',
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
            <Tab.Container activeKey={this.state.tab} onSelect={this.handleTabSelect} id='tabs'>
                <div>
                    <Nav bsStyle='tabs'>
                        <NavItem eventKey={TAB_IDFT}>Row/Column IDFT</NavItem>
                        <NavItem eventKey={TAB_GVAPI}>Google Vision API</NavItem>
                    </Nav>
                    <div className={classes.tabContent}>
                        <FileSelect onImgSelect={this.handleImgSelect} onSonify={this.state.sonify}/>
                        <Tab.Content className={classes.innerContent}>
                            <Tab.Pane eventKey={TAB_IDFT}>
                                <InverseDFT hocRef={(idft) => this.idft = idft} imgSrc={this.state.imgSrc}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey={TAB_GVAPI}>
                                <GoogleVisionAPI hocRef={(gvapi) => this.gvapi = gvapi} imgSrc={this.state.imgSrc}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </div>
            </Tab.Container>
        );
    }
}

App.proptypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
};

ReactDOM.render(
    <MuiThemeProvider muiTheme={CustomMuiTheme}>
        <App/>
    </MuiThemeProvider>
, document.getElementById('app-container'));