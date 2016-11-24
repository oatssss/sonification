import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import ImgCanvas from './ImgCanvas.jsx';
import hocRef from '../useful/HOCRefDecorator.jsx';

const jssClasses = {};

@injectSheet(jssClasses)
@hocRef
export default class ResponsiveCanvas extends ImgCanvas {
    componentDidMount() {
        // Setup responsive width/height of canvas

    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <ImgCanvas {...this.props} hocRef={(canvas) => this.canvas = canvas}/>
        );
    }
}


ResponsiveCanvas.propTypes = {
    ...ImgCanvas.propTypes,
    sonifyPoint: PropTypes.func,
};
