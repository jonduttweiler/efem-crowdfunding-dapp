import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import User from '../models/User';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { loadCurrentUser, selectCurrentUser } from '../redux/reducers/currentUserSlice'

class ProfileCard extends Component {  //va a recibir como prop un address
    constructor(props) {
        super(props);
        this.state = {
            address: props.address,
            user: new User()
        }
    }

    componentDidMount() {
        this.props.loadCurrentUser();
        //if (this.props.address) this.loadUser();
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        if (this.state != nextState) return true;

        if (this.props.address === nextProps.address) {
            return false;
        }
        return true;
    }*/


    async componentDidUpdate(prevProps, prevState) {
        /*if (this.props.address !== prevProps.address) {
            this.loadUser();
        }*/
        //this.props.loadCurrentUser();
    }

    /*async loadUser() {
        const user = await getUser(this.props.address);
        if (user) this.setState({ user })
    }*/

    render() {
        const { currentUser } = this.props;
        //const user = this.state.user;

        const namePosition = this.props.namePosition;
        const descriptionClass = namePosition === "left" || namePosition === "right" ? "" : "small";

        return (
            <div>
                <Link className={`profile-card ${namePosition}`} to={`/profile/${currentUser.address}`}>
                    <Avatar size={50} src={currentUser.avatar} round />
                    <p className={`description ${descriptionClass}`}>{currentUser.name}</p>
                </Link>
            </div>
        );
    }
}

ProfileCard.propTypes = {
    address: PropTypes.string,
    namePosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

ProfileCard.defaultProps = {
    namePosition: 'bottom'
};

const mapStateToProps = (state, ownProps) => {
    return {
        currentUser: selectCurrentUser(state)
    }
}

const mapDispatchToProps = { loadCurrentUser }

export default connect(mapStateToProps, mapDispatchToProps)(
    withTranslation()(ProfileCard)
);