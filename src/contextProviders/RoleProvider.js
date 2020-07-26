import React, { Component } from "react";
import PropTypes from 'prop-types';
import UserService from "../services/UserService";

const { Provider, Consumer } = React.createContext();
export { Consumer };

/**
 * Componente que recibe como propiedad un address, y genera como valor un array con los roles asociados
 */
export default class RoleProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles:[] 
        }
    }

    componentDidUpdate(prevProps){
        //TODO: Revisar la comparación de address que hace acá
        //CRITICO: Tener en cuenta esto al comparar address: https://github.com/ethereum/web3.js/issues/1395

        const prevAccount = prevProps.account && prevProps.account.toLowerCase(); //safe call to toLowerCase
        const currAccount = this.props.account && this.props.account.toLowerCase(); //safe call to toLowerCase

        if(!currAccount && prevAccount){ //unlogged
            this.setState({roles:[]})
        }
        if(prevAccount === currAccount){ //No changes
            return;
        }

        return this.updateRolesFromService(currAccount);

    }

    async updateRolesFromService(address){
        const roles = await UserService.getRoles(address);
        console.log(`Roles for [${address}] retrieved from blockchain ${JSON.stringify(roles)}`)
        this.setState({roles});
    }


    render(){
        return(
            <Provider value={this.state.roles}>
                {this.props.children} 
            </Provider>
        );
    }
}

 
RoleProvider.propTypes = {
    account: PropTypes.string
}
