import React, { Component, PropTypes } from 'react';
import injectSheet from 'react-jss';

const jssClasses = {
    centered: {
        display: 'flex',
        alignItems: 'center',
    }
};

@injectSheet(jssClasses)
export default class Centered extends Component {
    render() {
        const {sheet: {classes}, children, width, className} = this.props;

        let style = {};
        if (width) { style.width = width; }

        return (
            <div className={`${classes.centered} ${className}`}>
                <div style={style}>
                    {children}
                </div>
            </div>
        );
    }
}

Centered.propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.node,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    className: PropTypes.string,
};
