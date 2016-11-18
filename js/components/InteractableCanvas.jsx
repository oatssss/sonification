import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import ImgCanvas from './ImgCanvas.jsx';

const jssClasses = {};

@injectSheet(jssClasses)
export default class InteractableCanvas extends ImgCanvas {
    constructor(props) {
        super(props);
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            super.render()
        );
    }
}

InteractableCanvas.propTypes = Object.assign(ImgCanvas.propTypes, {

});
