import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ItemListItem from './ItemListItem';
import Container from '@material-ui/core/Container';
import { withTranslation } from 'react-i18next';
import Item from '../models/Item';

class ItemList extends Component {

  constructor() {
    super();
  }

  render() {
    const { items, classes, t } = this.props;
    return (
      <Container fixed>
        <List className={classes.root}>
          {items.map(item => (
            <ItemListItem key={item.clientId} item={item}></ItemListItem>
          ))}
        </List>
      </Container>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.instanceOf(Item)).isRequired
};

const styles = {
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline'
  }
};

export default withStyles(styles)(
  withTranslation()(ItemList)
);
