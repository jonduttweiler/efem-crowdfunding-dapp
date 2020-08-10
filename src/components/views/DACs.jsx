import React, { Component } from 'react';
import DACCard from '../DacCard';
import Loader from '../Loader';
import { connect } from 'react-redux'
import { selectDACs } from '../../redux/reducers/dacsSlice'

/**
 * The DACs view mapped to /dacs
 */
class DACs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    const { dacs } = this.props;
    const { isLoading, hasError } = this.state;
    // TODO Por incorporación de Redux, se fija el total
    // como el tamaño de los milestones.
    // Falta el desarrollo del Paginado.
    var total = dacs.length;
    return (
      <div id="campaigns-view" className="card-view">
        <div className="container-fluid page-layout reduced-padding">
          <h4>
            Decentralized Funds{' '}
            {total > 0 && <span className="badge badge-success">{total}</span>}
          </h4>
          {!hasError && isLoading && <Loader />}
          {// There are some DACs in the system, show them
          !hasError && !isLoading && dacs.length > 0 && (
            <div>
              <p>
                These Funds are solving causes. Help them realise their goals by giving Bitcoin or
                tokens!
              </p>
              <div className="cards-grid-container">
                {dacs.map(dac => (
                  <DACCard key={dac.clientId || dac.id} dac={dac} />
                ))}
              </div>
            </div>
          )}

          {// There are no DACs, show empty state
          !hasError && !isLoading && dacs.length === 0 && (
            <div>
              <center>
                <p>There are no Decentralized Funds yet!</p>
                <img
                  className="empty-state-img"
                  src={`${process.env.PUBLIC_URL}/img/community.svg`}
                  width="200px"
                  height="200px"
                  alt="no-campaigns-icon"
                />
              </center>
            </div>
          )}
          {hasError && (
            <p>
              <strong>Oops, something went wrong...</strong> The B4H dapp could not load any Funds
              for some reason. Please try refreshing the page...
            </p>
          )}
        </div>
      </div>
    );
  }
}


DACs.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  return {
    dacs: selectDACs(state)
  }
}

export default connect(mapStateToProps)(DACs)
