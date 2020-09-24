
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Status from '../models/Status';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

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
            <Chip size="small"
                variant="outlined"
                label={status.name}
                color="primary"
                icon={status.isLocal && (<CircularProgress size={10} />)}
            />
        );
    }
}

StatusIndicator.propTypes = {
    status: PropTypes.instanceOf(Status).isRequired,
};

StatusIndicator.defaultProps = {

};

export default StatusIndicator;