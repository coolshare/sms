import React, { Component } from 'react';
import cm from '../../../common/CommunicationManager'
import {PopupCloseBox} from '../../../common/PopupComponents'

export default class AddEnterprise extends React.Component {

	componentDidMount() {
		
	}

	  
	render() {
	    return (
	    	<div>				
				<Header/>	
				<div style={{"minHeight":Utils.screenH+"px"}}>
		    		{cm.isStackEmpty()?null:<div className="PopupHeader"><PopupCloseBox/></div>}
			    	<div id="svg" style={{"float":"left", "height":Utils.screenH+"px", "width":"70vw"}}>
			      		
					</div>
					<div style={{"float":"left","width":"25vw", "height":Utils.screenH+"px", "border": "1px solid black"}}>
						<OrchestrationDetail selectedNode={this.props.selectedNode}/>
					</div>
					<div id="orchestTooltip" class="hidden">
					    <p><span id="value"></span></p>
				    </div>
				</div>
      		</div>
	    	
	    )
	}
}

