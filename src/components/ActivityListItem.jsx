import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Activity from '../models/Activity';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { getUser } from '../services/UserService';
import User from '../models/User';
import ActivityActionChip from './ActivityActionChip';
import DateTimeViewer from './DateTimeViewer';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ItemList from './ItemList';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import { withTranslation } from 'react-i18next';

class ActivityListItem extends Component {

  constructor() {
    super();
    this.state = {
      activities: {},
      isLoading: false,
      user: new User(),
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.props.activity.userAddress) {
      this.loadUser();
    }
  }

  async loadUser() {
    const user = await getUser(this.props.activity.userAddress);
    if (user) {
      this.setState({ user });
    }
  }

  handleClick() {
    let open = this.props.activity.hasItems && !this.state.open;
    this.setState({
      open: open
    });
  };

  render() {
    const { user, open } = this.state;
    const { activity, classes, t } = this.props;
    return (
      <React.Fragment>
        <ListItem alignItems="flex-start" onClick={this.handleClick}>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={user.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={
              <React.Fragment>
                <Typography variant="body1" gutterBottom>
                  {activity.message}
                </Typography>
                <ActivityActionChip activity={activity}></ActivityActionChip>
                <DateTimeViewer value={activity.createdAt} />
              </React.Fragment>
            }
          />
          {activity.hasItems && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Container className={classes.items} fixed>
            <Typography variant="overline">
              {t('attachements')}
            </Typography>
            <ItemList items={activity.items}></ItemList>
          </Container>
        </Collapse>
        <Divider />
      </React.Fragment>
    );
  }
}

ActivityListItem.propTypes = {
  activity: PropTypes.instanceOf(Activity).isRequired
};

const styles = theme => ({
  root: {
    width: '100%',
    //maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  items: {
    paddingLeft: '4em'
  },
  inline: {
    display: 'inline',
  }
});

export default withStyles(styles)(
  withTranslation()(ActivityListItem)
);
