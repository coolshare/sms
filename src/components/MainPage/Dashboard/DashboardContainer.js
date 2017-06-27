import React from 'react';
import {connect} from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap';
import ResouceUsageContainer from './ResouceUsage/ResouceUsageContainer'
import ENGListContainer from './ENGList/ENGListContainer'
import ENGAlertsContainer from './ENGAlerts/ENGAlertsContainer'
//import cs from '../../services/CommunicationService'

/**
*
*/
class _DashboardContainer extends React.Component{
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		return (
			<div id="DashboardContainer">	
			<Grid bsClass="gridContainer">
				<Row className="show-grid">
			      <Col xs={6} md={6}>
			      	<ResouceUsageContainer/>
			      </Col>
			      <Col xs={6} md={6}>
			      	<ENGListContainer/>
			      </Col>
			    </Row>
			    <Row className="show-grid">
			      <Col xs={6} md={6}>
			      	<ENGAlertsContainer/>
			      </Col>

			    </Row>
		</Grid>
      		</div>
		)
	}
}

const DashboardContainer = connect(
		  store => {
			    return {
			    };
			  }
			)(_DashboardContainer);
export default DashboardContainer