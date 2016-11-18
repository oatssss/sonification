import React, {Component, PropTypes} from 'react';
import injectSheet from 'react-jss';

const jssClasses = {};

@injectSheet(jssClasses)
export default class ImgCanvas extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        // Stop audio
    }

    render() {
        const {sheet: {classes}, children} = this.props;

        return (
            <span>Replace Me</span>
        );
    }
}

ImgCanvas.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node
};
