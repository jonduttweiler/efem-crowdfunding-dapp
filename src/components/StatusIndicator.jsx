
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Status from '../models/Status';

/**
 * Presenta un estado
 */
class StatusIndicator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let status = this.props.status;
        return (
            <span>
                {status.isLocal && (<i className="fa fa-circle-o-notch fa-spin" />)}
                {status.name}
            </span>
        );
    }
}

StatusIndicator.propTypes = {
    status: PropTypes.instanceOf(Status).isRequired,
};

StatusIndicator.defaultProps = {

};

export default StatusIndicator;