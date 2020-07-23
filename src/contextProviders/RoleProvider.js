import React, { Component } from "react";
import { GIVER, CREATE_DAC_ROLE, CREATE_CAMPAIGN_ROLE, CREATE_MILESTONE_ROLE } from "../constants/Role";
import PropTypes from 'prop-types';
import User from "../models/User";

const { Provider, Consumer } = React.createContext();
export { Consumer };

export default class RoleProvider extends Component {
    //we'll get a user as prop. Vamos a agarrar ese usuario y se lo vaamos a pasar al user service para obtener los roles activos

    constructor(props) {
        super(props);
        this.state = {
            roles: [GIVER]
        }
    }
    
    componentDidMount(){
        this.setState({roles:[GIVER,CREATE_CAMPAIGN_ROLE,CREATE_MILESTONE_ROLE]});
    }

    render(){
        return(
            <Provider value={this.state.roles}>
                {this.props.children}
            </Provider>
        );
    }
}

/* 
RoleProvider.PropTypes = {
    currentUser: PropTypes.instanceOf(User).isRequired
}

JoinGivethCommunity.defaultProps = {
    currentUser: new User(), //?
  };
   */