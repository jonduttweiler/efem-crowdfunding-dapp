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
    this.state = {
      value: null
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevProps.campaignIds) !== JSON.stringify(this.props.campaignIds)) {
      this.setState({
        value: null
      });
    }
  }

  onChange(value) {
    this.setState({
      value: value
    });
    this.props.onChange(value);
  }

  render() {
    const { value } = this.state;
    const { campaigns, classes, t } = this.props;
    return (
      <Autocomplete
        id="select-campaign"
        className={classes.root}
        options={campaigns}
        getOptionLabel={(option) => option.title}
        value={value}
        onChange={(event, newValue) => {
          this.onChange(newValue);
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