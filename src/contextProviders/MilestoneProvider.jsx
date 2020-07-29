import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { fetchMilestones, selectMilestones } from '../redux/reducers/milestonesSlice'

const Context = createContext();
const { Provider, Consumer } = Context;
export { Consumer };

/**
 *
 * @prop children    Child REACT components
 */
class MilestoneProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      milestones: props.milestones,
      isLoading: false,
      hasError: false,
      total: 0,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.fetchMilestones();
  }
  
  componentWillMount() {
    this.loadMore(true);
  }

  loadMore(init = false) {
    if (init || (!this.state.isLoading && this.state.total > this.state.milestones.length)) {
      /*this.setState({ isLoading: true }, () =>
        MilestoneService.getActiveMilestones(
          this.props.step, // Limit
          this.state.milestones.length, // Skip
          (milestones, total) => {
            this.setState(prevState => ({
              milestones: prevState.milestones.concat(milestones),
              total,
              isLoading: false,
            }));
          },
          () => this.setState({ hasError: true, isLoading: false }),
        ),
      );*/
    }
  }

  render() {

    const { milestones } = this.props;
    const { isLoading, hasError } = this.state;
    const { loadMore } = this;
    // TODO Por incorporación de Redux, se fija el total
    // como el tamaño de los milestones.
    // Falta el desarrollo del Paginado.
    var total = milestones.length;

    return (
      <Provider
        value={{
          state: {
            milestones,
            isLoading,
            hasError,
            total,
            canLoadMore: total > milestones.length,
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

MilestoneProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  step: PropTypes.number,
};

MilestoneProvider.defaultProps = { step: 50 };

const mapStateToProps = (state, ownProps) => {
  return {
    milestones: selectMilestones(state)
  }
}

const mapDispatchToProps = { fetchMilestones }

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneProvider)

