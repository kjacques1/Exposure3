import React, {PropTypes} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import muiThemeable from 'material-ui/styles/muiThemeable'

import WebApplication from './Top/WebApplication'
import MobileApplication from './Top/MobileApplication'

class Top extends React.Component {
  static propTypes = {
    userLoggedIn: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {type:'desktop'};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia("(max-width: 550px)").matches ? 'mobile': 'desktop';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    const appBar = this.props.muiTheme.appBar
    const {userLoggedIn = false} = this.props

    return (
      <Toolbar style={{
        backgroundColor: 'lightblue'   
      }}>
        <ToolbarGroup firstChild={true}> 
        
          
        </ToolbarGroup>
        <ToolbarGroup firstChild={true}> 
        <a href="https://www.theparlepodcast.com/accueil.html">
        <img src={require('./favicon4.png')} />
        </a>
          
        </ToolbarGroup>
        <ToolbarGroup >
        <ToolbarTitle  text = "EXPOSURE MAPPING" style={{
            color: 'black',
            fontWeight: 'bold',
            
            
            
          }}/>
        </ToolbarGroup>
        { 
          (this.state.type === 'desktop') 
          ? 
          <WebApplication userLoggedIn={userLoggedIn} /> 
          : 
          <MobileApplication userLoggedIn={userLoggedIn} /> 
        }
      </Toolbar>
    );
  }
}

export default muiThemeable()(Top)