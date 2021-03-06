import React from 'react';
import {connect} from 'react-redux'
import Dispatcher from '../../../../common/Dispatcher'
import Header from '../../../Header/Header'
import cm from '../../../../common/CommunicationManager'

/**
*
*/
class _ENGListDetails extends React.Component{
	
	handleClick=() => {
		cm.dispatch({"type":"/RemoteService/getThroughProxy", "data":{"url":"http://coolshare.com/markqian/AngularJS/Directives/RoutedTab/data/House.json"}, "options":{"response":function(data) {
			console.log(JSON.stringify(data))
		}}})
	}
	componentDidMount() {
		cm.subscribe("/RemoteService/getThroughProxy/done", function(data) {
			//console.log(JSON.stringify(data))
		})
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div>	
				<div>
					<Dispatcher action={{"type":"/RemoteService/getThroughProxy", "data":{"url":"http://coolshare.com/markqian/AngularJS/Directives/RoutedTab/data/House.json"}}}><span style={{"cursor":"pointer"}}>ENGListDetails</span></Dispatcher>
				</div>
				<div><span onClick={this.handleClick}>Test</span></div>
      		</div>
		)
	}
}

const ENGListDetails = connect(
		  store => {
			    return {
			    };
			  }
			)(_ENGListDetails);
export default ENGListDetails