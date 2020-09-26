import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { selectCampaignsByIds } from '../redux/reducers/campaignsSlice';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class CampaignSelector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { campaigns, classes, t } = this.props;
    return (
      <Autocomplete
        id="select-campaign"
        className={classes.root}
        options={campaigns}
        getOptionLabel={(option) => option.title}
        style={{ width: 300 }}
        onChange={(event, newValue) => {
          this.props.onChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} label={t('campaign')} />}
        disabled={campaigns.length === 0}
      />
    );
  }
}

CampaignSelector.defaultProps = {
  campaignIds: []
};

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: selectCampaignsByIds(state, ownProps.campaignIds),
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(CampaignSelector)
  )
);