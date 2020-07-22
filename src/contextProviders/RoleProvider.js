import React, { Component } from "react";
import { GIVER, CREATE_DAC_ROLE, CREATE_CAMPAIGN_ROLE } from "../constants/Role";

const { Provider, Consumer } = React.createContext();
export { Consumer };

export default class RoleProvider extends Component {

    constructor(props) { //we'll need a user as prop
        super(props);
        this.state = {
            roles: [GIVER]
        }
    }
    
    componentDidMount(){
        this.setState({roles:[GIVER,CREATE_DAC_ROLE,CREATE_CAMPAIGN_ROLE]});
    }

    render(){
        return(
            <Provider value={this.state.roles}>
                {this.props.children}
            </Provider>
        );
    }


}