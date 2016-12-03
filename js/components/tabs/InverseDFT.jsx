import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import InteractableCanvas from '../InteractableCanvas.jsx';
import ImgCanvas from '../ImgCanvas.jsx';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import Slider from 'material-ui/Slider';
import { Tooltip, Overlay } from 'react-bootstrap';
import hocRef from '../../utitlities/HOCRefDecorator.jsx';
import { turnAudioOn, turnAudioOff, sonifyImgData, changeColumnPeriod, Range } from '../../utitlities/audio-functions.js';

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
        left: '50%',
        bottom: 0,
        transform: 'translateX(-50%)',
        background: 'white',
    },
    invisible: {
        display: 'none',
    },
    slider: {
        width: '100%',
    },
    tooltip: {
        zIndex: 'unset !important',
    },
};

export const DefaultSize = 512;

@injectSheet(jssClasses)
@hocRef
export default class InverseDFT extends Component {
    constructor(props) {
        super(props);

        this.sizeSelect = this.sizeSelect.bind(this);
        this.setImgData = this.setImgData.bind(this);
        this.sonify = this.sonify.bind(this);
        this.sonifyPoint = this.sonifyPoint.bind(this);
        this.sonifySection = this.sonifySection.bind(this);
        this.changeColPeriod = this.changeColPeriod.bind(this);
        this.calcTotalPeriodDuration = this.calcTotalPeriodDuration.bind(this);
        this.calcColumnPeriodDuration = this.calcColumnPeriodDuration.bind(this);

        this.state = {
            size: DefaultSize,
            sizeLabel: `Image Size: ${DefaultSize} x ${DefaultSize}`,
            columnPeriod: 13,
            showPeriodInfo: false,
            playSound: false,
            sonification: () => {},
        };
    }

    sizeSelect(size, synthEvent) {
        this.setState({
            size,
            sizeLabel: `${size} x ${size}`,
        });
        this.state.sonification();
    }

    setImgData(imgData) {
        this.imgData = imgData;
        this.state.sonification();
    }

    sonify() {
        sonifyImgData(this.imgData, this.calcTotalPeriodDuration(this.state.columnPeriod));
        this.setState({playSound:true,sonification:this.sonify});
    }

    sonifyPoint(x, y) {
        const section = new Range(x, y, 1, this.state.size); // A single column as the section
        sonifyImgData(this.imgData, this.calcTotalPeriodDuration(this.state.columnPeriod), section);
        this.setState({playSound:true, sonification:() => this.sonifyPoint(x, y)});
    }

    sonifySection(range) {
        sonifyImgData(this.imgData, this.calcTotalPeriodDuration(this.state.columnPeriod), range);
        this.setState({playSound:true, sonification:() => this.sonifySection(range)});
    }

    changeColPeriod(event, value) {
        changeColumnPeriod(this.calcTotalPeriodDuration(value));
        this.setState({columnPeriod:value});
    }

    calcTotalPeriodDuration(sliderVal) {
        return sliderVal*this.state.size/1000;
    }

    calcColumnPeriodDuration(sliderVal) {
        return sliderVal;
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.playSound !== this.state.playSound) {
            if (nextState.playSound) {
                turnAudioOn();
            } else {
                turnAudioOff();
            }
        }
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div
                ref={(container) => this.container = container}
                className={classes.container}
            >
                <ImgCanvas
                    className={classes.invisible}
                    imgSrc={this.props.imgSrc}
                    onImgLoad={this.setImgData}
                    canvasSize={this.state.size}
                    imgSize={this.state.size}
                    canvasID={'kanvas-idft-invisible'}
                />
                <InteractableCanvas
                    imgSrc={this.props.imgSrc}
                    canvasSize={DefaultSize}
                    imgSize={this.state.size}
                    canvasID='kanvas-idft'
                    sonifyPoint={this.sonifyPoint}
                    sonifySection={this.sonifySection}
                />
                <div
                    style={{position:'relative', width:'100%'}}
                    ref={(sliderContainer) => this.sliderContainer = sliderContainer}
                >
                    <Overlay
                        show={this.state.showPeriodInfo}
                        placement='top'
                        container={this.sliderContainer}
                        target={() => this.slider}
                    >
                        <Tooltip
                            placement='top'
                            id='tooltip-total-period'
                        >
                            Total Periodic Duration: {Number(this.calcTotalPeriodDuration(this.state.columnPeriod)).toFixed(2)}s
                        </Tooltip>
                    </Overlay>
                    <Overlay
                        show={this.state.showPeriodInfo}
                        placement='bottom'
                        container={this.sliderContainer}
                        target={() => this.slider}
                    >
                        <Tooltip
                            placement='bottom'
                            id='tooltip-individual-period'
                        >
                            Periodic Duration per Column: {Number(this.calcColumnPeriodDuration(this.state.columnPeriod)).toFixed(2)}ms
                        </Tooltip>
                    </Overlay>
                    <span style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        PERIODICITY
                        <br/>
                        {Number(this.calcTotalPeriodDuration(this.state.columnPeriod)).toFixed(2)}s | {Number(this.calcColumnPeriodDuration(this.state.columnPeriod)).toFixed(2)}ms
                    </span>
                    <Slider
                        style={{width:'100%',paddingTop:'25px'}}
                        ref={(slider) => this.slider = slider}
                        min={1}
                        max={25}
                        defaultValue={13}
                        step={0.01}
                        value={this.state.periodSlider}
                        onChange={this.changeColPeriod}
                        onDragStart={() => this.setState({showPeriodInfo:true})}
                        onDragStop={() => this.setState({showPeriodInfo:false})}
                    />
                </div>
                IDFT Description
                <div className={classes.footer}>
                    <Nav activeKey={this.state.size} onSelect={this.sizeSelect} id='sizes' bsStyle='tabs'>
                        <NavDropdown title={this.state.sizeLabel} id='sizes-dropdown' dropup>
                            <MenuItem eventKey={32}>32 x 32</MenuItem>
                            <MenuItem eventKey={64}>64 x 64</MenuItem>
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
