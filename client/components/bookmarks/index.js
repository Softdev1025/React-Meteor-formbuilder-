import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import { browserHistory } from 'react-router';
import Toolbar from '../toolbar/'
import Menu from '../menu/'
import Gravatar from 'react-gravatar';
import FormErrors from '../src/FormErrors'

import { setUser } from '../../actions/setUser';
import { setActions } from '../../actions/setActions';
import { setCollections } from '../../actions/setCollections';
import BookMarkedItems from '../bookmarks/BookMarkedItems'
import axios from 'axios';
import cors from 'cors';

class bookMarks extends Component {
	
	constructor(props) 
	{
		
		super(props);
		
		this.state = 
        {
            
			contentName: 'management_user',
			error: '',
            info: '',
			success: '',
			formValid: false,
            bookMarkedItems: ''
		
		};
        
        this.deleteThisBookMark = this.deleteThisBookMark.bind(this);
        
	}
    
    
    
    componentWillMount()
    {
        
        var self = this;
        
        //Check if user is logged in...
        Tracker.autorun(() => 
        {
            
            if(Accounts.loginServicesConfigured()) 
            {
                
                if(Meteor.user())
                {
                    
                    //Check if the URL parameters for the bookmarks address is present...
                    const query = new URLSearchParams(location.search);
                    
                    const package_id = query.get('packageId');
                    
                    const referrer = query.get('referrer');
                    
                    
                    //Add the bookmark flow
                    if( (package_id) && (referrer == 'anchor') )
                    {
                        
                        this.itemBookMark(package_id);
                        
                    }
                    
                }
                else
                {
                    
                    browserHistory.push('/login'); 
                    
                }
                
            }
            
        });
        
    }
    
    
    
    componentDidMount()
    {
        
        //Read the bookmarks flow
        this.readBookMarks();
        
    }
    
    
    
    //Function to handle adding of bookmarking...
    itemBookMark(package_id)
    {
        
        const userId = Meteor.userId();
        
        var options = {};
            options.userId = userId;
            options.package_id = package_id;
            
            
        //Check first if the item has been bookmarked already...
        Meteor.call("checkBookMarkExists", options, function(err, response) 
        {
            
            if(response == true)
            {
                
                this.setState({
					
                    info: "The selected item was already bookmarked before, refer to your list of bookmarks"
                    
                });
                
            }
            else
            {
                
                //Get the package ID
                axios.get('https://easyrates.openb.net/borrows/BookmarkedItems?itemId='+package_id)
                    .then(response => {
                        
                        options.item_id = response.data.item_id;
                        options.logo = response.data.logo;
                        options.item_name = response.data.item_name;
                        options.item_rate_type = response.data.item_rate_type;
                        options.item_lock_in_period = response.data.item_lock_in_period;
                        options.item_package_rates = response.data.item_package_rates;
                        
                        Meteor.call("addBookMark", options, function(err, response) {
            
                            if( response.success == true )
                            {
                                
                                this.setState({
                            
                                    success: "Item has been bookmarked successfully"
                                    
                                });
                                
                                //Read the bookmarks flow
                                this.readBookMarks();
                                
                            }
                            else
                            {
                                
                                this.setState({
                            
                                    error: "An error occurred while bookmarking the item"
                                    
                                });
                                
                            }
                            
                        }.bind(this));
                        
                    })
                    .catch(error => {
                        console.log('Error fetching and parsing data', error);
                    });
                    
            }
            
        }.bind(this));
            
    }
    
    
    
    //Function to handle reading of bookmarked items...
    readBookMarks()
    {
        
        const userId = Meteor.userId();
        
        var options = {};
            options.userId = userId;
            
        /* Meteor.call("readUs", options, function(err, response) {
            
            console.log(response);
            
        }.bind(this)); */
        
        Meteor.call("readBookMarks", options, function(err, response) 
        {
            
            if( response )
            {
                
                this.setState({
                    
                    bookMarkedItems: response
                    
                });
                
            }
            else
            {
                
                this.setState({
            
                    error: "An error occurred while retrieving the bookmarked items"
                    
                });
                
            }
            
        }.bind(this));
                
    }
    
    
    
    //Function on handling deletion of bookmarked items...
    deleteThisBookMark(e)
    {
        
        const userId = Meteor.userId();
        
        let bookMarkedItemId = e.target.value;
        
        var options = {};
            options.userId = userId;
            options.bookMarkedItemId = e.target.value;
            
        Meteor.call("deleteBookMarkedItem", options, function(err, response) 
        {
            
            if( response )
            {
                
                this.setState({
                    
                    info: "The bookmarked item was successfully removed from the list.",
                    bookMarkedItems: this.state.bookMarkedItems.filter((bookMarkedItem) => bookMarkedItem._id != bookMarkedItemId)
                    
                });
                
            }
            else
            {
                
                this.setState({
            
                    error: "An error occurred while deleting the bookmarked item"
                    
                });
                
            }
            
        }.bind(this));
        
    }
    
    
    
	content()
	{
		
		const success = this.state.success;
		
		const error = this.state.error;
        
        const info = this.state.info;
        
		return(
		
			<div id="bookmarks_landing_page" className="container">
			
				<div className="col-md-12 text-center">
                
                    <h1> My Bookmarks </h1>
                
                    { error.length > 0 ?
                    
                        <div className="panel panel-default">
							
                            <div className="alert alert-danger fade in"> {error} </div>
                            
                        </div>
                        
                    : ''}
                    
                    { info.length > 0 ?
                    
                        <div className="panel panel-default">
							
                            <div className="alert alert-info fade in"> {info} </div>
                            
                        </div>
                        
                    : ''}
                    
                    { success.length > 0 ?
                    
                        <div className="panel panel-default">
							
                            <div className="alert alert-success fade in"> {success} </div>
                            
                        </div>
                        
                    : ''}
                    
                    <div>
                    
                        <BookMarkedItems bookMarkedItems={this.state.bookMarkedItems} deleteClick={this.deleteThisBookMark} />
                        
                    </div>
                    
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
	
	state: state,
    currentUser: state.currentUser.currentUser
	
});

export default 
	compose (
		withTracker(() => 
		{
			
			return { currentUser: Meteor.user() }
		
		})
	)(bookMarks);