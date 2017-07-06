import React from 'react';
import {connect} from 'react-redux'
import ReactDOM, {findDOMNode} from "react-dom";
import ResouceUsageGadget from './ResouceUsage/ResouceUsageGadget'
import ENGListGadget from './ENGList/ENGListGadget'
import ENGAlertsGadget from './ENGAlerts/ENGAlertsGadget'
import cm from '../../../common/CommunicationManager'

const numCol = 2;

class _DashboardContainer extends React.Component{
	constructor() {
		super();
		this.drop = this.drop.bind(this);
		this.dragStart = this.dragStart.bind(this);
		this.dragOver = this.dragOver.bind(this);
		cm.gadgetStateMap = {
				"ResouceUsageGadget":{"name":"ResouceUsageGadget", "type":ResouceUsageGadget, "state":"normal"},
				"ENGAlertsGadget":{"name":"ENGAlertsGadget", "type":ENGAlertsGadget, "state":"normal"},
				"ENGListGadget":{"name":"ENGListGadget", "type":ENGListGadget, "state":"normal"}
			};
		for (let k in cm.gadgetStateMap) {
			cm.dispatch({"type":"registerGadget", "data":cm.gadgetStateMap[k]})
		}
		
	}
	adjustPosition = ()=> {
		
	}
	dragStart = (event) => {
		this.dragTarget = event.currentTarget;
		this.container = findDOMNode(this.refs.dropContainer);
		this.container.style.cursor = "pointer"
	    var data = {
	      name: 'foobar',
	      age: 15 
	    };
		
	    event.dataTransfer.setData('text', JSON.stringify(data)); 
	    console.log("dragStart:"+this.container.style.cursor)
	  }
	drop = (event) => {
		console.log("drop: x="+event.clientX+" y="+event.clientY)
	    event.preventDefault();
		this.adjustPosition();
		this.container.style.cursor = "default"
	    var data;

	    try {
	      data = JSON.parse(event.dataTransfer.getData('text'));
	    } catch (e) {
	      // If the text data isn't parsable we'll just ignore it.
	      return;
	    }

	    // Do something with the data
	    console.log(data);

	  }
	dragOver(event) {
		 console.log("dragOver:"+this.container.style.cursor)
		event.preventDefault();
		//console.log("dragOver")
		this.container.style.cursor = "pointer"
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		var selt = this;
		var gadgets = Object.keys(this.props.gadgets).length>0?this.props.gadgets:null;
		

		if (gadgets===null || this.props.mainContainerSize===undefined) {
			return null;
		}
		var maxElem = null;
		for (let k in gadgets) {
			let elem = gadgets[k];
			if (elem.state==="max") {
				maxElem = elem;
				break;
			}
		}
		let aa = gadgets["ResouceUsageGadget"].type
		return (
				<div ref="dropContainer" onDragOver={(e)=>this.dragOver(e)} onDrop={this.drop} style={{"width":this.props.mainContainerSize.w, "height":this.props.mainContainerSize.h}}>
					{gadgets==null || ((maxElem===null||maxElem===gadgets["ResouceUsageGadget"])&& gadgets["ResouceUsageGadget"].state!=="min" && gadgets["ResouceUsageGadget"].state!=="close")?<div  draggable='true' onDragStart={this.dragStart}><aa gadgets={this.props.gadgets}/></div>:null}
					{gadgets==null || ((maxElem===null||maxElem===gadgets["ENGAlertsGadget"])&&gadgets["ENGAlertsGadget"].state!=="min" && gadgets["ENGAlertsGadget"].state!=="close")?<div  draggable='true' onDragStart={this.dragStart}><ENGAlertsGadget gadgets={this.props.gadgets}/></div>:null}
					{gadgets==null || ((maxElem===null||maxElem===gadgets["ENGListGadget"])&&gadgets["ENGListGadget"].state!=="min" && gadgets["ENGListGadget"].state!=="close")?<div  draggable='true' onDragStart={this.dragStart}><ENGListGadget gadgets={this.props.gadgets}/></div>:null}
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
			    	gadgets: store.DashboardReducer.gadgets,
			    	mainContainerSize: store.MainContainerReducer.mainContainerSize
			    };
			  }
			)(_DashboardContainer);
export default DashboardContainer