
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Status from '../models/Status';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

/**
 * Presenta un estado
 */
class StatusIndicator extends Component {

    render() {
        let status = this.props.status;
        return (
            <p>
                {status.isLocal && <FontAwesomeIcon icon={faCircleNotch} spin/>}
                {status.name}
            </p>
        );
    }
}

StatusIndicator.propTypes = {
    status: PropTypes.instanceOf(Status).isRequired,
};

StatusIndicator.defaultProps = {

};

export default StatusIndicator;