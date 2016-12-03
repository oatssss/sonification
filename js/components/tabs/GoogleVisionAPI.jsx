import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import ResponsiveCanvas from '../ImgCanvas.jsx';
import hocRef from '../../utitlities/HOCRefDecorator.jsx';

const jssClasses = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginBottom: '10px',
    },
};

export const DefaultSize = 512;

@injectSheet(jssClasses)
@hocRef
export default class GoogleVisionAPI extends Component {
    constructor(props) {
        super(props);

        this.sonify = this.sonify.bind(this);
    }

    sonify() {
        console.log('Sonify GVAPI');
    }
    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div className={classes.container}>
                <ResponsiveCanvas
                    imgSrc={this.props.imgSrc}
                    canvasSize={DefaultSize}
                    imgSize={DefaultSize}
                    canvasID='kanvas-gvapi'
                />
                <br/>
                Google Vision API Description
            </div>
        );
    }
}

GoogleVisionAPI.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
    imgSrc: PropTypes.string,
};
