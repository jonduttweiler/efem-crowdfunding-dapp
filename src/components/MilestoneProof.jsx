import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import ItemRow from './ItemRow';
import AddItemButton from './AddItemButton';
import FormDialog from './AddItemModalNew';
import AddItemModal from './AddItemModal';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

BigNumber.config({ DECIMAL_PLACES: 18 });

class MilestoneProof extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      addItemModalVisible: false,
    };
  }

  componentDidMount() {
    this.setState({
      items: this.props.items
    });
  }

  onAddItem(item) {
    this.addItem(item);
    this.setState({ addItemModalVisible: false });
  }

  addItem(item) {
    this.setState(
      prevState => ({
        items: prevState.items.concat(item)
      }),
      () => this.props.onItemsChanged(this.state.items),
    );
  }

  removeItem(index) {
    const { items } = this.state;
    delete items[index];
    this.setState({
      items: items.filter(() => true)
    },
      () => this.props.onItemsChanged(this.state.items),
    );
  }

  toggleAddItemModal() {
    this.setState(prevState => ({
      addItemModalVisible: !prevState.addItemModalVisible,
    }));
  }

  render() {
    const { items, addItemModalVisible } = this.state;
    const { isEditMode, classes, t } = this.props;
    //const canEdit = isEditMode || ['Proposed', 'Pending'].includes(milestoneStatus);
    const canEdit = isEditMode;
    return (
      <div>
        <div className="form-group row dashboard-table-view">
          <div className="col-12">
            <div className="card milestone-items-card">
              <div className="card-body">
                {items.length > 0 && (
                  <div className="table-container">
                    <table className="table table-responsive table-striped table-hover">
                      <thead>
                        <tr>
                          <th className="td-item-date">Date</th>
                          <th className="td-item-description">Description</th>
                          <th className="td-item-amount-fiat">Amount Fiat</th>
                          <th className="td-item-fiat-amount">Amount</th>
                          <th className="td-item-file-upload">Attached proof</th>
                          {canEdit && <th className="td-item-action" />}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => (
                          <ItemRow
                            key={item.id}
                            name={`milestoneItem-${i}`}
                            index={i}
                            item={item}
                            removeItem={() => this.removeItem(i)}
                            isEditMode={canEdit}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {items.length > 0 && canEdit && (
                  <Fab color="primary" aria-label="add" className={classes.fab}>
                    <AddIcon />
                  </Fab>
                )}

                {items.length === 0 && canEdit && (
                  <div>
                    <Typography variant="body1" gutterBottom>
                      {t('milestoneProofDescription')}
                    </Typography>
                    <Fab color="primary"
                      aria-label="add"
                      className={classes.fab}
                      onClick={() => this.toggleAddItemModal()}>
                      <AddIcon />
                    </Fab>
                    <FormDialog></FormDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AddItemModal
          openModal={addItemModalVisible}
          onClose={() => this.toggleAddItemModal()}
          onAddItem={item => this.onAddItem(item)}
        />


      </div>
    );
  }
}


const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
});

MilestoneProof.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemsChanged: PropTypes.func,
  isEditMode: PropTypes.bool.isRequired
};

MilestoneProof.defaultProps = {
  onItemsChanged: () => { }
};

export default withStyles(styles)(
  withTranslation()(MilestoneProof)
);
