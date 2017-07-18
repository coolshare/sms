import React, { Component } from 'react';
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import EnterpriseForm from './EnterpriseForm'

export default class AddEnterprise extends React.Component {
	render() {
	    return (				
			<div>
	    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    	<div>
		    		<div style={{"height":"50px", "fontSize":"200%"}}>Add Enterprise</div>
		      		<EnterpriseForm enterprise={{}}/>
			    </div>
			</div>

	    	
	    )
	}
}

