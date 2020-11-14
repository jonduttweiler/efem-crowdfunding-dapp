import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { selectLastCreated, deleteTransaction } from '../redux/reducers/transactionsSlice';
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

    if (transaction) {

      const prevTransaction = prevProps.transaction;
      const isDifferentTransaction = !prevTransaction || prevTransaction.clientId !== transaction.clientId;
      let modals = { ...this.state.modals };

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
      <React.Fragment>

        <TransactionSummaryModal
          closeModal={this.closeTransactionSummaryModal}
          isOpen={modals.data.transactionSummaryOpen}
          transaction={transaction}>
        </TransactionSummaryModal>

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    transaction: selectLastCreated(state)
  }
}

const mapDispatchToProps = { deleteTransaction }

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(TransactionViewer)
)