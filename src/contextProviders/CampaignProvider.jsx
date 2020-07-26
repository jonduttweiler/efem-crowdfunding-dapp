import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { fetchCampaigns, selectCampaigns } from '../redux/reducers/campaignsSlice'

const Context = createContext();
const { Provider, Consumer } = Context;
export { Consumer };

/**
 * Delegations provider listing given user's delegations and actions on top of them
 *
 * @prop children    Child REACT components
 */
class CampaignProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: this.props.campaigns,
      //isLoading: true,
      isLoading: false,
      hasError: false,
      total: 0,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.fetchCampaigns();
    //this.loadMore(true);
  }

  loadMore(init = false) {
    if (init || (!this.state.isLoading && this.state.total > this.state.campaigns.length)) {
      /*this.setState({ isLoading: true }, () =>
        CampaignService.getCampaigns(
          this.props.step, // Limit
          this.state.campaigns.length, // Skip
          (campaigns, total) => {
            this.setState(prevState => ({
              campaigns: prevState.campaigns.concat(campaigns),
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

    const { campaigns } = this.props;
    const { isLoading, hasError } = this.state;
    // TODO Por incorporación de Redux, se fija el total
    // como el tamaño de las campañas.
    // Falta el desarrollo del Paginado.
    var total = campaigns.length;

    const { loadMore } = this;

    return (
      <Provider
        value={{
          state: {
            campaigns,
            isLoading,
            hasError,
            total,
            canLoadMore: total > campaigns.length,
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

CampaignProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  step: PropTypes.number,
};

CampaignProvider.defaultProps = { step: 50 };

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: selectCampaigns(state)
  }
}

const mapDispatchToProps = { fetchCampaigns }

export default connect(mapStateToProps, mapDispatchToProps)(CampaignProvider)
