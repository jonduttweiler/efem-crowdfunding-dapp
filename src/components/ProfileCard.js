import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

import { getUser } from '../services/UserService';
import User from '../models/User';

class ProfileCard extends Component {  //va a recibir como prop un address
    constructor(props){
        super(props);
        this.state = {
            address: props.address,
            user: new User()
        }
    }

    componentDidMount(){
        if(this.props.address) this.loadUser();    
    }
    
    shouldComponentUpdate(nextProps, nextState){
        console.log(nextProps.address);
        if(this.state != nextState) return true;
        
        if(this.props.address === nextProps.address){
            return false;
        }
        return true; 
    }
    
    
    async componentDidUpdate(prevProps, prevState){
      console.log("componentDidUpdate");
      if(this.props.address !== prevProps.address){
        this.loadUser();
      }
    }

    async loadUser(){
        console.log("load user")
        const user = await getUser(this.props.address);
        if (user) this.setState({ user })
    }

    render(){
        const user = this.state.user;

        return(
            <div style={{textAlign:"center"}}>
                <Link to={`/profile/${user.address}`}>
                <Avatar size={50} src={user.avatar} round />
                <p className="small">{user.name}</p>
                </Link>
            </div>
        );
    }
}

ProfileCard.propTypes = {
    address: PropTypes.string,
  };
  

export default ProfileCard;