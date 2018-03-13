import React, { Component } from 'react';
import PackageRates from '../bookmarks/PackageRates';

class BookMarkedItems extends Component {
	
	constructor(props)
	{
		
		super(props);
        
	}
    
	render()
	{
        
        const bookMarkedItems = this.props.bookMarkedItems;
        
        const deleteClick = this.props.deleteClick;
        
        const renderBookMarkedItems = Object.keys(bookMarkedItems).map(function (key) 
        {
            
            return (
            
                <div id={bookMarkedItems[key]._id} className="col-md-4 text-center bookmark-item-card" key={key}>
                
                    <div className="item-block item-image">
                    
                        <img src={bookMarkedItems[key].logo} />
                    
                    </div>
                    
                    <div className="item-block item-name">
        
                        <h3> {bookMarkedItems[key].item_name} </h3>
                        
                    </div>
                    
                    <div className="item-block item-rate-type">
                    
                        <span className="item-label"> Rate Type </span>
                        
                        <h3> {bookMarkedItems[key].item_rate_type} </h3>
                    
                    </div>
                    
                    <div className="item-block item-lock-in-period">
                    
                        <span className="item-label"> Lock In Period </span>
                        
                        <h3> {bookMarkedItems[key].item_lock_in_period} </h3>
                        
                    </div>
                    
                    <div className="item-block item-package-rates">
                    
                        <h4> Interest Rates </h4>
                        
                        <div>
                            
                            <PackageRates packageRates={bookMarkedItems[key].item_package_rates}/>
                        
                        </div>
                        
                    </div>
                    
                    <div className="item-block item-package-delete">
                    
                        <button 
                            value={bookMarkedItems[key]._id}
                            className="btn btn-lg btn-danger" 
                            onClick={deleteClick}
                        > 
                            &times; Remove 
                            
                        </button>
                    
                    </div>
                   
                </div>
            
            )
            
        })
        
        return (
        
            <div className="section-wrapper bookmarked-items-wrapper row">
            
                {renderBookMarkedItems}
                
            </div>
                
        )
            
	}
	
}

export default(BookMarkedItems);