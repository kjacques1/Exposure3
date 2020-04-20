import React, {Component} from 'react'

import {connect} from 'react-redux'
import {Link} from 'react-router'

import {signout} from '../../actions/signout'

import FontIcon from 'material-ui/FontIcon'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'


import muiThemeable from 'material-ui/styles/muiThemeable'

class LoggedInMenu extends Component {
  render() {
    const appBar = this.props.muiTheme.appBar
    return (
      <IconMenu
        iconStyle={{color: 'black', fontWeight: 'bold'}}
        iconButtonElement={
          <FontIcon className="material-icons" 
          >menu</FontIcon>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Welcome" containerElement={<Link to="/Welcome" />} />
        <MenuItem primaryText="Log out" onClick={this.props.onSignout} />
        <MenuItem primaryText="Admin"  />
        <MenuItem primaryText="About"  />
        <MenuItem primaryText="Links"  />
      </IconMenu>
    )    
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignout: () => {
      dispatch(signout())
    }
  }
}
export default connect(
  null,
  mapDispatchToProps
)(muiThemeable()(LoggedInMenu))