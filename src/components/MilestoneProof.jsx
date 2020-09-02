import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import ItemRow from './ItemRow';
import AddItemButton from './AddItemButton';
import AddItemModal from './AddItemModal';

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
    const { isEditMode, milestoneStatus } = this.props;
    const canEdit = isEditMode || ['Proposed', 'Pending'].includes(milestoneStatus);
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
                  <AddItemButton onClick={() => this.toggleAddItemModal()} />
                )}

                {items.length === 0 && canEdit && (
                  <div className="text-center">
                    <p>Attach an expense, invoice or anything else that requires payment.</p>
                    <AddItemButton onClick={() => this.toggleAddItemModal()} />
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

MilestoneProof.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemsChanged: PropTypes.func,
  isEditMode: PropTypes.bool.isRequired,
  milestoneStatus: PropTypes.string,
};

MilestoneProof.defaultProps = {
  onItemsChanged: () => { },
  milestoneStatus: '',
};

export default MilestoneProof;
