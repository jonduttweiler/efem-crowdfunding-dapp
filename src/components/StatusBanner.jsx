
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Status from '../models/Status';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { green, red } from '@material-ui/core/colors';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

/**
 * Presenta un estado
 */
class StatusBanner extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { status, classes, t } = this.props;
        let iconSize = 10;
        let icon = (<CheckCircleOutlineIcon size={iconSize} />);
        if (status.isLocal) {
            icon = (<CircularProgress size={iconSize} color="secondary"/>);
        }
        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {icon}
                        </Avatar>
                    }
                    title={status.name}
                    subheader={t('status')}
                />
            </Card>
        );
    }
}

StatusBanner.propTypes = {
    status: PropTypes.instanceOf(Status).isRequired,
};

StatusBanner.defaultProps = {

};

const styles = theme => ({
    /*root: {
        padding: '1em',
        
    },*/
    inline: {
        display: 'inline',
    },
    logo: {
        /*width: theme.spacing(6),
        height: theme.spacing(6),*/
    },
    green: {
        color: green[500],
        /*backgroundColor: white[500],*/
    },
    root: {
        /*maxWidth: 345,*/
        backgroundColor: 'rgb(182, 188, 226)',
        margin: '0.75em'
    },
    avatar: {
        backgroundColor: '#3f51b5',
    }
});

export default withStyles(styles)(
    withTranslation()(StatusBanner)
);