import React from 'react';
import {connect} from 'react-redux'
import DashboardContainer from './Dashboard/DashboardContainer'
import cm from '../../common/CommunicationManager'

/**
*
*/
class _MainContainer extends React.Component{
	componentDidMount() {
		cm.dispatch({"type":"updateMainContainerSize", "data":{"w":this.mainContainer.clientWidth, "h":this.mainContainer.clientHeight}})
	}
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div ref = {(input) => { this.mainContainer = input; }}>	
				<DashboardContainer/>
      		</div>
		)
	}
}

const MainContainer = connect(
		  store => {
			    return {
			    };
			  }
			)(_MainContainer);
export default MainContainer