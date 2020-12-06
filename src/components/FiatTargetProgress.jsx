import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import FiatUtils from '../utils/FiatUtils'

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
        spacing={0}
        direction="row"
        justify="space-around"
        alignItems="center">
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="span">
            {progressText}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LinearProgress
            variant="determinate"
            value={progress} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2"
              color="textSecondary"
              component="span">
            {t('targetProgress', {
              fiatBalance: FiatUtils.format(fiatBalance),
              fiatTarget: FiatUtils.format(fiatTarget)
            })}
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