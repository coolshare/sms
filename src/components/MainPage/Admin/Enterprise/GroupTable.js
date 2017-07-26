import React from 'react'
import {connect} from 'react-redux'
import cm from '../../../../common/CommunicationManager'
import Header from '../../../../components/Header/Header'
import style from './UserTable'
/**
*
*/
export default class GroupTable extends React.Component{
	
	
	/**
    * render
    * @return {ReactElement} markup
    */
	constructor(props){
		super(props);
	}
	
	testOut(){
		var dummyEnterprises = [
	        {"Name":"Mark", "Email":"mwang@aaa.com", "Phone" : "3054779102"},
	        {"Name":"Tom", "Email":"jwang@aaa.com", "Phone" : "3054779102"},
	        {"Name":"Kate", "Email":"jwang@aaa.com", "Phone" : "3054779102" },
	        {"Name":"Jerry", "Email":"jwang@aaa.com", "Phone" : "3054779102"}
	    ];	
		var current = [];
		for(var i = 0; i < dummyEnterprises.length; i++){
			current[i] = dummyEnterprises[i];
		}
	}
	
	render(){
		var tableStyle = {
				"border" : "5px solid black",
				"width" : "100%",
		}
		
		
		{
			
				var dummyEnterprises = [
			        {"Group" : "Administrator", "Description" : "An organization Administrator is authorized and able to access and adjust all system settings"},
			        {"Group" : "Super User", "Description" : "	A Clarizen Super User within the organization is authorized and able to view and edit all scheduling aspects of work items in the organization regardless of their project roles.Typically, top level executives and project management officers (PMOs) are assigned this permission."},
			        {"Group" : "Financial User", "Description" : "Users with financial permission in Clarizen can view and modify financial data across the organization, including user and job title hourly rates (cost and billing rates), budgeted and actual cost of work items, financial reports and expense reports."},
			        {"Group" : "External User", "Description" : "	External Users are licensed Clarizen users who may or may not be part of your company. if an External User is assigned to only one specific task within a project, they do not have the ability to view the parent work items of that task."},
			        {"Group" : "Time & Expense User", "Description" : "Time & Expense User subscriptions are purchased in conjunction with either the Professional or Enterprise Edition subscriptions."},
			        {"Group" : "Social User", "Description" :"Social access is obtained in conjunction with either the Unlimited or Enterprise Edition subscriptions."},
			    ];
				
				for(var i = 0; i < dummyEnterprises.length; i++){
					var id = new Date().valueOf() + i;
					(dummyEnterprises[i]).ID = id;
				}
		}
		
			
		return (
				<div class = "container">
				<div className="tableHeader"><center><h1>Group Management</h1></center></div>
					<div className = "tableScreen">
					  <table class="table-bordered" style = {tableStyle}>
					    <tbody>
					      <tr>
					      	<th>Group</th>
					      	<th>Description</th>
					      </tr>
					      {
					    	  dummyEnterprises.map((item, idx)=>{
					    		  return (
					    				  <tr key={idx}>
					    				  	{/*<td>{item.ID}</td>*/}
									        <td>{item.Group}</td>
									        <td>{item.Description}</td>
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

