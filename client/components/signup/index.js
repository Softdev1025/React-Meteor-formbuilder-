import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router'
import Toolbar from '../toolbar/'
import { Accounts } from 'meteor/accounts-base'
import FormErrors from '../src/FormErrors'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class SignUp extends Component {
	
	constructor(props)
	{
		
		super(props);
        
		this.state = {
			
			name: '',
			email: '',
            emailConfirmation: '',
            phone: '',
            dob: moment(),
			password: '',
			passwordConfirmation: '',
			formErrors: 
			{
                
				name: '',
				email: '',
                phone: '',
                emailConfirmation: '',
				password: '',
				passwordConfirmation: ''
				
			},
			error: '',
			success: '',
            nameValid: false,
			emailValid: false,
            emailConfirmationValid: false,
            phoneValid: false,
			passwordValid: false,
			passwordConfirmationValid: false,
			formValid: false
			
		}
        
		this.onChange = this.onChange.bind(this);
        
        this.handleChange = this.handleChange.bind(this);
		
		this.onSubmit = this.onSubmit.bind(this);
		
	}
	
	componentDidMount() 
	{
		
        
		
	}
    
    componentDidUpdate()
    {
        
        
        
    }
	
	onChange(e) 
	{
		
		const name = e.target.name;
		
		const value = e.target.value;
		
		this.setState({
			
			[name]: value}, 
			() => { this.validateField(name, value) 
					
		});
		
		/* this.setState({
			
			[e.target.name]: e.target.value
			
		}); */
		
	}
    
    handleChange(e)
    {
        
        this.setState({
            
           
            dob: e
           
        });
        
    }
    
	validateField(fieldName, value)
	{
		
		let fieldValidationErrors = this.state.formErrors;
        
        let nameValid = this.state.nameValid;
		
		let emailValid = this.state.emailValid;
        
        let emailConfirmationValid = this.state.emailConfirmationValid;
        
        let phoneValid = this.state.phoneValid;
		
		let passwordValid = this.state.passwordValid;
		
		let passwordConfirmationValid = this.state.passwordConfirmationValid;
		
		switch(fieldName)
		{
            
            case 'name':
                nameValid = value !== '';
                fieldValidationErrors.name = nameValid ? '' : ' must not be empty';
                break;
			case 'email':
				emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				fieldValidationErrors.email = emailValid ? '' : ' is invalid';
				break;
            case 'emailConfirmation':
                emailConfirmationValid = value === this.state.email;
                fieldValidationErrors.emailConfirmation = emailConfirmationValid ? '': ' Mismatch';
                break;
            case 'phone':
                phoneValid = value.match(/^[0-9+() ]*$/);
                fieldValidationErrors.phone = phoneValid ? '' : ' is invalid';
                break;
			case 'password':
				passwordValid = value.length >= 8;
				fieldValidationErrors.password = passwordValid ? '': ' is too short, password must be greater than 8 characters';
				break;
			case 'passwordConfirmation':
				passwordConfirmationValid = value === this.state.password;
				fieldValidationErrors.passwordConfirmation = passwordConfirmationValid ? '': ' Mismatch';
				break;
			default:
				break;
			
		}
		
		this.setState({
			
			formErrors: fieldValidationErrors,
            nameValid: nameValid,
			emailValid: emailValid,
            emailConfirmationValid: emailConfirmationValid,
            phoneValid: phoneValid,
			passwordValid: passwordValid,
			passwordConfirmationValid: passwordConfirmationValid
					
		}, this.validateForm);
		
	}
	
	validateForm() 
	{
		
		this.setState({
			
			formValid: this.state.nameValid && this.state.emailValid && this.state.emailConfirmationValid && this.state.phoneValid && this.state.passwordValid && this.state.passwordConfirmationValid
			
		});
		
	}
	
	onSubmit(e) {
		
		e.preventDefault();
		
		let name = this.state.name;
		
		let email = this.state.email;
		
		let password = this.state.password;
        
        let phone = this.state.phone;
    
        let dob = this.state.dob.toDate();
		
		var options = {};
			options.name = name;
			options.email = email;
			options.password = password;
            options.phone = phone;
            options.dob = dob;
            
		//Check if the email address already exists...
		Meteor.call("userExists", options, function(err, response) {
			
			if(response)
			{
				
				this.setState({
					
					error: "Email address already exists"
					
				});
				
			}
			else
			{
				
				//Add User method here...
				Meteor.call("addUser", options, function(err, response) {
			
					if(err)
					{
						
						console.log(err);
                        
                        console.log(response);
						
					}
					else
					{
						
						this.setState({
					
							success: "You have successfully registered"
							
						});
						
						browserHistory.push('/login');
						
					}
					
				}.bind(this));
				
			}
			
		}.bind(this));
	
	}
	
	render() {
		
		const success = this.state.success;
		
		const error = this.state.error;
		
		return(
		
			<div>
			
				<div id="signup_landing_page" className="container">
				
					<div className="col-md-5 col-md-offset-3">
                    
                        <form onSubmit={this.onSubmit}>
                        
                            <div className="overlay-pop-up">
					
                                <div className="overlay-pop-up-header">
                                
                                    <h1 className="pop-up-title"> Register </h1>
                                    
                                </div>
                                
                                <div className="overlay-pop-up-body">
                                
                                    <div className="overlay-pop-up-notifications">
                        
                                        <div className="panel panel-default">
                                        
                                            <FormErrors formErrors={this.state.formErrors} />
                                        
                                        </div>
                            
                                        { error.length > 0 ?
                                            
                                            <div className="alert alert-danger fade in"> {error} </div>
                                            
                                        : ''}
                                        
                                        { success.length > 0 ?
                                            
                                            <div className="alert alert-success fade in"> {success} </div>
                                            
                                        : ''}
                                        
                                    </div>
							
                                    <div className="form-group first-form-group">
                                    
                                        <label className="control-label"> Name </label>
                                        
                                        <input
                                            value={this.state.name}
                                            type="text"
                                            onChange={this.onChange}
                                            name="name"
                                            className="form-control form-field-icons icon-user"
                                            placeholder="Name"
                                        />
                                    
                                    </div>
                            
                                    <div className="form-group">
                                    
                                        <label className="control-label"> Email </label>
                                        
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.email}
                                            type="email"
                                            name="email"
                                            className="form-control form-field-icons icon-envelope"
                                            placeholder="Email"
                                        />
                                    
                                    </div>
                                    
                                    <div className="form-group">
                                    
                                        <label className="control-label"> Confirm Email </label>
                                        
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.emailConfirmation}
                                            type="email"
                                            name="emailConfirmation"
                                            className="form-control form-field-icons icon-envelope"
                                            placeholder="Confirm Email"
                                        />
                                    
                                    </div>
                                    
                                    <div className="form-group">
                                    
                                        <label className="control-label"> Handphone Number </label>
                                        
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.phone}
                                            type="text"
                                            name="phone"
                                            className="form-control form-field-icons icon-phone"
                                            placeholder="Handphone Number"
                                        />
                                    
                                    </div>
                                    
                                    <div className="form-group">
                                    
                                        <label className="control-label"> Date of Birth </label>
                                    
                                        <DatePicker dateFormat="DD MMMM YYYY" id="dt_date_of_birth" onChange={this.handleChange} selected={this.state.dob} name="date_of_birth" calendarClassName="" />
                                    
                                    </div>
                            
                                    <div className="form-group">
                                    
                                        <label className="control-label"> Password </label>
                                        
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.password}
                                            type="password"
                                            name="password"
                                            className="form-control form-field-icons icon-key"
                                            placeholder="Password"
                                        />
                                    
                                    </div>
                            
                                    <div className="form-group last-form-group">
                                    
                                        <label className="control-label"> Confirm Password </label>
                                        
                                        <input
                                            onChange={this.onChange}
                                            value={this.state.confirmPassword}
                                            type="password"
                                            name="passwordConfirmation"
                                            className="form-control form-field-icons icon-key"
                                            placeholder="Confirm Password"
                                        />
                                    
                                    </div>
                                    
                                </div>
                                
                                <div className="overlay-pop-up-footer">
                                
                                    <div className="row">
                                
                                        <button type="submit" className="btn btn-block btn-orange btn-last" disabled={!this.state.formValid}>
                                                
                                            Register
                                            
                                        </button>
                                    
                                    </div>
                                
                                </div>
                                
                            </div>
						
						</form>
						
					</div>
					
				</div>
				
			</div>
		
		);
		
	}
	
}

export default (SignUp);