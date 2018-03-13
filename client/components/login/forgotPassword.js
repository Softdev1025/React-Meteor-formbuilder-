import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';
import Toolbar from '../toolbar/';

import { setUser } from '../../actions/setUser';
import { setActions } from '../../actions/setActions';
import { setCollections } from '../../actions/setCollections';
import FormErrors from '../src/FormErrors'

class forgotPassword extends Component {

	constructor(props) 
	{
		
		super(props);
		
		this.state = {
			
			email: '', 
			error: '',
            success: '',
            formErrors:
            {
                
                email: '',
                
            },
            emailValid: false,
            formValid: false
			
		};

		this.handleChange = this.handleChange.bind(this);
		
		this.handleSubmit = this.handleSubmit.bind(this);
        
	}

	componentDidMount()
	{
		
	
	}

	componentWillReceiveProps(nextProps) 
	{
    
		if (nextProps.currentUser) 
		{
      
			this.props.setUser(nextProps.currentUser);
      
		}
  
	}

	handleChange(e) 
	{
        
        const name = e.target.name;
        
        const value = e.target.value;
        
        this.setState(
        
            { [name]: value },
            () => { this.validateField(name,value)}
            
        );
		
	}
    
    validateField(fieldName, value) 
	{
        
        let fieldValidationErrors = this.state.formErrors;
        
        let emailValid = this.state.emailValid;
        
        switch(fieldName)
		{
            
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            default:
                break;
            
        }
        
        this.setState({
            
            formErrors: fieldValidationErrors,
			emailValid: emailValid
            
        }, this.validateForm)
        
    }
    
    validateForm()
    {
        
        this.setState({
			
			formValid: this.state.emailValid
			
		});
        
    }

	handleSubmit(e) 
	{
		
		e.preventDefault();
        
        var options = {};
            options.email = this.state.email;
		
        Accounts.forgotPassword(options, function(err) {
            
            if(err)
            {
                
                this.setState({
					
					error: err.reason
					
				});
                
            }
            else
            {
                
                this.setState({
                    
                   success: 'An e-mail will be sent to your mailbox containing a link for resetting your password' 
                    
                });
                
            }
           
        }.bind(this));
        
	}

	render() 
	{
		
		const error = this.state.error;
        
        const success = this.state.success;
        
		return (
      
			<div>
        
				<div id="forgot_password_landing_page" className="container">
				
					<div className="col-md-5 col-md-offset-3">
                    
                        <div className="overlay-pop-up">
                        
                            <div className="overlay-pop-up-header">
					
                                <h1 className="pop-up-title"> Forgot Password </h1>
                                
                            </div>
                            
                            <div className="overlay-pop-up-body">
                            
                                <div className="overlay-pop-up-notifications">
                            
                                    { error.length > 0 ?
                                        
                                        <div className="alert alert-danger fade in"> {error} </div>
                                        
                                    : ''}
                                    
                                    { success.length > 0 ?
                                        
                                        <div className="alert alert-success fade in"> {success} </div>
                                        
                                    : ''}
                                
                                    <div className="panel panel-default">
                                    
                                        <FormErrors formErrors={this.state.formErrors} />
                                    
                                    </div>
                                
                                </div>
                        
                                <div className="form-group">
                            
                                    <label className="control-label">Email Address</label>
                            
                                    <input 
                                        className="form-control form-field-icons icon-envelope" 
                                        type="email"
                                        name="email" 
                                        value={this.state.email} 
                                        onChange={this.handleChange} 
                                        placeholder="Email Address"
                                    />
                        
                                </div>
                                
                            </div>
                            
                            <div className="overlay-pop-up-footer">
                            
                                <div className="row">
                                
                                    <button
                                        className="btn btn-block btn-orange btn-last"
                                        disabled={!this.state.formValid}
                                        onClick={this.handleSubmit}
                                    >
                                    
                                        Reset Password
                                        
                                    </button>
                                
                                </div>
                            
                            </div>
                            
                        </div>
                        
					</div>
					
				</div>
				
			</div>
			
		)
		
	}

}

const mapDispatchToProps = dispatch => 
{
	
	return {
		
		setUser: user => {dispatch(setUser(user))}
        
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
	)(forgotPassword);
