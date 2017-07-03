import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import {connect} from 'react-redux'
import cm from '../common/CommunicationManager'
import Header from './Header/Header'
import Utils from '../common/Utils'
import { browserHistory } from 'react-router';
/**
*
*/
		class _MyStackViewContainer extends React.Component{
			constructor(props) {
				super(props);
				this.state = {componentList: [], selected:null};
				this.idList = [];
			}
			
			push = (cc) => {
				var c = cc[0];
				cm.dispatch({"type":"BeforePopupPush", "data":cc[1]})
				let id = cc[1]+"_"+Utils.getId()
				for (let i=0; i<this.idList.length; i++) {
					let cc = document.getElementById(this.idList[i]);
					cc.style.display = "none"
				}
				this.idList.push(id);
				var comList = [...this.state.componentList];
				comList.push(<Provider key={id} store={cm.store}>
				<div id={id}>{React.createElement(c)}</div>
			    </Provider>)
			    this.setState({"componentList":comList, selected:id})			   
			}
			pop = () => {
				var comList = [...this.state.componentList];
				comList.pop();
				var poppedComponentId = this.idList.pop();
				

		        if (this.idList.length===0) {
						cm.selectedPopup = null;
						this.setState({"componentList":comList, selected:null})	
						console.log("==========>>"+cm.popupBase)
						browserHistory.replace(cm.popupBase)
						//cm.goBack()
				} else {
					let id = this.idList[this.idList.length-1];
					let cc = document.getElementById(id);
					cc.style.display = "block"
					this.setState({"componentList":comList, selected:id})		
				}
		        cm.dispatch({"type":"AfterPopupPop", "data":poppedComponentId.split("_")[0]})
			}
			componentDidMount() {
				let self = this;
				cm.subscribe( "ClosePopup", ()=>{				
					self.pop();
					cm.popStack()
					if (cm.isStackEmpty()) {
						cm.selectedPopup = null;
						
						browserHistory.replace(cm.popupBase)
						//cm.goBack()
					}
				}, this)
				cm.subscribe("pushPopup", ()=>{		
					if (cm.selectedPopup) {
						this.push(cm.selectedPopup)
					}
				}, this)
				if (cm.selectedPopup) {
					this.push(cm.selectedPopup)
				}
			}
			componentWillUnmount() {
				cm.unsubscribe("ClosePopup");
				cm.unsubscribe("pushPopup");
			}
			

			  render() {
			    return (
			      <div style={{"margin":"20px"}}>				      
				      <div id="stackContainer">
				      	{this.state.componentList}
				      </div>
				  </div>
			    );
			  }
		}
		
		const StackViewContainer = connect(
				  store => {
					    return {
					    	
					    };
					  }
					)(_MyStackViewContainer);
		export default StackViewContainer;