import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router'
import Toolbar from '../toolbar/'
import Menu from '../menu/'
import Gravatar from 'react-gravatar';
import FormErrors from '../src/FormErrors'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import { setUser } from '../../actions/setUser';
import { setActions } from '../../actions/setActions';
import { setCollections } from '../../actions/setCollections';

class confirmDetails extends Component {
	
	constructor(props) 
	{
		
		super(props);
		
		this.state = {
            
			dashboardName: props.params.name,
			contentName: 'management_user',
			name: '',
			emailAddress: '',
            phone: '',
            dob: moment(),
			formErrors: 
			{
				
                name: '',
                phone: ''
				
			},
			error: '',
			success: '',
            nameValid: '',
            phoneValid: '',
			formValid: false
		
		};
		
		if(Meteor.user()) 
		{
			
			this.getUserData(Meteor.userId());
			
		}
		else
		{
			
			console.log("User is not logged in");
			
		}
		
		this.onChange = this.onChange.bind(this);
        
        this.handleChange = this.handleChange.bind(this);
        
        this.onSubmit = this.onSubmit.bind(this);
		
	}
	
	actionService(userId)
	{
    
		var self = this;
    
		Meteor.call('getDefinitions', userId, (error, response) => { 
      
			if (error) 
			{
        
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
    
	getUserData(userId) 
	{
		
		var options = {};
			options.userId = userId;
			
		var name;
		var email;
		
		//Retrieve the current user
		Meteor.call("getUserDetails", options, function(err, response) {
			
			if(response)
			{
                
				this.setState({
					
					name: ((response.profile.name !== "" && response.profile.name !== undefined) ? response.profile.name : (response.profile.name !== "" && response.profile.name !== undefined) ? response.profile.name : ''),
					
					emailAddress: ((response.profile.email !== "" && response.profile.email !== undefined) ? response.profile.email : (response.emails.address !== "" && response.emails.address !== undefined ) ? response.emails.address : ""),
                    
                    phone: ((response.profile.phone !== "" && response.profile.phone !== undefined) ? response.profile.phone : (response.profile.phone !== "" && response.profile.phone !== undefined) ? response.profile.phone : ''),
                    
                    dob: ((response.profile.dob !== "" && response.profile.dob !== undefined) ? response.profile.dob : (response.profile.dob !== "" && response.profile.dob !== undefined) ? response.profile.dob : moment())
                    
				});
                
                this.validateField('name', this.state.name);
                
                this.validateField('phone', this.state.phone);
                
			}
			else
			{
				
				console.log("User is not logged in");
				
			}
			
		}.bind(this));
		
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
        
        let phoneValid = this.state.phoneValid;
		
		switch(fieldName)
		{
            
            case 'name':
                nameValid = value !== '';
                fieldValidationErrors.name = nameValid ? '' : ' must not be empty';
                break;
            case 'phone':
                phoneValid = value.match(/^[0-9+() ]*$/) && value !== '';
                fieldValidationErrors.phone = phoneValid ? '' : ' is invalid';
                break;
			default:
				break;
			
		}
		
		this.setState({
			
			formErrors: fieldValidationErrors,
            nameValid: nameValid,
            phoneValid: phoneValid
					
		}, this.validateForm);
		
	}
    
    validateForm() 
	{
        
		this.setState({
			
			formValid: this.state.nameValid && this.state.phoneValid
			
		});
		
	}
    
    onSubmit(e) 
    {
		
		e.preventDefault();
        
        console.log(this.state.dob);
		
		let name = this.state.name;
		
		let email = this.state.emailAddress;
        
        let phone = this.state.phone;
        
		var options = {};
            options.userId = Meteor.userId();
			options.name = name;
			options.email = email;
            options.phone = phone;
            options.dob = (this.state.dob instanceof Date == true ? this.state.dob : this.state.dob.toDate());
            
        /* Note: Create a global variable for error handling on updating the whole profile */
                
        /* Update Profile */
        
        Meteor.call('updateUserProfile', options, (error, response) => {
            
            if (error) 
            {
        
                this.setState({
            
                    success: '',
                    error: "Profile failed to update"
                    
                });
                
            }
            else
            {
                
                this.setState({
            
                    success: "Profile has been successfully updated",
                    error: ''
                    
                });
                
                browserHistory.push("/user-profile");
                
                
            }
        
        });
             
	
	}
	
	content()
	{
		
		const success = this.state.success;
		
		const error = this.state.error;
		
		return(
		
			<div id="account_profile_landing_page" className="container">
			
				<div className="col-md-5 col-md-offset-3">
                    
                    <form onSubmit={this.onSubmit}>
                    
                        <div className="overlay-pop-up">
                        
                            <div className="overlay-pop-up-header">
				
                                <h1 className="pop-up-title"> Confirm Details </h1>
                            
                            </div>
                            
                            <div className="overlay-pop-up-body">
                            
                                <div className="overlay-pop-up-notifications">
                        
                                    <div className="panel panel-default">
                                            
                                        <FormErrors formErrors={this.state.formErrors} />
                                    
                                    </div>
                                
                                    { error.length > 0 ?
                                    
                                        <div className="panel panel-danger errors">
                                            <div className="panel-heading">
                                                <h3 className="panel-title">Errors</h3>
                                            </div>
                                            <ul className="list-group">
                                                <li className="list-group-item text-danger">
                                                    {error}
                                                </li>
                                            </ul>
                                        </div>
                                        
                                    : ''}
                                    
                                    { success.length > 0 ?
                                    
                                        <div className="panel panel-success success">
                                            <div className="panel-heading">
                                                <h3 className="panel-title">Success</h3>
                                            </div>
                                            <ul className="list-group">
                                                <li className="list-group-item text-success">
                                                    {success}
                                                </li>
                                            </ul>
                                        </div>
                                        
                                    : ''}
                                    
                                </div>
                        
                                <div className="form-group first-form-group">
                                        
                                    <label className="control-label"> Name </label>
                                    
                                    <input
                                        value={this.state.name || ''}
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
                                        value={this.state.emailAddress || ''}
                                        type="email"
                                        name="emailAddress"
                                        className="form-control form-field-icons icon-envelope"
                                        placeholder="Email"
                                        disabled="disabled"
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
                                
                                    <DatePicker dateFormat="DD MMMM YYYY" id="dt_date_of_birth" onChange={this.handleChange} selected={moment(this.state.dob)} name="date_of_birth" calendarClassName="" />
                                
                                </div>
                                
                            </div>
                            
                            <div className="overlay-pop-up-footer">
                            
                                <div className="row">
                                
                                    <button type="submit" className="btn btn-block btn-orange btn-last" disabled={!this.state.formValid}>
                                        
                                        Cofirm Details
                                        
                                    </button>
                                
                                </div>
                            
                            </div>
                            
                        </div>
						
					</form>
					
				</div>
			
			</div>
		
		);
		
	}

	
	
	render()
	{
		
		return (
		
			<div> 
			
				<div id="navbar">
				
					<Toolbar name={this.state.contentName} dashboardName={this.state.dashboardName}/>
					
				</div>
		
				{this.content()}
			
			</div>
			
		);
		
	}
	
	
}

const mapDispatchToProps = dispatch => 
{
	
	return 
	{
		
		setUser: user => {
			
			dispatch(setUser(user))
			
		}
	
	}

};

const mapStateToProps = state => ({
	
	state: state
	
});

export default 
	compose (
		withTracker(() => 
		{
			
			return { currentUser: Meteor.user() }
		
		})
	)(confirmDetails);