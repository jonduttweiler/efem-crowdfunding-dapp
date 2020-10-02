import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js';
import FiatAmount from './FiatAmount'
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

class FiatTargetProgress extends Component {

  constructor() {
    super();
  }

  render() {
    const { fiatBalance, fiatTarget, classes, t } = this.props;

    // El balance tiene ub objetivo para mostrar.
    let progress, progressText;
    // Cálculo del porcentaje de avance.
    if (fiatBalance.lt(fiatTarget)) {
      progress = fiatBalance.div(fiatTarget).multipliedBy(100).toFixed(2);
    } else {
      // El objetivo fue alcanzado.
      progress = 100.00;
    }
    progressText = `${progress}%`

    return (
      <Grid container
        spacing={2}
        direction="row"
        justify="space-around"
        alignItems="center">
        <Grid item xs>
          <LinearProgress
            variant="determinate"
            value={progress} />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            {progressText}
          </Typography>
          <FiatAmount amount={fiatTarget}></FiatAmount>
          <Typography variant="body2" color="textSecondary">
            {t('target')}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

FiatTargetProgress.propTypes = {

};

FiatTargetProgress.defaultProps = {
  fiatBalance: PropTypes.instanceOf(BigNumber).isRequired,
  fiatTarget: PropTypes.instanceOf(BigNumber).isRequired
};

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(FiatTargetProgress)
  )
);