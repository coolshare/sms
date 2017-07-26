import React from 'react'
import {connect} from 'react-redux'
import cm from '../../../../common/CommunicationManager'
import style from './UserForm.css'
/**
*
*/
export default class GroupForm extends React.Component{
	
	/**
    * render
    * @return {ReactElement} markup
    */
	
	myDrop() {
	     document.getElementById("myDropdown").classList.toggle("show");
	}
	
	
	
	alertMessage() {
		alert("hey there");
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

		
		return (
			
			<div>
				<body> 
				
				<div className="infoDiv">
					<div className="infoHeader"><center><h3>User Information</h3></center></div>
					<form name = "info" action = "" method = "post">
							{/* User */}
							<label className="properties">Username:
								<input name="Username" ref={(input)=>{this.propertiess["Username"] = input}}  type="text" tabIndex="1" placeholder="gagw" style={{"width":"200px"}} />
				            </label>
							
			
							{/* Pass */}
							<label className="properties">Password:
								<input name="Password" ref={(input)=>{this.propertiess["Password"] = input}}  type="text" tabIndex="1" placeholder="*******" style={{"width":"200px"}} />
				            </label>
							
							{/* Group (figure out dropdown later) */}
							<label className="properties">Group:
								<input name="Group" ref={(input)=>{this.propertiess["Group"] = input}}  type="text" tabIndex="1" placeholder="SuperUser" style={{"width":"200px"}} />
				            </label>
							
							
							{/* Name */}
							<label className="properties">Name:
								<input name="Name" ref={(input)=>{this.propertiess["Name"] = input}}  type="text" tabIndex="1" placeholder="Jack Paul" style={{"width":"200px"}} />
				            </label>
							
							{/* Number */}
							<label className="properties">Number:
								<input name="Number" ref={(input)=>{this.propertiess["Number"] = input}}  type="text" tabIndex="1" placeholder="3016772828" style={{"width":"200px"}} />
				            </label>
						
							<label style = {{"margin-left" : "280px"}}>
								<button onClick={this.handleCancel.bind(this)} style={{"marginTop":"10px", "float":"right"}}>Cancel</button>
								<button type="submit" style={{"marginTop":"10px", "marginRight":"10px", "float":"right", "width":"60px"}}>OK</button>
								
							</label>
						</form>
					</div>
				</body>
		</div>
					
				
		)
	}
}

