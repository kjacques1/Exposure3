import React, {PropTypes} from 'react'

import FlatButton from 'material-ui/FlatButton'
import {ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar'
import muiThemeable from 'material-ui/styles/muiThemeable'

import {Link} from 'react-router'
import { withRouter } from 'react-router'

import LoggedInMenu from '../../boxes/Top/LoggedInMenu'
import {getMenuStyle} from './utils'

const WebApplication = (props) => {
  const appBar = props.muiTheme.appBar
  const pathname = (props.location && props.location.pathname) ? props.location.pathname : '';
  const {userLoggedIn = false} = props

  return (
      userLoggedIn
      ?    
      <ToolbarGroup>
        <ToolbarSeparator />
        <FlatButton style={{fontWeight: 'bold'}} 
          label="Mapping" 
          containerElement={<Link to="/tracker"/>}  
           />
        <FlatButton style={{fontWeight: 'bold'}} 
          label="Reports" 
          containerElement={<Link to="/report"/>}  
           />
           <a href="https://translate.google.ca/">
           <img src={require('./translate3.png')} />
           </a>
           
           
        <ToolbarSeparator/>
        <LoggedInMenu iconStyle={{
          color: 'lightblue'
        }}/>
      </ToolbarGroup>
      :
      <ToolbarGroup>  
        <FlatButton 
          label="Login" 
          style={getMenuStyle(appBar, pathname, '/login')} 
          containerElement={<Link to="/login"/>} 
        />
        <FlatButton 
          label="Register" 
          style={getMenuStyle(appBar, pathname, '/register')} 
          containerElement={<Link to="/register"/>} 
        />
      </ToolbarGroup>    
)}

WebApplication.propTypes = {
  userLoggedIn: PropTypes.bool
}

export default muiThemeable()(withRouter(WebApplication))