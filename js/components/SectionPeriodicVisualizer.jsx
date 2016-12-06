import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import { joinedWave, joinedWaveWidth, joinedWaveHeight } from '../utitlities/audio-functions.js';
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
export default class SectionPeriodicVisualizer extends Component {
    static propTypes = {
        sheet: PropTypes.object,
        children: PropTypes.node,
    };

    constructor(props) {
        super(props);

        this._drawSectionPeriodicWaveform = this._drawSectionPeriodicWaveform.bind(this);

        this.state = {
            canvasWidth: joinedWaveWidth*joinedWaveHeight,
            canvasHeight: 64,
        };
    }

    _drawSectionPeriodicWaveform() {
        // Clear canvas
        this.canvasContext.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        // Draw the data as a time-vs-amplitude graph
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'rgb(0, 0, 0)';
        this.canvasContext.beginPath();

        for (let col = 0; col < joinedWaveWidth; col++) {
            for (let i = 0; i < joinedWaveHeight; i++) {

                let amplitude = joinedWave[col*joinedWaveWidth + i]/128 + 1;
                let y = amplitude * this.state.canvasHeight / 2;

                if (i === 0 && col === 0) {
                    this.canvasContext.moveTo(col*joinedWaveWidth + i, y);
                } else {
                    this.canvasContext.lineTo(col*joinedWaveWidth + i, y);
                }
            }
        }

        this.canvasContext.stroke();
    }

    componentDidMount() {
        this.canvasContext = this.canvas.getContext('2d');
        this._drawSectionPeriodicWaveform();
    }

    componentDidUpdate(prevProps, prevState) {
        this._drawSectionPeriodicWaveform();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            canvasWidth: joinedWaveWidth*joinedWaveHeight,
        });
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={`${classes.outlined} ${classes.horizontalScrolling}`} style={{width:DefaultCanvasSize}}>
                Highlighted Section
                <br/>
                <canvas
                    style={{margin:'0 auto', display:'block'}}
                    ref={(canvas) => this.canvas = canvas}
                    width={this.state.canvasWidth}
                    height={this.state.canvasHeight}
                />
            </div>
        );
    }
}
