import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../redux/reducers/usersSlice'

class ProfileCard extends Component {  //va a recibir como prop un address
    componentDidMount() {
        if (this.props.address) {
            this.props.fetchUserByAddress(this.props.address);
        }
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        if (this.props.address === nextProps.address) {
            return false;
        }
        return true;
    }*/

    componentDidUpdate(prevProps, prevState) {
        if (this.props.address !== prevProps.address) {
            this.props.fetchUserByAddress(this.props.address);
        }
    }

    render() {
        const { user, namePosition } = this.props;
        const descriptionClass = namePosition === "left" || namePosition === "right" ? "" : "small";
        if (!user) {
            // TODO Implementar un Skeletor (https://material-ui.com/components/skeleton/) cuando no esté en Labs.
            return (<div></div>)
        }
        return (
            <div>
                <Link className={`profile-card ${namePosition}`} to={`/profile/${user.address}`}>
                    <Avatar size={50} src={user.avatar} round />
                    <p className={`description ${descriptionClass}`}>{user.name}</p>
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

const mapStateToProps = (state, props) => {
    return {
        user: selectUserByAddress(state, props.address)
    }
}

const mapDispatchToProps = { fetchUserByAddress }

export default connect(mapStateToProps, mapDispatchToProps)(
    withTranslation()(ProfileCard)
);