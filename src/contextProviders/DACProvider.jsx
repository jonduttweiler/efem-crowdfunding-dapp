import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { fetchDacs, selectDACs } from '../redux/reducers/dacsSlice';

const Context = createContext();
const { Provider, Consumer } = Context;
export { Consumer };

/**
 * Delegations provider listing given user's delegations and actions on top of them
 *
 * @prop children    Child REACT components
 */
class DACProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dacs: this.props.dacs, //Con redux el dacs ni siquiera es parte del estado
      isLoading: true,
      hasError: false,
      total: 0,
    };

    this.loadMore = this.loadMore.bind(this);
  }
  

  componentDidMount() {
    this.props.fetchDacs();
    //this.loadMore(true);
  }

  loadMore(init = false) {
    if (init || (!this.state.isLoading && this.state.total > this.state.dacs.length)) {
  /*     this.setState({ isLoading: true }, () =>
        DACService.getDACs(
          this.props.step, // Limit
          this.state.dacs.length, // Skip
          (dacs, total) => {
            this.setState(prevState => ({
              dacs: prevState.dacs.concat(dacs),
              total,
              isLoading: false,
            }));
          },
          () => this.setState({ hasError: true, isLoading: false }),
        ),
      ); */
    }
  }

  render() {
    const { dacs } = this.props; // using redux
    const isLoading = false; //TODO: get from redux
    const hasError = false; //TODO: get from redux
    //const { isLoading, hasError, /*total*/ } = this.state;
    const { loadMore } = this;

    return (
      <Provider
        value={{
          state: {
            dacs,
            isLoading,
            hasError,
            total: dacs.length, //TODO: allow pagination
            canLoadMore: false,//TODO: allow pagination
          },
          actions: {
            loadMore,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

DACProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  step: PropTypes.number,
};

DACProvider.defaultProps = { step: 50 };

const mapStateToProps = (state, ownProps) => {
  return {
    dacs: selectDACs(state)
  }
}
const mapDispatchToProps = { fetchDacs }

export default connect(mapStateToProps, mapDispatchToProps)(DACProvider);
