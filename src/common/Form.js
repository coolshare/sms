import React, { Component } from 'react';

export default class Form extends React.Component {
	constructor() {
		super();
		this.fields = {};
	}

	collectFields = (e) => {
		e.preventDefault();
		var data = {};
		
		for (var f in this.fields) {
			data[f] = this.fields[f].value			
		}
		data.id = new Date().valueOf();
		return data;
	}
	
	load = (data) => {
		for (var f in data) {
			var field = this.fields[f];
			if (field===undefined || field.type==="file") {
				continue;
			}
			field.value = data[f];	
				
		}
		
	}


	render() {

	    return null;
	}
}

