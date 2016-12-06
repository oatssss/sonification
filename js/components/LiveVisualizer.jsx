import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import { analyzer } from '../utitlities/audio-functions.js';
import { DefaultCanvasSize } from './tabs/InverseDFT.jsx';

const jssClasses = {
    outlined: {
        outline: 'black solid thin',
    },
};

@injectSheet(jssClasses)
export default class LiveVisualizer extends Component {
    static propTypes = {
        sheet: PropTypes.object,
        children: PropTypes.node
    };

    constructor(props) {
        super(props);

        this.animationLoop = this.animationLoop.bind(this);
        this._updateAnalyzerSettings = this._updateAnalyzerSettings.bind(this);

        this.state = {
            fftSize: 2048,
            canvasWidth: DefaultCanvasSize,
            canvasHeight: 64,
        };

        this._updateAnalyzerSettings();
    }

    _updateAnalyzerSettings() {
        analyzer.fftSize = this.state.fftSize;
    }

    animationLoop() {
        // Continue looping once called
        requestAnimationFrame(this.animationLoop);

        // Clear canvas
        this.canvasContext.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        // Get the time domain data
        let timeDomain = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteTimeDomainData(timeDomain);

        // Draw the data as a time-vs-amplitude graph
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'rgb(0, 0, 0)';
        this.canvasContext.beginPath();
        const sliceWidth = this.state.canvasWidth*1.0/analyzer.frequencyBinCount;
        let x = 0;
        for(let i = 0; i < analyzer.frequencyBinCount; i++) {

            let amplitude = timeDomain[i] / 128.0;
            let y = amplitude * this.state.canvasHeight/2;

            if(i === 0) {
                this.canvasContext.moveTo(x, y);
            } else {
                this.canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasContext.stroke();
    }

    componentDidUpdate(prevProps, prevState) {
        this._updateAnalyzerSettings();
    }

    componentDidMount() {
        this.canvasContext = this.canvas.getContext('2d');

        this.animationLoop();
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={classes.outlined}>
                Live
                <br/>
                <canvas ref={(canvas) => this.canvas = canvas} width={this.state.canvasWidth} height={this.state.canvasHeight}/>
            </div>
        );
    }
}
