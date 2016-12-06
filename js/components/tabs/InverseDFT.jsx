import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import InteractableCanvas from '../InteractableCanvas.jsx';
import ImgCanvas from '../ImgCanvas.jsx';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import Slider from 'material-ui/Slider';
import { Tooltip, Overlay } from 'react-bootstrap';
import hocRef from '../../utitlities/HOCRefDecorator.jsx';
import { turnAudioOn, turnAudioOff, sonifyImgData, changeTotalPeriod, Range } from '../../utitlities/audio-functions.js';
import LiveVisualizer from '../LiveVisualizer.jsx';

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

export const DefaultImgSize = 64;
export const DefaultCanvasSize = 512;

const periodTypes = Object.freeze({
    SUM: 0,
    SINGLE: 1,
    SECTION: 2,
});

@injectSheet(jssClasses)
@hocRef
export default class InverseDFT extends Component {
    constructor(props) {
        super(props);

        this.sizeSelect = this.sizeSelect.bind(this);
        this.setImgData = this.setImgData.bind(this);
        this.sonify = this.sonify.bind(this);
        this.sonifyColumn = this.sonifyColumn.bind(this);
        this.sonifySection = this.sonifySection.bind(this);
        this.changeColPeriod = this.changeColPeriod.bind(this);
        this.calcTotalPeriodDuration = this.calcTotalPeriodDuration.bind(this);
        this.calcColumnPeriodDuration = this.calcColumnPeriodDuration.bind(this);
        this.calcSectionPeriodDuration = this.calcSectionPeriodDuration.bind(this);

        this.state = {
            size: DefaultImgSize,
            sizeLabel: `Image Size: ${DefaultImgSize} x ${DefaultImgSize}`,
            colPeriod: 13,
            showPeriodInfo: false,
            playSound: false,
            sonification: () => {},
            periodType: periodTypes.SUM,
            sectionWidth: DefaultImgSize,
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
        sonifyImgData(this.imgData, this.calcTotalPeriodDuration(this.state.colPeriod));
        this.interactableCanvas.deselectColumn();
        this.setState({
            playSound:true,
            sonification:this.sonify,
            periodType: periodTypes.SUM,
        });
    }

    sonifyColumn(x) {
        const section = new Range(x, 0, 1, this.state.size); // A single column as the section
        sonifyImgData(this.imgData, this.calcColumnPeriodDuration(this.state.colPeriod), section);
        this.setState({
            playSound:true,
            sonification:() => this.sonifyColumn(x),
            periodType: periodTypes.SINGLE,
        });
    }

    sonifySection(range) {
        this.setState({
            playSound:true,
            sonification:() => this.sonifySection(range),
            periodType: periodTypes.SECTION,
            sectionWidth: range.width,
        });
        sonifyImgData(this.imgData, this.calcSectionPeriodDuration(this.state.colPeriod), range);
    }

    changePeriodType(periodType) {
        this.changeColPeriod(undefined, this.state.colPeriod);
        this.setState(periodType);
    }

    changeColPeriod(event, value) {
        let totalPeriod;
        if (this.state.periodType === periodTypes.SINGLE) {
            totalPeriod = this.calcColumnPeriodDuration(value);
        }
        else if (this.state.periodType === periodTypes.SECTION) {
            totalPeriod = this.calcSectionPeriodDuration(value);
        }
        else { // periodTypes.SUM
            totalPeriod = this.calcTotalPeriodDuration(value);
        }
        changeTotalPeriod(totalPeriod);
        this.setState({colPeriod:value});
    }

    calcTotalPeriodDuration(sliderVal) {
        return sliderVal/1000*this.state.size;
    }

    calcColumnPeriodDuration(sliderVal) {
        return sliderVal/1000;
    }

    calcSectionPeriodDuration(sliderVal) {
        return sliderVal/1000*this.state.sectionWidth;
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

        let totalPeriodicDuration;
        let periodicity;
        if (this.state.periodType === periodTypes.SINGLE) {
            periodicity = `${Number(this.state.colPeriod).toFixed(2)}ms`;
        }
        else if (this.state.periodType === periodTypes.SECTION) {
            totalPeriodicDuration = this.calcSectionPeriodDuration(this.state.colPeriod);
            periodicity = `${Number(totalPeriodicDuration).toFixed(2)}s | ${Number(this.state.colPeriod).toFixed(2)}ms`;
        }
        else { // periodTypes.SUM
            totalPeriodicDuration = this.calcTotalPeriodDuration(this.state.colPeriod);
            periodicity = `${Number(totalPeriodicDuration).toFixed(2)}s | ${Number(this.state.colPeriod).toFixed(2)}ms`;
        }

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
                    hocRef={(interactableCanvas) => this.interactableCanvas = interactableCanvas}
                    imgSrc={this.props.imgSrc}
                    canvasSize={DefaultCanvasSize}
                    imgSize={this.state.size}
                    canvasID='kanvas-idft'
                    sonifyColumn={this.sonifyColumn}
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
                            Total Periodic Duration: {Number(totalPeriodicDuration).toFixed(2)}s
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
                            Periodic Duration per Column: {Number(this.state.colPeriod).toFixed(2)}ms
                        </Tooltip>
                    </Overlay>
                    <span style={{
                        marginTop: '10px',
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        PERIODICITY
                        <br/>
                        {periodicity}
                    </span>
                    <Slider
                        style={{width:'100%',paddingTop:'25px'}}
                        sliderStyle={{marginBottom:'24px'}}
                        ref={(slider) => this.slider = slider}
                        min={1}
                        max={25}
                        defaultValue={13}
                        step={0.01}
                        value={this.state.colPeriod}
                        onChange={this.changeColPeriod}
                        onDragStart={() => this.setState({showPeriodInfo:true})}
                        onDragStop={() => this.setState({showPeriodInfo:false})}
                    />
                </div>
                <LiveVisualizer/>
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
