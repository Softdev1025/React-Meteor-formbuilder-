import React, { Component } from 'react';

class PackageRates extends Component {
	
	constructor(props)
	{
		
		super(props);
        
	}
    
	render()
	{
        
        const packageRates = this.props.packageRates;
        
        if( packageRates )
        {
            
            const renderPackageRates = Object.entries(packageRates.rate).map( ( [key,value] ) => {
            
                return (
                
                        <div className="package-rate" key={key}> 
                        
                            <div className="package-year-rate">
                            
                                <span className="item-label"> {value.year_rate} Interest Rate </span>
                            
                            </div>
                            
                            <div className="package-interest-net-rate">
                            
                                <h5> {value.interest_rate} ({value.net_interest}%) </h5>
                            
                            </div>
                            
                            <div className="package-interest-value">
                            
                                <h5> {value.interest_value} </h5>
                            
                            </div>
                            
                        </div>
                );
                
            });
            
            return (
        
                <div className="section-wrapper bookmarked-items-package-rates row">
                
                    {renderPackageRates}
                    
                </div>
                    
            )
            
            
        }
        else
        {
            
            return (
        
                <div className="section-wrapper bookmarked-items-package-rates row">
                
                    
                </div>
                    
            )
            
        }
            
	}
	
}

export default(PackageRates);