import cm from './CommunicationManager'

//console.log("cm="+cm)
export default class Service {
	constructor(name, APIs) {
		this.name = name;
		this.APIs = APIs;
		//console.log("cm="+cm)
		
		this.registerTypes();
	}
	
	registerTypes() {
		var self = this;

		//console.log("cm="+cm)
		for (var i=0; i<self.APIs.length; i++) {
			let mn = self.APIs[i];
			console.log("subscribe:"+"/"+self.name+"/"+mn)
			cm.subscribe("/"+self.name+"/"+mn, function(action) {
				cm.setProgress(true)
				self[mn].apply(self, [action]);
			});
		}
	}
	
}