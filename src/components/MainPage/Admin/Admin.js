import { Grid, Row, Col } from 'react-bootstrap';
import React from 'react'
import {connect} from 'react-redux'
import cm from '../../../common/CommunicationManager'
import Header from '../../Header/Header'
import ProviderNavigation from './Provider/Navigation'
import ProviderUserForm from './Provider/PUserForm'
import ProviderUserTable from './Provider/UserTable'
import ProviderGroupForm from './Provider/GroupForm'
import ProviderGroupTable from './Provider/GroupTable'

import EnterpriseNavigation from './Enterprise/Navigation'
import EnterpriseUserForm from './Enterprise/UserForm'
import EnterpriseUserTable from './Enterprise/UserTable'
import EnterpriseGroupForm from './Enterprise/GroupForm'
import EnterpriseGroupTable from './Enterprise/GroupTable'
import style from './Admin.css'


/**
*
*/
class _Admin extends React.Component{
	
	/**
    * render
    * @return {ReactElement} markup
    */
	render(){
		/*var role = this.props.user.role;*/
		
		return (
			<div id = "root">
				<Header/>
				<Grid style = {{"width" : "100%", "height": "100%"}}>
					{/*role==="Provider"?*/}
						<Row>
							<Col sm = {1}>
								<ProviderNavigation/>						
							</Col>
	
							<Col sm = {2} md={11}>
								<div id = "top">
									{this.props.currentPage==="UserAdmin"?<ProviderUserTable/>:this.props.currentPage==="GroupAdmin"?<ProviderGroupTable/>:null}
								</div>
								
								<div id = "bottom">
									{this.props.currentPage==="UserAdmin"?<ProviderUserForm/>:this.props.currentPage==="GroupAdmin"?<ProviderGroupForm/>:null}
								</div>
									
							</Col>
						</Row>	
				</Grid>
			</div>
		)
	}
}

/*			add in after the 1st Row
</Row>
	:role==="Enterprise"?
			<Row>
	<Col sm = {1}>
		<EnterpriseNavigation/>						
	</Col>

	<Col sm = {2} md={11}>
		<div id = "top">
			{this.props.currentPage==="UserAdmin"?<EnterpriseUserTable/>:this.props.currentPage==="GroupAdmin"?<EnterpriseGroupTable/>:null}
		</div>
		
		<div id = "bottom">
		{this.props.currentPage==="UserAdmin"?<EnterpriseUserForm/>:this.props.currentPage==="GroupAdmin"?<EnterpriseGroupForm/>	:null}
		</div>
			
	</Col>

	</Row>:null}
*/
const Admin = connect( //put this on a receiver file not a directing file
		  store => {
			  
			    return {
			    	currentPage: store.AdminReducer.currentPage, //this is for single user or group page
			    	user: store.AdminReducer.user //this means whether to load provider or enterprise page
			    };
			  }
			)(_Admin);
export default Admin

