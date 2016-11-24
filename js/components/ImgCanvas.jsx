import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import Konva from 'konva';
import hocRef from '../useful/HOCRefDecorator.jsx';

const jssClasses = {
    kanvas: {
        marginTop: '10px',
        marginBottom: '10px',
        outline: 'black solid thin',
    },
};

@injectSheet(jssClasses)
@hocRef
export default class ImgCanvas extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // For some reason, componentDidMount is getting called twice
        // and the second time, the size is undefined, wtf
        const { canvasSize } = this.props;
        if (!canvasSize) {
            return;
        }

        // Initialize the Kanva canvas
        this.stage = new Konva.Stage({
            container: this.props.canvasID,
            width: canvasSize,
            height: canvasSize,
        });
    }

    componentWillUnmount() {
        // Stop audio
    }

    componentWillUpdate(nextProps, nextState) {
        const {
            canvasSize,
            imgSize,
            imgSrc,
            onImgLoad,
        } = nextProps;

        if (this.stage && canvasSize) {
            this.stage.width(canvasSize);
            this.stage.height(canvasSize);
        }

        if (this.stage && imgSrc && canvasSize && imgSize) {
            const imageObj = new Image();
            imageObj.onload = () => {
                const img = new Konva.Image({
                    image: imageObj,
                    width: imgSize,
                    height: imgSize,
                });

                const layer = new Konva.Layer();
                layer.add(img);

                if (canvasSize !== imgSize) {
                    const scaledImageObj = new Image();
                    scaledImageObj.onload = () => {

                        const scaledImg = new Konva.Image({
                            image: scaledImageObj,
                            width: canvasSize,
                            height: canvasSize,
                        });

                        const scaledLayer = new Konva.Layer();
                        scaledLayer.add(scaledImg);
                        this.stage.add(scaledLayer);
                        if (onImgLoad) {
                            const imgData = scaledImg.getCanvas().getContext().getImageData(0, 0, canvasSize, canvasSize);
                            onImgLoad(imgData);
                        }
                    };
                    scaledImageObj.src = img.toDataURL();
                }
                else {
                    this.stage.add(layer);
                    if (onImgLoad) {
                        const imgData = img.getCanvas().getContext().getImageData(0, 0, canvasSize, canvasSize);
                        onImgLoad(imgData);
                    }
                }
            };
            imageObj.src = imgSrc;
        }
    }

    render() {
        const { sheet: {classes}, children } = this.props;
        let { className } = this.props;

        className = classes.kanvas + ' ' + (className ? className : '');

        return (
            <div id={this.props.canvasID} className={className}/>
        );
    }
}

ImgCanvas.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
    canvasSize: PropTypes.number.isRequired,
    imgSize: PropTypes.number.isRequired,
    imgSrc: PropTypes.string.isRequired,
    canvasID: PropTypes.string.isRequired,
    onImgLoad: PropTypes.func,
    className: PropTypes.string,
};
