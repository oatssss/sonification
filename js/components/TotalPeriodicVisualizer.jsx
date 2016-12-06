import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import { wholeWave } from '../utitlities/audio-functions.js';
import { DefaultCanvasSize } from './tabs/InverseDFT.jsx';

const jssClasses = {
    outlined: {
        outline: 'black solid thin',
    },
    horizontalScrolling: {
        overflowX: 'scroll',
    },
};

@injectSheet(jssClasses)
export default class TotalPeriodicVisualizer extends Component {
    static propTypes = {
        sheet: PropTypes.object,
        children: PropTypes.node,
        style: PropTypes.object,
        size: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this._drawTotalPeriodicWaveform = this._drawTotalPeriodicWaveform.bind(this);

        this.state = {
            canvasWidth: Math.pow(props.size, 2),
            canvasHeight: 64,
        };
    }

    _drawTotalPeriodicWaveform() {
        // Clear canvas
        this.canvasContext.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        // Draw the data as a time-vs-amplitude graph
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'rgb(0, 0, 0)';
        this.canvasContext.beginPath();

        for (let col = 0; col < this.props.size; col++) {
            for (let i = 0; i < this.props.size; i++) {

                let amplitude = wholeWave[col*this.props.size + i]/128 + 1;
                let y = amplitude * this.state.canvasHeight / 2;

                if (i === 0 && col === 0) {
                    this.canvasContext.moveTo(col*this.props.size + i, y);
                } else {
                    this.canvasContext.lineTo(col*this.props.size + i, y);
                }
            }
        }

        this.canvasContext.stroke();
    }

    componentDidMount() {
        this.canvasContext = this.canvas.getContext('2d');
        this._drawTotalPeriodicWaveform();
    }

    componentDidUpdate(prevProps, prevState) {
        this._drawTotalPeriodicWaveform();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            canvasWidth: Math.pow(nextProps.size, 2),
        });
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={`${classes.outlined} ${classes.horizontalScrolling}`} style={{...this.props.style,width:DefaultCanvasSize}}>
                All Columns
                <br/>
                <canvas
                    ref={(canvas) => this.canvas = canvas}
                    width={this.state.canvasWidth}
                    height={this.state.canvasHeight}
                />
            </div>
        );
    }
}
