import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import Centered from '../Centered.jsx';
import InteractableCanvas from '../InteractableCanvas.jsx';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';

const jssClasses = {
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 42px - 54px)'
    },
    footer: {
        display: 'inline-block',
        position: 'fixed',
        bottom: 0,
        transform: 'translateX(-50%)',
        background: 'white',
    },
    flexGrow: {
        flex: '1 0 auto',
    },
    centerHorizontal: {
        textAlign: 'center',
    }
};

export const DefaultSize = 512;

@injectSheet(jssClasses)
export default class InverseDFT extends Component {
    constructor(props) {
        super(props);

        this.sizeSelect = this.sizeSelect.bind(this);

        this.state = {
            size: DefaultSize,
            sizeLabel: `Image Size: ${DefaultSize} x ${DefaultSize}`,
        };
    }

    sizeSelect(size, synthEvent) {
        this.setState({
            size,
            sizeLabel: `${size} x ${size}`,
        });
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={classes.centerHorizontal}>
                <div className={classes.container}>
                    <Centered className={classes.flexGrow}>
                        <InteractableCanvas imgSrc={this.props.imgSrc} size={this.state.size}/>
                        <br/>
                        IDFT Description
                    </Centered>
                </div>
                <div className={classes.footer}>
                    <Nav activeKey={this.state.size} onSelect={this.sizeSelect} id='sizes' bsStyle='tabs'>
                        <NavDropdown title={this.state.sizeLabel} id='sizes-dropdown' dropup>
                            <MenuItem eventKey={128}>128 x 128</MenuItem>
                            <MenuItem eventKey={256}>256 x 256</MenuItem>
                            <MenuItem eventKey={512}>512 x 512</MenuItem>
                        </NavDropdown>
                    </Nav>
                </div>
            </div>
        );
    }
}

InverseDFT.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
    imgSrc: PropTypes.string,
};
