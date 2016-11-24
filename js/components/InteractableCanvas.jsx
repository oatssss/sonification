import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import ResponsiveCanvas from './ResponsiveCanvas.jsx';

const jssClasses = {};

@injectSheet(jssClasses)
export default class InteractableCanvas extends ResponsiveCanvas {
    componentDidMount() {
        // ResponsiveCanvas has an HOC wrapper,
        // so the actual canvas is a member within ResponsiveCanvas
        // under the name 'canvas'
        this.canvas = this.canvas.canvas;

        // Setup column/row border drawing around the cursor

    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <ResponsiveCanvas {...this.props} hocRef={(canvas) => this.canvas = canvas}/>
        );
    }
}


InteractableCanvas.propTypes = {
    ...ResponsiveCanvas.propTypes,
    sonifyPoint: PropTypes.func,
};
