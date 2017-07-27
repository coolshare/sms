import React from 'react';
import cm from '../common/CommunicationManager'

/**
*
*/
export default class TopContainer extends React.Component{
	componentDidMount() {
		console.log("======>fetch all enterprise")
		cm.dispatch({"type":"/EnterpriseService/getAll", "options":{"response":(data)=>{
			console.log("======>get all enterprise")
				cm.dispatch({"type":"setEnterpriseList", "data":data})
				}
			}})
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div>				
				<div id="top">	
					{this.props.children}
	      		</div>
      		</div>
		)
	}
}