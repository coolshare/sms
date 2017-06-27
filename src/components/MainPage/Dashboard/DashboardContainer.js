import React from 'react';
import {connect} from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap';
import ResouceUsageGadget from './ResouceUsage/ResouceUsageGadget'
import ENGListGadget from './ENGList/ENGListGadget'
import ENGAlertsGadget from './ENGAlerts/ENGAlertsGadget'
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
			      	<ResouceUsageGadget/>
			      </Col>
			      <Col xs={6} md={6}>
			      	<ENGListGadget/>
			      </Col>
			    </Row>
			    <Row className="show-grid">
			      <Col xs={6} md={6}>
			      	<ENGAlertsGadget/>
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