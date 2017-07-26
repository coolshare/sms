import React from 'react'
import {connect} from 'react-redux'
import cm from '../../../../common/CommunicationManager'
import Header from '../../../../components/Header/Header'
import style from './UserTable.css'
/**
*
*/
export default class UserTable extends React.Component{
	
	
	/**
    * render
    * @return {ReactElement} markup
    */
	constructor(props){
		super(props);
		this.handleRowClick = this.handleRowClick.bind(this)
	}
	
	handleRowClick = (e, item) => {
		cm.dispatch({"type":"loadSelectedRow", "data": item}) //might need to take in a variable -- ID 
	}
	
	render(){
		var self = this;
		
		var dummyEnterprises = [
	        {"ID":"", "Name":"Mark", "Email":"mwang@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"SuperUser"},
	        {"ID":"", "Name":"Tom", "Email":"jwang@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"User"},
	        {"ID":"", "Name":"Kate", "Email":"jwang@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"Administrator" },
	        {"ID":"", "Name":"Jerry", "Email":"jerry@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"Account Owner"},
	        {"ID":"", "Name":"Phil", "Email":"phil@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"Team Manager"},
	        {"ID":"", "Name":"Jess", "Email":"jess@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"General Manager"},
	        {"ID":"", "Name":"Parsa", "Email":"parsa@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"Administrator"},
	        {"ID":"", "Name":"Mandy", "Email":"mandy@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"User"},
	        {"ID":"", "Name":"Tatum", "Email":"tatum@aaa.com", "Phone" : "3054779102", "Address" : "2804 Mission College", "Social Security" : "45436368828", "Password" : "*******", "Username": "user123", "Group":"User"}
	    ];
		
		for(var i = 0; i < dummyEnterprises.length; i++){
			var id = new Date().valueOf() + i;
			var current = dummyEnterprises[i];
			current.ID = id;
		}

		
			
		return (
			<div>
				<div className="tableHeader"><center><h1>User Select</h1></center></div>
					<div className = "tableScreen">
					  <table className="table-bordered">
					    <tbody>
					      <tr>
					      	<th>Name</th>
					      	<th>Email</th>
					      	<th>Phone#</th>
					      	<th>Group</th>
					      </tr>
					      {
					    	  dummyEnterprises.map((item, idx)=>{
					    		  return (
					    			<tr key={idx} onClick={ (function(_item) {
					    					return function(e) {
					    						self.handleRowClick(e, _item)
					    					}
					    				})(item)
					    			} className={idx%2===0?'evenRow': 'oddRow'}>
					    				<td>{item.Name}</td>
									   <td>{item.Email}</td>
									    <td>{item.Phone}</td>
									    <td>{item.Group}</td>
									</tr>  
					    		  )
					    	  })
					      }
					      	      		    
					    </tbody>
					  </table>
					</div>
				</div>
      		
		)
	}		
}


