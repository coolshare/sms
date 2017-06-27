React-Redux Patterns
========================

By Mark Qian 6/2017 (markqian@hotmail.com)

<b>A. The demo page:</b> 

http://coolshare.com/ReactReduxPattern

<b>B. Description:</b>

This package is designed to get you up and running as a comprehensive web application.
Another major goal of this package is to illustrate commonly used patterns in a React application.
I will first focus on some of the patterns I introduced for my own usage in my projects at work.
Then I will list some commonly used ones. The patterns introduced and used by me:

 - <b>Store Customization</b><br>
   <b>Problem</b>: Access to the store and store related methods from anywhere is not easy and using many store related methods as-is does not meet our need. 
   For example, we need a dispatch with callback but the as-is dispatch of Redux store
   does not provide that. We need a global access point to access store and store related methods.<br/><br/> 
   <b>Solution</b>: Creating a singleton wrapper instance that can be accessed globally. It holds the reference of Redux store and the wrapper of 
   store related methods that satisfies custom need. Here is how to access store anywhere:<br/> 
   
   ```
     import cs from "./services/CommunicationManager";
   
      cs.getStoreValue("MyReducer", "myVar");
      cs.dispatch({"type":"myType", ...}, myCallback); //custom callback that will be described below
      cs.subscribe("myType", handler);     
   ```
   <br/>See code details at <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/services/CommunicationService.js">/services/CommunicationService.js</a> and <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/index.js">/index.js</a>. 
   The CommunicationService will do a lot more that I will describe below. 
  
 - <b>Dispatch with callback</b><br>
   <b>Problem</b>: dispatch of Redux store does not allow callback. This is not convenient since you sometimes want to write the handler in the same place
   of dispatching instead of somewhere else such as in a reducer.<br/><br/> 
   <b>Solution</b>: one key issue with this is that the callback has to be invoked after every handler including reduces and subscribers is done their jobs.
   So my approach is to trigger an asynchronous dispatch in a middleware and the asynchronous dispatching is picked up in the next round of event process in
   a common reducer where the callback is invoked. Here is the way to use it:<br/>
```
          cs.dispatch({"MyType", "data":"mydata"}, action=> {
        	//handle callback here
        })
        
 ```
   See code details at <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/services/CommunicationService.js">/services/CommunicationService.js</a>,  <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/CommonReducer.js">/components/CommonReducer.js</a> and <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/CommonMiddleware.js">/components/CommonMiddleware.js</a>. 
   
 - <b>Popup Stack</b><br>
   <b>Problem</b>: This is not a React specific issue. In your application, in many case to achieve a better user experience, you need to allow users 
   to jump into another point in the component hierarchy. If you simply route (deep linking programmatically or allow user to jump by clicking in some case) 
   to the point you may lost the current stay. The use may totally get lost after they finish the job in current stack level. So you need a state "Stack". 
   <br/>
   Another issue you face is that if what you popup is an general component, there could be another "short-cut" link/button pointing to another component. 
   You better not use modal dialog since it may result multi-level modal dialogs, a bad UI behave.<br/><br/> 
   <b>Solution</b>: I built a component/container, "StackViewContainer". It keeps all level of the stack "modal" so that users have to close all the popups to
   return when "drilling down" or jumping around. In the running demo, try it out by clicking link "React Patterns" at the top and click at "Popup Pattern" on the 
   left menu which links to an arbitrary component, "Housing Info". This "Housing Info" is "modal" since it hides everything behind but you do not feel it as
   a dialog but a full page at top of the previous page. Next you can popup more by clicking "Trading Info" at the top-right. You can not go nowhere except 
   clicking at "X" button to return. See code details at <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/StackViewContainer.js">/components/StackViewContainer.js</a>. Invocation is easy as
   
   ```
       cs.popup(MyComponent, "MyComponent");
   ```
   
