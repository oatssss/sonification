import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';
import ImgCanvas from '../ImgCanvas.jsx';

const jssClasses = {};

@injectSheet(jssClasses)
export default class GoogleVisionAPI extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <div>
                <ImgCanvas/>
                <br/>
                Google Vision API Description
            </div>
        );
    }
}

GoogleVisionAPI.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node
};
