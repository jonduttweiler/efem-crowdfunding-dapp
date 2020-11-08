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
          transactionSummary: false
        },
        methods: {
          closeTransactionSummaryModal: false
        }
      }
    };
  }

  render() {
    const { transaction, t } = this.props;
    let openSummary = false;
    if (transaction && transaction.isPending) {
      openSummary = true;
    }
    return (
      <TransactionSummaryModal
        closeModal={this.state.modals.methods.closeTransactionSummaryModal}
        isOpen={openSummary}
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