import React, {Component, PropTypes} from 'react'

import {toAmPm} from '../utils/time'

import {TableRow, TableRowColumn} from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import FlatButton  from 'material-ui/FlatButton'


import LangButtonBox from './LangButtonBox'

class TimeRowElement extends Component {
  static propTypes = {
    uid: PropTypes.string,
    id: PropTypes.string,
    text: PropTypes.string,
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date),
    langId: PropTypes.string,
    onCreateLang: PropTypes.func,
    onSelectLang: PropTypes.func
  }

  componentWillMount() {
    this.setState({
      text: this.props.text
    })   
  }

  handleRemove = () => {
    this.props.onRemove(this.props.uid, this.props.id)
  }

  handleChangeText = (e) => {
    this.setState({
      text: e.target.value
    })
  }

  handleCreateLang = (langName, color) => {
    this.props.onCreateLang(this.props.uid, this.props.id, langName, color)
  }

  handleSelectLang = (langId) => {
    this.props.onSelectLang(this.props.uid, this.props.id, langId)
  }

  render() {
    return(
      <TableRow>
        <TableRowColumn style={{fontWeight: 'bold'}} >
          <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
            <TextField
              id='text'
              name='text'
              value={this.state.text}
              onChange={this.handleChangeText}
              underlineShow={false}
            />
          </div>
        </TableRowColumn>
        <TableRowColumn style={{fontWeight: 'bold'}} >{toAmPm(this.props.startTime)} :: {toAmPm(this.props.endTime)}</TableRowColumn>
        <TableRowColumn>
          <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
            <LangButtonBox 
              onCreateLang={this.props.onCreateLang} 
              onSelectLang={this.props.onSelectLang} 
              langId={this.props.langId}
            />            
          </div>        
        </TableRowColumn>
        
        <TableRowColumn style={{fontWeight: 'bold'}} > 
          <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <FlatButton 
                label="Remove" 
                
              onClick={this.handleRemove}
            />
            <FlatButton
                label="Edit" 
                
              
            />
          </div>
        </TableRowColumn>
      </TableRow>
    )
  }
}

export default TimeRowElement