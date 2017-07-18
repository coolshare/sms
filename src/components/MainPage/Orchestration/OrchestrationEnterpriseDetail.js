import React, { Component } from 'react'
import cm from '../../../common/CommunicationManager'
import {connect} from 'react-redux'
	
class _OrchestrationEnterpriseDetail extends React.Component {

	 render() {
		var self = this;	
		let id = this.props.selectedEnterprise;
		if (!id) {
			return null;
		}
		var selectedEnterprise = cm.getStoreValue("OrchestrationReducer", "provider").enterpriseMap[id];
		

		return (
			    <div>
			    	<h4>{selectedEnterprise.data.BusinessName}</h4>
			    </div>
			);
	}
}
const OrchestrationEnterpriseDetail = connect(
		  store => {
			    return {
			    	selectedEnterprise: store.OrchestrationReducer.selectedEnterprise
			    };
			  }
			)(_OrchestrationEnterpriseDetail);
export default OrchestrationEnterpriseDetail

	