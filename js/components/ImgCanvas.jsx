import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import { DefaultSize } from './tabs/InverseDFT.jsx';
import Konva from 'konva';

const jssClasses = {
    kanvas: {
        marginTop: '10px',
        marginBottom: '10px',
        outline: 'black solid thin',
    },
};

@injectSheet(jssClasses)
export default class ImgCanvas extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // For some reason, componentDidMount is getting called twice
        // and the second time, the size is undefined, wtf
        if (!this.props.size) {
            return;
        }

        // Initialize the Kanva canvas
        this.stage = new Konva.Stage({
            container: this.props.canvasID,
            width: this.props.size,
            height: this.props.size,
        });
    }

    componentWillUnmount() {
        // Stop audio
    }

    componentWillUpdate(nextProps, nextState) {
        // Update canvas size
        if (nextProps.size) {
            this.stage = new Konva.Stage({
                container: this.props.canvasID,
                width: nextProps.size,
                height: nextProps.size,
            });
        }

        // New image and layer to add to the stage
        if (nextProps.imgSrc) {
            const layer = new Konva.Layer();
            const imageObj = new Image();
            imageObj.onload = () => {

                let img = new Konva.Image({
                    image: imageObj,
                    width: nextProps.size,
                    height: nextProps.size,
                });

                layer.add(img);
                this.stage.add(layer);
            };
            imageObj.src = nextProps.imgSrc;
        }
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div id={this.props.canvasID} className={classes.kanvas}/>
        );
    }
}

ImgCanvas.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
    size: PropTypes.number,
    imgSrc: PropTypes.string,
    canvasID: PropTypes.string,
};