- <b>Wrapper for Redux</b><br>
   <b>Problem</b>: Redux does a simple pub/sub. All the reducers and subscribers will be invoke for any dispatching (This is really not efficient at all. I am wondering
   why they don't use type to map the listeners so that not all the listeners are called for each single action dispatching). 
   So you have to place if statement in all the subscribers to only let the corresponding invocation through. Another issue with Redux built-in subscribe is that
   there is access to action handily and LastAction may not available all the time.<br/><br/>
   <b>Solution</b>: I wrote a wrapper, "subscribe" to hide the filtering within the wrapper and inject the action as a parameter. So you can simply subscribe as :<br/><br/>
   ```
      cs.subscribe("myType", action=>{
      	//handling here
      });
   ```
   Unsubscribe is also wrap so that you don't need to save the function reference return by subscribe. Just:
   ```
       cs.unsubscribe("myType");
   ```
    
   See code details at <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/services/CommunicationService.js">/services/CommunicationService.js</a>;<br/>
   Actually, cs.dispatch is another example of wrapper.   
   
- <b>Dispatch as pub/sub</b><br>
   <b>Problem</b>: In some case, you want to handle a dispatching in a variety of places/components instead of reducers, or you simply need a pub/sub communication that has nothing to do
   with saving anything in the store: you only want to let other parties know something happen (with data). But Redux's dispatch only deal with reducers and Redux never upates variables like 
   LastAction when Redux can not find a reducer. So you can not even identify that a dispatching is sent to whom in a subscriber (listener) since the action is never saved anywhere.
 of action. <br/><br/> 
   <b>Solution</b>: I add a middleware to collect the action before all the listeners are invoked and then use the collected action in the listeners. In this way, you can handle a dispatched action anywhere out side reducer.
   
- <b>Dispatch and subscribe in HTML</b><br>
   <b>Problem</b>: Don't you feel so annoy about that you always need to write handlers to deal with users activity. In many cases, you really just like to trigger a dispatch with simple data
   or without data: you simply don't want to write a handler!<br/><br/> 
   <b>Solution</b>: I introduced two simple components to do communication in HTML: 
  - <b>Dispatcher</b><br/>
   		Dispatcher allows you to dispatch an action when wrapped element(its child element) is interacted by user like clicking:<br/><br/> 
   		
    An input dispatch "test1" on "onChange":<br/>     
              ```
                 <Dispatcher action={{"type":"test1"}} event="Change"> <input type="text"/></Dispatcher>
              ```
<br/> <br/>where the value of input will be delivered as the ation.data. Additionally, if you want to set a specific field in the Redux state, you can do it as the following<br/><br/> 
   			
    An input dispatch "test1" on "onChange" to set to field "test1" for action type "pubsubTest":    

        <Dispatcher action={{"type":"test1"}} event="Change" setState="pubsubTest.test1"><input type="text"/></Dispatcher>
   	
	<br/><br/>  
  - <b>Subscriber</b><br/>
   		Subscriber allows you to subscribe an action "type" to receive an action and set action.data as value of its child element (the input):<br/><br/> 
   	
   			A Input subscribes actionType "test2":<Subscriber ActionType="test2"><input/></Subscriber>
   			where ation.data will be set as the value of input. You can also specify what specific field you like to set to the subscribed element (the input).
   		
   	To try this demo yourself, just select "React Patterns" at the top link. Than, select "Pubsub Pattern" at the left and have fun!
   	See code details at <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/common/Dispatcher.js">/common/Dispatcher.js</a>, <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/common/Subscriber.js">/common/Subscriber.js</a>, <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/Patterns/RightPane/Pubsub/PubsubComponent.js">/components/Patterns/RightPane/Pubsub/PubsubComponent.js</a><br/>	 
   
- <b>Pub/sub Pattern</b><br> 
  <b>Problem</b>: the major communication in Redux is that one party dispatches an action and listeners (reducers) receive the action and process it to impact views.
  But in a complicate application, you sometimes need more handy ways to communicate with other parties. For example, you want to simple publish (dispatch in term of Redux) a topic 
  (action in term of Redux) to subscribers (reducers in term of Redux) in JSX-html instead of defining a handler to dispatch for an UI activity. Or like I discuss in the previous
  item above, "you only want to let other parties know something happen (with data)" and there is no synchronized impact to the views yet, meaning that the result of the dispatching
  may not need reducers.<br/><br/> 
  <b>Solution</b>: I introduced a toolkit, <a href="https://github.com/coolshare/CoolshareReactPubSub" target=_blank>CoolshareReactPubSub</a>.<br/><br/> 
  You can publish in html like<br/><br/>
  ```
	  render() {
	      return (
	        <div>
	           <Publisher topic="/left/button"><button>Left</button></Publisher>
	           <Publisher topic="/left/Publish"><a href="#" className="ddd">aaaa</a></Publisher>
	           <Publisher topic="/left/Publish" event="Change" options="{'name':'Mark', 'address':'123 Main Ave San Jose, CA'}">
	             <select>
	               <option value="a">A</option>
	               <option value="b">B</option>
	             </select>
	           </Publisher>
	      	   <Publisher topic="/left/Publish">
	      	     <MyComponentC/>
	      	   </Publisher>
	      </div>  
	    );
	  }
  ```
<br/>
And subscribe in html like<br/>

```
    <Subscriber topic="/right/text" field="innerHTML" optionField="text"><p/></Subscriber>
```
<br/><br/>

/**** here are some commonly used ones***/


 - <b>React patterns</b>. the following patterns are used in the application
 
   1). <b>Container/Component</b>. It is used under /components/Patterns: all the components under this directory are written with this pattern.<br/>
<br/>See details in <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/Patterns/RightPane/Photo/PhotoComponent.js">/components/Patterns/RightPane/Photo/PhotoComponent.js</a> and <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/Patterns/RightPane/Photo/PhotoContainer.js">/components/Patterns/RightPane/Photo/PhotoContainer.js</a><br/><br/>
   	    
   2). <b>State hoisting and Stateless function (pure function)</b>: Events are changes in state. Their data needs to be passed to stateful container components parents. Example (in VideoContainer.js and VideoComponent.js):
   
	   The event handler resides in VideoContainer and VideoComponent hoists the data entered by users to
	   VideoContainer:
	   
	   class _VideoContainer extends React.Component {
	   		handlePeriod(s) {
				...		
			}
			render() {
				...
			    return (
	   				< VideoComponent  handlePeriod={this.handlePeriod.bind(this)}}... />
	   				...
	   			}
	   		} 
    	export default class VideoComponent extends React.Component{
    		render() {
			  	...
	    		return (
	      			<select onChange={(e)=>this.props.handlePeriod(e.target.value)}>
						...
	        		</select>
	        	}
	       }
    	}
   and VideoComponent is a stateless "function".
