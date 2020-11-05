import Web3App from 'lib/blockchain/Web3App';
import React, { Component } from 'react';

class OnlyCorrectNetwork extends Component {
    render() {
        return (
            <Web3App.Consumer>
                {
                    ({
                        network
                    }) => 
                        network.isCorrectNetwork && (this.props.children)
                }
            </Web3App.Consumer>
        )
    }
}

export default OnlyCorrectNetwork;