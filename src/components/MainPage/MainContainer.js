import React from 'react';
import {connect} from 'react-redux'
import DashboardContainer from './Dashboard/DashboardContainer'
//import cm from '../../common/CommunicationManager'

/**
*
*/
class _MainContainer extends React.Component{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div id="MainContainer">	
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