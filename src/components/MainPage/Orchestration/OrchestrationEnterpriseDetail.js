import React, { Component } from 'react'
import cm from '../../../common/CommunicationManager'
import {connect} from 'react-redux'
import EnterpriseForm from './EnterpriseForm'
	
class _OrchestrationEnterpriseDetail extends React.Component {

	 render() {
		var self = this;	

		var selectedEnterprise = cm.selectedEnterprise;
		if (selectedEnterprise===undefined) {
			return null;
		}

		return (
			    <div>
			    	<EnterpriseForm enterprise={selectedEnterprise.data} title="Branch Info"/>
			    </div>
			);
	}
}
const OrchestrationEnterpriseDetail = connect(
		  store => {
			    return {
			    	selectedEnterpriseId: store.OrchestrationReducer.selectedEnterpriseId
			    };
			  }
			)(_OrchestrationEnterpriseDetail);
export default OrchestrationEnterpriseDetail

	