<br/>See details in <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/Patterns/RightPane/Video/VideoComponent.js">/components/Patterns/RightPane/Video/VideoComponent.js</a> and <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/Patterns/RightPane/Video/VideoContainer.js">/components/Patterns/RightPane/Video/VideoContainer.js</a><br/><br/>
   3). <b>conditional rendering</b>. The is an alternative of routing to show different content/page. Example (in MapContainer.js):
   
		class _MapContainer extends Component {
			...
			render() {
			    return (
			    	...
				    	{(this.props.currentMap==="GoogleMap") && <div><center><div>Some bus stops in SF</div></center><GoogleMapContainer style={{"minHeight":"400px"}}/></div>}
				    	{(this.props.currentMap==="MapBox") && <MapBoxContainer style={{"minHeight":"400px"}}/>}				    				...
			    )
			}
		}
	
		const MapContainer = connect(
				  store => {
					    return {
					    	currentMap: store.MapContainerReducer.currentMap
					    };
					  }
					)(_MapContainer);
		export default MapContainer
		
<br/>See details in <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/MainPage/Maps/MapContainer.js">/components/MainPage/Maps/MapContainer.js</a> <br/><br/>
   4).<b>Render Callbacks</b>: a function passed as a prop to a component, which allows that component to render something<br/>
   		A common use-case of a render callback was to allow a child to render something using data it did not receive in props.
   	Example (RightPane.js)
   	
   	    function ChildPane(children) {
	       return children(id)
        }
   		class _RightPane extends React.Component{
			render(){
				let ChildPane = ({ children  }) => children (this.props.currentPage)
				return (
					 <div>
					 	<ChildPane>
					 		{id=>id==="TodoList"?<TodoList/>:id==="HousingInfo"?<HousingInfo/>:null}
					 	</ChildPane>
					 </div>
				)
			}
		}

The goal of this _RightPane is to display <TodoList/> or <HousingInfo/> according this.props.currentPage passed by the parent container (<FormTableContainer>). We first declare ChildPane as a "function" which access another function (children) as parameter and then invoke the function(children passed as parameter) inside ChildPane. ChildPane is used in the render content where Children receives its function parameter (children) as 
		{id=>id==="TodoList"?<TodoList/>:id==="HousingInfo"?<HousingInfo/>:null}
Then this function is invoke as

        children (this.props.currentPage)
        
where id above is this.props.currentPage. What is good on this pattern? The benefit is that ChildPane can be used somewhere else with different content instead of "{id=>id==="TodoList"?<TodoList/>:id==="HousingInfo"?<HousingInfo/>:null}" with the "this.props.currentPag" built-in like a closure.
<br/>See details in <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/MainPage/FormTable/RightPane.js">/components/MainPage/FormTable/RightPane.js</a> <br/><br/>
 5).<b>Proxy Component</b>: Wrapping a component with attributes and reuse it.
   
   Example (in TodoList.js)
   
    const Td = props => <td style={{"width":"33%", "border": "1px solid black"}} {...props}/>
		
    class _TodoList extends React.Component{
       ...
        render(){
          ...
            return (		                                    
                <tr  key={index} style={{"background":"#FFF"}}>
                <Td>{todo.id}</Td>
                <Td>{todo.text}</Td>
                <Td> <input style={{"marginLeft":"10px"}} 
                  ...
	   			
        }
    }
<br/>See details in <a target=_blank href="https://github.com/coolshare/ReactReduxPattern/blob/master/src/components/MainPage/FormTable/TodoList/TodoList.js">/components/MainPage/FormTable/TodoList/TodoList.js</a> <br/><br/> 			

<h4>The third party software used in the package:</h4>   		
 - <b>Basic function/feature</b> of Redux: connect of React-redux, middleware, dispatching actions, subscription and so on. 
   This kit uses a pure Redux pattern in the area communication and view update so no "setState" is used except local    
   state like input content state impact button enable state. 

 - <b>Other</b> the 3nd-party lib are used included:
 
   mapbox-gl, googlemap, react-data-grid, infinite-tree, react-image-gallery, react-tabs, react-youtube 
 
   
<b>C. Instructions for installation</b>

1. download the zip file of this package and unzip it to, say c:\ReactReduxPattern<br/>
   or simply run the following<br/>
   
      cd c:\
      git clone https://github.com/coolshare/ReactReduxPattern.git ReactReduxPattern<br/>
      
2. install environment

      cd c:\ReactReduxPattern<br/>
      npm install
      
3. run the application

      npm start
      
4. build a production version

      webpack -p
      
      
   
Go Mark's home page http://MarkQian.com to see more.