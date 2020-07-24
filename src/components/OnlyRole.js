import React, { Component } from 'react';
import { Consumer as RoleConsumer } from "../contextProviders/RoleProvider";


//TODO: considerar multiples roles
export default class OnlyRole extends Component {

    render() {
        return (
            <RoleConsumer>
                {roles => {
                    if (roles.includes(this.props.role)) {
                        return this.props.children;
                    } else {
                        return null;
                    }
                }
                }
            </RoleConsumer>
        );
    }
}
