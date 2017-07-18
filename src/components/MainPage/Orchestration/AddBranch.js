import React, { Component } from 'react';
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'
import BranchForm from './BranchForm'

export default class AddBranch extends React.Component {

	render() {
	    return (				
			<div>
	    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
		    	<div>
		    		<div style={{"height":"50px", "fontSize":"200%"}}>Add Branch</div>
		      		<BranchForm branch={{}}/>
			    </div>
			</div>

	    	
	    )
	}
}

