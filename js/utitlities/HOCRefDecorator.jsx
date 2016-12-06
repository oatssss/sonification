import React, {Component, PropTypes} from 'react';

export default function(DecoratedComponent) {
    class HOCRefDecorated extends Component {
        componentDidMount() {
            if (this.props.hocRef) {
                this.props.hocRef(this.wrapped);
            }
        }

        render() {
            return <DecoratedComponent ref={(wrapped) => this.wrapped = wrapped} {...this.props}/>
        }
    }

    HOCRefDecorated.propTypes = {
        hocRef: PropTypes.func,
    };

    return HOCRefDecorated;
}
