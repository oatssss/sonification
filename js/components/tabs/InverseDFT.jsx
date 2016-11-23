import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import Centered from '../Centered.jsx';
import InteractableCanvas from '../InteractableCanvas.jsx';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';

const jssClasses = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: '52px',
    },
    footer: {
        position: 'fixed',
        bottom: 0,
        background: 'white',
    },
};

export const DefaultSize = 512;

@injectSheet(jssClasses)
export default class InverseDFT extends Component {
    constructor(props) {
        super(props);

        this.sizeSelect = this.sizeSelect.bind(this);
        this.sonify = this.sonify.bind(this);
        this.sonifyColumn = this.sonifyColumn.bind(this);

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

    sonify() {
        console.log('Sonify IDFT');
    }

    sonifyColumn() {

    }

    componentDidMount() {
        this.props.hocRef(this);
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={classes.container}>
                <InteractableCanvas imgSrc={this.props.imgSrc} size={this.state.size} canvasID='kanvas-idft'/>
                <br/>
                IDFT Description
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
    hocRef: PropTypes.func,
};
