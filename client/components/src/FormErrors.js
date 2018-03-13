import React, { Component } from 'react';

class FormErrors extends Component {
	
	constructor(props)
	{
		
		super(props);
		
	}
	
	render()
	{
		
		const formErrors = this.props.formErrors;
        
        return (
        
            <div className='formErrors panel panel-danger errors'>
            
                {Object.keys(formErrors).map((fieldName, i) => {
                
                    if(formErrors[fieldName].length > 0)
                    {
                        
                        return (
                        
                            <div key={i} className="panel-heading">
                                <h3 className="panel-title">Errors</h3>
                            </div>
                        
                        )
                        
                    }
                    
                })}
            
                <ul className="list-group">
            
                    {Object.keys(formErrors).map((fieldName, i) => {
                
                        if(formErrors[fieldName].length > 0)
                        {
                            
                            return (
                      
                                <li key={i} className="list-group-item text-danger">
                                
                                    <span className="text-capitalize"> {fieldName} </span> {formErrors[fieldName]}
                                    
                                </li>
                            
                            )        
                        } 
                        else 
                        {
                        
                            return '';
                    
                        }
                        
                    })}
                    
                </ul>
                
            </div>
                
        )
            
	}
	
}

export default(FormErrors);