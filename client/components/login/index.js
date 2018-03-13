import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router'
import Toolbar from '../toolbar/'
import Alert from 'react-s-alert';

import { setUser } from '../../actions/setUser';
import { setActions } from '../../actions/setActions';
import { setCollections } from '../../actions/setCollections';

class Login extends Component {

	constructor(props) 
	{
		
		super(props);
		
		this.state = {
			
			email: '', 
			password: '', 
			loginButton: 0,
			error: ''
			
		};

		this.handleChange = this.handleChange.bind(this);
		
		this.handleSubmit = this.handleSubmit.bind(this);
		
		this.handleChangePassword = this.handleChangePassword.bind(this);
		
		this.loginButton = this.loginButton.bind(this);
		
		this.loggingInButton = this.loggingInButton.bind(this);
		
		this.loginWithGoogle = this.loginWithGoogle.bind(this);
        
        this.loginWithFacebook = this.loginWithFacebook.bind(this);

		console.log("currentUser: ", this.props.currentUser);
		
		console.log(this.props.state);
	
	}

	componentDidMount()
	{
		
		if (this.state.email === "")
		{
			
			this.textInput.focus();
			
		}
	
	}

	actionService(userId)
	{
    
		var self = this;
    
		Meteor.call('getDefinitions', userId, (error, response) => { 
      
			if (error) {
        
				console.error("Couldn't get action definitions");
				
				return;
      
			}
      
			console.log("action.service definitions: ", response);
      
			self.definitions = response;
      
			self.entry_points = response.entry_points;
      
			this.props.setActions(self.definitions, self.entry_points);
		
		});
	
	}

	collectionService(userId)
	{
		
		var self = this;
    
		Meteor.call('getModelDefinitions', userId, (error, response) => { 
      
			if (error)
			{
				
				console.error("Couldn't get collection");
        
				return;
		
			}
      
			console.log("collection.service definitions: ", response);
      
			self.definitions = response;
      
			this.props.setCollections(self.definitions);
    
		});
	}

	componentWillReceiveProps(nextProps) 
	{
    
		if (nextProps.currentUser) 
		{
      
			this.props.setUser(nextProps.currentUser);
      
			this.actionService(nextProps.currentUser._id);
      
			this.collectionService(nextProps.currentUser._id);
      
			browserHistory.push('/dashboard');
            
		}
  
	}

	handleChange(event) 
	{
		
		this.setState(
			{
				
				email: event.target.value,
			
			}
		
		);
		
	}

	handleChangePassword(event) 
	{
		
		this.setState(
			{
				
				password: event.target.value
				
			}
			
		);
  
	}

	handleSubmit(event) 
	{
		
		event.preventDefault();
		
		let email = this.state.email;
        
		let password = this.state.password;
		
		Meteor.loginWithPassword(email, password, (err) => {
			
			if(err)
			{
				this.setState({
					
					error: err.reason
					
				});
				
			} 
			else 
			{
                
				var currentUser = Meteor.user();
				
				this.props.currentUser = currentUser;
        
				this.props.setUser(currentUser);
        
				this.actionService(currentUser._id);
        
				this.collectionService(currentUser._id);
				
				browserHistory.push('/user-profile');
				
			}
			
			
		});
    
		/* console.log("login.controller $scope.login called STUB only"); */
  
	}

	loginButton()
	{
    
		if (this.state.loginButton == 0)
		{
			
			return (
        
				<button type="submit" className={"btn btn-orange btn-block btn-last  " + ((!this.state.email || !this.state.password) ? "disabled":"")}>
				
					Login
					
				</button>
      
			);
		
		}
    
		return null;
	
	}

	loggingInButton()
	{
		
		if (this.state.loginButton == 1)
      
			return (
        
				<button className="btn btn-orange btn-block btn-last disabled">
				
					<i className="fa fa-spinner fa-spin"></i>&nbsp;&nbsp;Logging in...
					
				</button>
      
			)
    
			return null;
  
	}

	loginWithGoogle()
	{
		
		
		Meteor.loginWithGoogle({
      
			requestPermissions: ['email']
    
		}, 
		(err) => 
		{
			
			if (err) 
			{
				
				console.log(err)
      
			} 
			else 
			{
				
				var currentUser = Meteor.user();
        
				this.props.setUser(currentUser);
        
				this.actionService(currentUser._id);
        
				this.collectionService(currentUser._id);
                
				browserHistory.push('/dashboard');
                
			}
    
		});
	
	}
    
