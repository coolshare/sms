import React from 'react'
import cs from '../common/CommunicationManager'

export class PopupCloseBox extends React.Component {
	
	render () {
		return (
			<span style={{"marginTop":"10px","marginRight":"10px","float":"right","cursor":"pointer", "backgroundColor":"#E1E1E1", "paddingLeft":"2px","lineHeight":"16px","width":"14px","height":"16px","border": "1px solid #000"}} onClick={()=>cs.dispatch({"type":"ClosePopup"})}>X</span>
		)
	}

} 