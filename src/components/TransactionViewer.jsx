import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Transaction from '../models/Transaction';
import { connect } from 'react-redux'
import { selectFirst, deleteTransaction } from '../redux/reducers/transactionsSlice';
import TransactionSummaryModal from '../lib/blockchain/components/TransactionSummaryModal';

/**
 * Componente encargado de la visualización de transacciones.
 */
class TransactionViewer extends Component {

  constructor() {
    super();
    this.state = {
      modals: {
        data: {
          transactionSummaryOpen: false
        },
        methods: {
          closeTransactionSummaryModal: false
        }
      }
    };
  }

  componentDidUpdate(prevProps) {
    const { transaction } = this.props;
    const prevTransaction = prevProps.transaction;
    const isDifferentTransaction = !prevTransaction || prevTransaction.clientId !== transaction.clientId;
    let modals = { ...this.state.modals };

    if (transaction) {

      if (modals.data.transactionSummaryOpen === false) {

        // El transaction summary modal está cerrado

        if (transaction.isCreated && isDifferentTransaction) {
          modals.data.transactionSummaryOpen = true;
          this.setState({ modals });
        }

      } else {

        // El transaction summary modal está abierto        

        if (!transaction.isCreated) {
          modals.data.transactionSummaryOpen = false;
          this.setState({ modals });
        }
      }
    }
  }

  closeTransactionSummaryModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }
    let modals = { ...this.state.modals };
    modals.data.transactionSummaryOpen = false;
    this.setState({ modals });
  };

  render() {
    const { transaction } = this.props;
    let modals = { ...this.state.modals };
    return (
      <TransactionSummaryModal
        closeModal={this.closeTransactionSummaryModal}
        isOpen={modals.data.transactionSummaryOpen}
        transaction={transaction}>
      </TransactionSummaryModal>
    );
  }
}

TransactionViewer.propTypes = {
  transaction: PropTypes.instanceOf(Transaction)
};

const mapStateToProps = (state, ownProps) => {
  return {
    transaction: selectFirst(state)
  }
}

const mapDispatchToProps = { deleteTransaction }

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(TransactionViewer)
)