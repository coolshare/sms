import React from 'react';
import {connect} from 'react-redux'
import ResouceUsageGadget from './ResouceUsage/ResouceUsageGadget'
import ENGListGadget from './ENGList/ENGListGadget'
import ENGAlertsGadget from './ENGAlerts/ENGAlertsGadget'
//import cm from '../../common/CommunicationManager'

const numCol = 2;

class _DashboardContainer extends React.Component{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		var selt = this;
		var gadgets = Object.keys(this.props.gadgets).length>0?this.props.gadgets:null;
		var maxElem = null;
		for (let k in gadgets) {
			let elem = gadgets[k];
			if (elem.state==="max") {
				maxElem = elem;
				break;
			}
		}
		return (
			<div>
				{gadgets==null || ((maxElem===null||maxElem===gadgets["ResouceUsageGadget"])&& gadgets["ResouceUsageGadget"].state!=="min" && gadgets["ResouceUsageGadget"].state!=="close")?<ResouceUsageGadget gadgets={this.props.gadgets}/>:null}
				{gadgets==null || ((maxElem===null||maxElem===gadgets["ENGAlertsGadget"])&&gadgets["ENGAlertsGadget"].state!=="min" && gadgets["ENGAlertsGadget"].state!=="close")?<ENGAlertsGadget gadgets={this.props.gadgets}/>:null}
				{gadgets==null || ((maxElem===null||maxElem===gadgets["ENGListGadget"])&&gadgets["ENGListGadget"].state!=="min" && gadgets["ENGListGadget"].state!=="close")?<ENGListGadget gadgets={this.props.gadgets}/>:null}
			</div>						
		)
		//} else {
		//	return null;
		//}
		/*
		self.count = 0;
		var rowList = [];
		var r = -1;
		for (let k in this.props.gadgets) {
			let state = this.props.gadgets[k];
			if (self.count===0) {
				rowList[++r] = [];
				rowList[r].push(state);
			} else if (self.count===numCol) {
				self.count = 1;
				rowList[++r] = [];
				rowList[r].push(state);
			} else {
				rowList[r].push(state);
			}
			self.count++;
		}
		let rows = rowList.map((row, idx)=>{
			return (
				<Row className="show-grid">
					{
						row.map((state, idx2)=>{
							return (
								<Col xs={6} md={6}>{state.elem}</Col>
							)	
						})
					}
				</Row>
			)			
		})
		
		
		return (
			<div id="DashboardContainer">	
				<Grid bsClass="gridContainer">
					{rows}
				</Grid>
      		</div>
		)*/
	}
}

const DashboardContainer = connect(
		  store => {
			    return {
			    	gadgets: store.DashboardReducer.gadgets
			    };
			  }
			)(_DashboardContainer);
export default DashboardContainer