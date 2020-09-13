import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input } from 'formsy-react-components';
import Loader from '../Loader';
import FormsyImageUploader from '../FormsyImageUploader';
import { isLoggedIn } from '../../lib/middleware';
import LoaderButton from '../LoaderButton';
import { history } from '../../lib/helpers';
import { connect } from 'react-redux';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';

/**
 * Edición del usuario actual.
 *
 * @param currentUser  The current user
 */
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSaving: false,
      isPristine: true,
    };
    this.submit = this.submit.bind(this);
    this.setImage = this.setImage.bind(this);
    this.togglePristine = this.togglePristine.bind(this);
  }

  componentDidMount() {
    isLoggedIn(this.props.currentUser)
      .then(() => this.setState({ isLoading: false }))
      .catch(err => {
        if (err === 'noBalance') {
          history.goBack();
        } else {
          this.setState({ isLoading: false });
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isSaving && this.props.currentUser.isRegistered) {
      this.setState({
        isSaving: false
      });
    }
  }

  setImage(image) {
    const { currentUser } = this.props;
    currentUser.newAvatar = image;
    this.setState({ isPristine: false });
  }

  togglePristine(currentValues, isChanged) {
    this.setState({ isPristine: !isChanged });
  }

  submit() {
    this.setState({ isSaving: true, });
    this.props.registerCurrentUser(this.props.currentUser);
  }

  render() {

    const { isLoading, isSaving, isPristine } = this.state;
    const { currentUser } = this.props;

    return (
      <div id="edit-cause-view" className="container-fluid page-layout">
        <div className="row">
          <div className="col-md-8 m-auto">
            {isLoading && <Loader className="fixed" />}

            {!isLoading && (
              <div>
                {currentUser.email && <h3>Edit your profile</h3>}
                {!currentUser.email && <h3>Create a profile to get started</h3>}
                <p>
                  <i className="fa fa-question-circle" />
                  Trust is important to run successful Funds or Campaigns. Without trust you will
                  likely not receive donations. Therefore, we strongly recommend that you{' '}
                  <strong>fill out your profile </strong>
                  when you want to start Funds or Campaigns on the B4H dapp.
                </p>
                <div className="alert alert-warning">
                  <i className="fa fa-exclamation-triangle" />
                  Please note that all the information entered will be stored on a publicly
                  accessible permanent storage like blockchain. We are not able to erase or alter
                  any of the information.{' '}
                  <strong>
                    Do not input anything that you do not have permision to share or you are not
                    comfortable with being forever accessible.
                  </strong>{' '}
                  For more information please see our{' '}
                  <Link to="/termsandconditions">Terms and Conditions</Link> and{' '}
                  <Link to="/privacypolicy">Privacy Policy</Link>.
                </div>

                <Form
                  onSubmit={this.submit}
                  mapping={inputs => {
                    currentUser.name = inputs.name;
                    currentUser.email = inputs.email;
                    currentUser.url = inputs.url;
                  }}
                  onChange={this.togglePristine}
                  layout="vertical"
                >
                  <div className="form-group">
                    <Input
                      name="name"
                      autoComplete="name"
                      id="name-input"
                      label="Your name"
                      type="text"
                      value={currentUser.name}
                      placeholder="John Doe."
                      validations="minLength:3"
                      validationErrors={{
                        minLength: 'Please enter your name',
                      }}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <Input
                      name="email"
                      autoComplete="email"
                      label="Email"
                      value={currentUser.email}
                      placeholder="email@example.com"
                      validations="isEmail"
                      help="Please enter your email address."
                      validationErrors={{
                        isEmail: "Oops, that's not a valid email address.",
                      }}
                    />
                  </div>

                  <FormsyImageUploader
                    setImage={this.setImage}
                    avatar={currentUser.avatar || currentUser._newAvatar}
                    aspectRatio={1}
                  />

                  <div className="form-group">
                    <Input
                      name="url"
                      label="Your Profile"
                      type="text"
                      value={currentUser.url}
                      placeholder="Your profile url"
                      help="Provide a link to some more info about you, this will help to build trust. You could add your linkedin profile, Twitter account or a relevant website."
                      validations="isUrl"
                      validationErrors={{
                        isUrl: 'Please enter a valid url',
                      }}
                    />
                  </div>

                  <LoaderButton
                    className="btn btn-success"
                    formNoValidate
                    type="submit"
                    disabled={isSaving || isPristine || (currentUser && currentUser.giverId === 0)}
                    isLoading={isSaving}
                    loadingText="Saving..."
                  >
                    Save profile
                  </LoaderButton>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser }

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);