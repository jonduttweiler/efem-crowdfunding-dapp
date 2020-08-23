import React, { Component } from 'react';
import moment from 'moment';

/**
 * Presenta una fecha en formato DD/MM/YYYY hh:mm.
 * 
 */
class DateTimeViewer extends Component {

    constructor(props) {
        super(props);
        this.format = "DD/MM/YYYY hh:mm";
    }

    render() {
        let dateTime = this.props.value;
        return (
            <span>{!dateTime ? '(Sin fecha)' : moment.unix(dateTime).format(this.format)}</span>
        );
    }
}

DateTimeViewer.propTypes = {
};

DateTimeViewer.defaultProps = {
};

export default DateTimeViewer;