    loginWithFacebook()
	{
        
		Meteor.loginWithFacebook({
      
			requestPermissions: ['user_friends', 'public_profile', 'email']
    
		}, 
		(err) => 
		{
			
			if (err) 
			{
				
				console.log(err)
      
			} 
			else 
			{
				
				var currentUser = Meteor.user();
        
				this.props.setUser(currentUser);
        
				this.actionService(currentUser._id);
        
				this.collectionService(currentUser._id);
        
				browserHistory.push('/dashboard');
      
			}
    
		});
	
	}
    
	render() 
	{
		
		const error = this.state.error;
		
		return (
      
			<div>
        
				<div id="login_landing_page" className="container">
                
					<div className="col-md-5 col-md-offset-3">
                    
                        <form noValidate onSubmit={this.handleSubmit}>
                    
                            <div className="overlay-pop-up">
                            
                                <div className="overlay-pop-up-header">
                        
                                    <h1 className="pop-up-title"> Login </h1>
                                
                                </div>
                                
                                <div className="overlay-pop-up-body">
                                
                                    <div className="overlay-pop-up-notifications">
                                
                                        { error.length > 0 ?
                                            
                                            <div className="alert alert-danger fade in"> {error} </div>
                                            
                                        : ''}
                                    
                                    </div>
                                
                                    <div className="form-group first-form-group">
                                
                                        <label className="control-label">Email Address</label>
                                
                                        <input 
                                            className="form-control form-field-icons icon-envelope" 
                                            type="text" 
                                            value={this.state.email} 
                                            onChange={this.handleChange} 
                                            ref={(input) => { this.textInput = input; }} 
                                            placeholder="Email Address"
                                        />
                            
                                    </div>
                                    
                                    <div className="form-group last-form-group">
                                
                                        <label className="control-label">Password</label>
                                
                                        <input 
                                            className="form-control form-field-icons icon-key" 
                                            type="password" 
                                            value={this.state.password} 
                                            onChange={this.handleChangePassword}
                                            placeholder="Password"
                                        />
                                        
                                        <p className="help-block text-center"> 
                                        
                                            <Link to="/forgot-password"> Forgot Your Password? </Link> 
                                            
                                        </p>
                                
                                    </div>
                                    
                                    <div className="row">
                                    
                                        <div className="form-divider-text">
                                        
                                            <span className="divider-text"> Or </span>
                                        
                                        </div>
                                    
                                    </div>
                                    
                                    <div className="row">

                                        <div className="col-md-12 text-center">
                                    
                                            <button
                                                onClick={this.loginWithGoogle} 
                                                className="button-social-login"
                                            >
                                            
                                                <img src="../assets/google-sign-in.png" alt="Sign in with Facebook"/>
                                                
                                            </button>
                                
                                        </div>
                                        
                                        <div className="col-md-12 text-center">
                                    
                                            <button
                                                onClick={this.loginWithFacebook}
                                                className="button-social-login"
                                            >
                                                
                                               <img src="../assets/facebook-sign-in.png" alt="Sign in with Facebook"/>
                                                
                                            </button>
                                
                                        </div>
                                    
                                    </div>
                                    
                                </div>
                                
                                <div className="overlay-pop-up-footer">
                                
                                    <div className="row">
                                    
                                        <Link to="/signup" className="btn btn-red btn-block btn-first" > Register </Link>
                                            
                                    </div>
                                
                                    <div className="row">
                                
                                        <div className="text-center">
                                    
                                            {this.loginButton()}
                                    
                                            {this.loggingInButton()}
                                
                                        </div>
                                        
                                    </div>
                                
                                </div>
                                
                            </div>
                            
                        </form>
			
					</div>
					
				</div>
				
			</div>
			
		)
		
	}
}

const mapDispatchToProps = dispatch => 
{
	
	return {
		
		setUser: user => {dispatch(setUser(user))},
		setActions: (definitions, entryPoints) => {dispatch(setActions(definitions, entryPoints))},
		setCollections: (definitions) => {dispatch(setCollections(definitions))}
	
	}

};

const mapStateToProps = state => ({
	
	state: state
	
});

export default 
	compose (
		connect(mapStateToProps, mapDispatchToProps),
		withTracker(() => {
			return { currentUser: Meteor.user() }
		})
	)(Login);
