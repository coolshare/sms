import React from 'react'
import YouTube from 'react-youtube';
/**
*
*/
export default class VideoComponent extends React.Component{
	
	constructor(props) {
	    super(props);
	    this.state = {
	  	      player: null,
	  	      autoSwitch:true
	  	    };

	  }
	
	  onReady = (event) => {
	    //console.log(`YouTube Player object for videoId: "${this.state.videoId}" has been saved to state.`); // eslint-disable-line
	    this.setState({
	      player: event.target,
	    });
	  }

	  onPlayVideo = (event) => {
	    this.state.player.playVideo();
	  }

	  onPauseVideo = (event) => {
	    this.state.player.pauseVideo();
	  }

	  onNextVideo = (event) => {
		  this.props.showNext(1);
	  }
	  
	  onPreVideo = (event) => {
		  this.props.showNext(-1);
	  }
	  onStayVideo = (event) => {
		  if (this.state.autoSwitch===true) {
			  this.props.stopTimer();
		  } else {
			  this.props.resumeTimer();
		  }
		  this.setState(Object.assign({}, this.state, {
			  autoSwitch: !this.state.autoSwitch
	        })) 
	  }
	  
	  render() {
		  const opts = {
			      height: '390',
			      width: '640',
			      playerVars: { // https://developers.google.com/youtube/player_parameters
			        autoplay: 1
			      }
		  };
		  if (this.props.currentVideo===undefined) {
			  return null
		  }
	    return (
	      <div>
		     <div style={{"margin":"5px"}}>
	    		<input placeholder="Search Videos" onKeyPress={e=>{if (e.key==='Enter') {this.props.handleSearch(e.target.value);e.target.value=""}}}/>
	    	</div>
	        <YouTube videoId={this.props.currentVideo.id} onReady={this.onReady} opts={opts}/>
	        <br/>
	        <button onClick={this.onPreVideo}>Previous Video</button>
	        <button onClick={this.onPlayVideo}>Play</button>
	        <button onClick={this.onPauseVideo}>Pause</button>
	        <button onClick={this.onNextVideo}>Next Video</button>
	        <br/>
	        <button onClick={this.onStayVideo}>{this.state.autoSwitch?"Stay Current Video":"Resume Auto Switch Video"}</button>
	        <label style={{"marginTop":"7px", "marginLeft":"7px"}}>Switch period:<select onChange={(e)=>this.props.handlePeriod(e.target.value)}>
	        	<option value="20000">20 second</option>
	        	<option value="300000">30 second</option>
	        	<option value="60000">1 minute</option>
	        	<option value="300000">5 minute</option>
	        	<option value="whole">Whole video</option>
	        </select></label>
	      </div>
	    );
	  }
	}