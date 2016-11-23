import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import ImgCanvas from './ImgCanvas.jsx';

const jssClasses = {};

@injectSheet(jssClasses)
export default class InteractableCanvas extends ImgCanvas {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(`Interactable Canvas Mounted! Stage: ${this.imgcanvas.stage}`);
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <ImgCanvas hocRef={(imgcanvas) => this.imgcanvas = imgcanvas} {...this.props}/>
        );
    }
}


InteractableCanvas.propTypes = {
    ...ImgCanvas.propTypes,
    sonifyColumn: PropTypes.func,
};
