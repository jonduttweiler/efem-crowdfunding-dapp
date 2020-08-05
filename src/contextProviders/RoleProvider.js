import React, { Component } from "react";
import PropTypes from 'prop-types';
import UserService from "../services/UserService";

import { setUser, selectRoles } from '../redux/reducers/userSlice';
import { connect } from 'react-redux';


const { Provider, Consumer } = React.createContext();
export { Consumer };



/**
 * This component receive an address as property,
 * and use usersSlice.setUser for get the roles a los cuales accede a través del selectRoles
 */
class RoleProvider extends Component {

    componentDidUpdate(prevProps){
        //TODO: Revisar la comparación de address que hace acá
        //CRITICO: Tener en cuenta esto al comparar address: https://github.com/ethereum/web3.js/issues/1395

        const prevAccount = prevProps.account && prevProps.account.toLowerCase(); //safe call to toLowerCase
        const currAccount = this.props.account && this.props.account.toLowerCase(); //safe call to toLowerCase

        //llevar esta lógica al set user y al epic
        if(!currAccount && prevAccount){ //unlogged
            //this.setState({roles:[]})
        }
        if(prevAccount === currAccount){ //No changes
            return;
        }

        //this.props.setUser({address:currAccount});
    }

    render(){

        console.log('this.props.roles', this.props.roles);
        return(
            <Provider value={this.props.roles}>
                {this.props.children} 
            </Provider>
        );
    }
}

 
RoleProvider.propTypes = {
    account: PropTypes.string
}

const mapStateToProps = (state, props) => ({
    roles: selectRoles(state)
});
const mapDispatchToProps = { setUser };

export default connect(mapStateToProps,mapDispatchToProps)(RoleProvider);
