import React from 'react'
import {connect} from 'react-redux'
import cm from '../../../../common/CommunicationManager'
import style from './PUserForm.css'
import Form from '../../../../common/Form'
/**
*
*/
class _PUserForm extends Form{
	
	/**
    * render
    * @return {ReactElement} markup
    */
	
	myDrop() {
	     document.getElementById("myDropdown").classList.toggle("show");
	}
	
	
	handleOK = (e) => {
		e.preventDefault();
		var data = {};
		
		for (var f in this.fields) {
			data[f] = this.fields[f].value			
		}
		data.id = new Date().valueOf();
		cm.dispatch({"type":"ClosePopup"})
		setTimeout(function() {
			cm.dispatch({"type":"addEnterprise", "data":new Enterprise(data, 20, 100+60*cm.getStoreValue("OrchestrationReducer", "counter")[0], 100 , 35, 0, "#E1E1E1", -8, -8, 16, 16)})
		}, 100)
		
		
	}
	handleCancel = (e) => {
		e.preventDefault();
		cm.dispatch({"type":"ClosePopup"})
	}
	
	componentDidUpdate() {
		
		this.load(this.selectedRow)
	}
	/*
	this.onClick = function(event) {
		  if (!event.target.matches('.dropbtn')) {

		    var dropdowns = document.getElementsByClassName("dropdown-content");
		    var i;
		    for (i = 0; i < dropdowns.length; i++) {
		      var openDropdown = dropdowns[i];
		      if (openDropdown.classList.contains('show')) {
		        openDropdown.classList.remove('show');
		      }
		    }
		  }
		}
	
	{ Dropdown }
					<div class = "dropdown"> 
							<button onclick = {this.myDrop} class = "dropbtn">Companies</button>
								<div id = "myDropdown" class = "dropdown-content">
									<a href = "#burgerking"> BurgerKing </a>
									<a href = "#AT&T"> AT&T </a>
									<a href = "#Walmart"> Walmart </a>
								</div>
									
					</div>
	 */
	
	
	render(){
		var self = this;
	
		this.selectedRow = this.props.selectedRow ||{}//variable here could also be anything

		return (
				<div className="botSide">
					<center><h3 className = "pInfoHeader">User Information</h3></center>
					<form onSubmit={ (e) => this.handleOK(e) } >
			      		<label className="field"  style={{'margin':'10px','width':'450px'}}>Business Name:
							<input name="Name" defaultValue={self.selectedRow.Name} ref={(input)=>{this.fields["Name"] = input}}  type="text" tabIndex="1"/>
			            </label>
			            <label className="field"   style={{'margin':'10px','width':'450px'}}>Group:
							<input name="Group" defaultValue={self.selectedRow.Group} ref={(input)=>{this.fields["Group"] = input}} type="text" tabIndex="2" />
			            </label>
							<label className="field"  style={{'margin':'10px','width':'450px'}}>Phone:
							<input name="Phone" defaultValue={self.selectedRow.Phone} ref={(input)=>{this.fields["Phone"] = input}} type="text" tabIndex="1" style={{"width":"200px"}}/>
			            </label>
			            <label className="field"   style={{'margin':'10px','width':'450px'}}>Email:
							<input name="Email" defaultValue={self.selectedRow.Email} ref={(input)=>{this.fields["Email"] = input}} type="emal" tabIndex="2" style={{"width":"200px"}}/>
			            </label>
							
			            <label className="field" style={{'margin':'10px','width':'450px'}}>Address:
							<input name="Address" defaultValue={self.selectedRow.Address}  ref={(input)=>{this.fields["Address"] = input}}  type="text" tabIndex="2" style={{"width":"200px"}} />
			            </label>
						<label style = {{"marginLeft" : "280px"}}>
							<button onClick={this.handleCancel.bind(this)} style={{"marginTop":"10px", "float":"right"}}>Cancel</button>
							<button type="submit" style={{"marginTop":"10px", "marginRight":"10px", "float":"right", "width":"60px"}}>OK</button>
							
						</label>
					</form>
				</div>		
		)
	}
}
const PUserForm = connect( //put this on a receiver file not a directing file
		  store => {
			    return {
			    	selectedRow: store.AdminReducer.selectedRow, //the row picked to fill the form (first variable can be anything actually)
			    };
			  }
			)(_PUserForm);
export default PUserForm

