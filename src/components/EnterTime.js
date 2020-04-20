import React, {Component, PropTypes} from 'react'

import {getTimeDuration, toAmPm} from '../utils/time'

import {red500} from 'material-ui/styles/colors'

import LangButtonBox from './LangButtonBox'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton  from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import TextField from 'material-ui/TextField'
import LinearProgress from 'material-ui/LinearProgress'
import Snackbar from 'material-ui/Snackbar'

export class EnterTime extends Component {
  static propTypes = {
    text: PropTypes.string,
    duration: PropTypes.string,
    langId: PropTypes.string,
    onChangeText: PropTypes.func,    
    onOpenDialog: PropTypes.func,
    onStop: PropTypes.func,
    onRemove: PropTypes.func,
    onStart: PropTypes.func,
    onCreateLang: PropTypes.func,
    onSelectLang: PropTypes.func,
    isFetching: PropTypes.bool,
    removedSuccess: PropTypes.bool,
  }

  static defaultProps = {
    text: '',//having default value so the input is controlled element
    isFetching: false,
    removedSuccess: false
  }

  constructor (props) {
    super(props)

    const startTime = props.startTime ? new Date(props.startTime) : null
    const startTimeAmPm = props.startTime ? toAmPm(startTime) : null

    this.state = {
      startTime: startTime,
      startTimeAmPm: startTimeAmPm,
      duration: null,      
      text: props.text ? props.text : '',
      timerId: null,
      langId: props.langId ? props.langId : null,
      changeTextSubmitTimeoutId: null
    }

  }

  componentWillMount() {
    this.startTicking()
  }

  componentWillUnmount() {
    this.stopTicking()
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.startTime) {
      const startTime =  new Date(nextProps.startTime)
      const startTimeAmPm = toAmPm(startTime)
      let nextState = {
        startTime: startTime,
        startTimeAmPm: startTimeAmPm
      }
      if (nextProps.text) {
        nextState.text = nextProps.text
      }
      this.setState(nextState, function(){
        this.stopTicking()
        this.startTicking()
      })
    } else {
      this.stopTicking()
      this.setState({
        text: '',
        startTime: null,
        duration: null
      })
    }
    if ('langId' in nextProps) {
      this.setState({
        langId: nextProps.langId
      })
    }
  }

  stopTicking = () => {
    //clear previous timer if any
    if (this.state.timerId) {
      clearInterval(this.state.timerId)
      this.setState({timerId: null})
    }
  }

  startTicking = () => {
    if (this.state.startTime) {
      const updateDuration = () => {
        const now = new Date()        
        this.setState({
          duration: getTimeDuration(this.state.startTime, now)
        })
      }

      updateDuration()
      //setup new timer to show duration
      let timerId = setInterval(()=>{
        updateDuration()
      }, 1000)

      this.setState({
        timerId: timerId
      })      
    }    
  }

  handleChangeText = (e) => {    
    const text = e.target.value
    this.setState({
      text: text
    })

    if (this.state.startTime) {
      if (this.state.changeTextSubmitTimeoutId) {
        clearTimeout(this.state.changeTextSubmitTimeoutId)
      }

      const timeout = setTimeout(() => {
        this.props.onChangeText(this.state.text)    
      }, 1000)
      this.setState({
        changeTextSubmitTimeoutId: timeout
      })
      
    }
  }

  //Enter then start tracking
  handleKeyPress = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      if (this.state.startTime) {
        return
      }

      if (this.state.text !== '') {
        this.props.onStart(this.state.text)
      }
    }
  }

  handleStart = (e) => {
    e.preventDefault()
    this.props.onStart(this.state.text, this.state.langId)
  }

  handleSelectLang = (langId) => {
    if (this.props.startTime) {
      this.props.onSelectLang(langId)
    } else {
      this.setState({langId})
    }    
  }

  render() {
    return (
      <div className="time-entry-input-form">
        <TextField
          hintText="Map here"
          value={this.state.text}
          onChange={this.handleChangeText}
          onKeyPress={this.handleKeyPress}
          id="text"
          name="text"
        />
        <LangButtonBox 
          onCreateLang={this.props.onCreateLang} 
          onSelectLang={this.handleSelectLang} 
          langId={this.state.langId} 
        />
        <span 
          onClick={this.props.onOpenDialog}
          style={{
            marginLeft: 20,
            minWidth: 56,
            display: 'inline-block'
          }}
        >
          {this.state.duration ? this.state.duration : '0:00:00'}
        </span>
        { this.state.duration && <RaisedButton
            name='btn-stop'
            icon={<FontIcon className="material-icons" style={{color: 'black', width: 50, fontSize: 30}}>stop</FontIcon>}
            style={{
              marginLeft: 20,
              minWidth: 50
            }}
            buttonStyle={{
              width: 50
            }}
            onClick={this.props.onStop}
          />
        }

        { this.state.duration && <FlatButton 
            name='btn-remove'
            icon={<FontIcon className="material-icons" style={{color: 'black', width: 50, fontSize: 20}}>highlightoff</FontIcon>}
            style={{
              marginLeft: 20,
              minWidth: 50
            }}
            onClick={this.props.onRemove}
          />
        }

        { !this.state.duration && <FlatButton 
            icon={<FontIcon className="material-icons" style={{color: 'black', width: 50, fontSize: 30}}>access_time</FontIcon>}
            style={{
              marginLeft: 20,
              minWidth: 50
            }}
            onClick={this.handleStart}
          />
        }
        {
          this.props.isFetching
          ?
          <LinearProgress mode="indeterminate" style={{height: 2}} />
          :
          <LinearProgress mode="determinate" max={100} min={100} style={{height: 2}} />
        }
        <Snackbar
          open={this.props.removedSuccess}
          message="Success"
          autoHideDuration={4000}
        />
      </div> 
    )
  }
}

export default EnterTime