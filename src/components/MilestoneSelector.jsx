import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { selectMilestonesByIds } from '../redux/reducers/milestonesSlice';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class MilestoneSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevProps.milestoneIds) !== JSON.stringify(this.props.milestoneIds)) {
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
    const { milestones, classes, t } = this.props;
    return (
      <Autocomplete
        id="select-milestone"
        className={classes.root}
        options={milestones}
        getOptionLabel={(option) => option.title}
        value={value}
        onChange={(event, newValue) => {
          this.onChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} label={t('milestone')} />}
        disabled={milestones.length === 0}
      />
    );
  }
}

MilestoneSelector.defaultProps = {
  milestoneIds: []
};

const styles = theme => ({
  root: {

  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    milestones: selectMilestonesByIds(state, ownProps.milestoneIds),
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(MilestoneSelector)
  )
);