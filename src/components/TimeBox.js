import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'
import { DialogAction } from 'material-ui/Dialog';
import {toAmPm, fromAmPM, fromAmPmToDate} from '../utils/time'
import {modText, changeStartTime, stop, start, pull, remove} from '../actions/timeEntryInput'
import {assignLangToTimeEntryInput, assignLangIdToTimeEntryInput} from '../actions/langs'

import TextField from 'material-ui/TextField'
import Dialog from 'material-ui/Dialog'

import EnterTime from './EnterTime'

export class TimeBox extends Component {
  static propTypes = {
    now: PropTypes.number,//timestamp. We need to pass now in unit test
    startTime: PropTypes.number,
    text: PropTypes.string,
    langId: PropTypes.string,
    uid: PropTypes.string,
    onChangeText: PropTypes.func,
    onChangeStartTime: PropTypes.func,
    onStop: PropTypes.func,
    onStart: PropTypes.func,
    onPull: PropTypes.func,
    onRemove: PropTypes.func,
    onCreateLang: PropTypes.func,
    onSelectLang: PropTypes.func,
    isFetching: PropTypes.bool
  }

  static defaultProps = {
    text: '',
    isFetching: false
  }

  constructor (props) {
    super(props)

    const startTime = props.startTime ? new Date(props.startTime) : null
    const startTimeAmPm = props.startTime ? toAmPm(new Date(props.startTime)) : null

    this.state = {
      startTime,
      startTimeAmPm,
      dialogOpen: false
    }
  }

  componentWillMount() {
    this.props.onPull(this.props.uid)
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.startTime) {
      const startTime =  new Date(nextProps.startTime)
      const startTimeAmPm = toAmPm(startTime)

      this.setState({
        startTime,
        startTimeAmPm
      })
    }
  }

  handleOpenDialog = () => {
    this.setState({dialogOpen:true})
  }

  handleCloseDialog = () => {
    this.setState({dialogOpen:false})
  }

  handleChangeText = (text) => {
    this.props.onChangeText(this.props.uid, text)
  }

  //validate input and save
  handleUpdateStartTimeAmPm = (e) => {
    const value = e.target.value
    
    const startTimeAmPm = fromAmPM(e.target.value)
    if (startTimeAmPm) {
      const now = this.props.now ? new Date(this.props.now) : new Date()
      const newStartTimeInDate = fromAmPmToDate(value, now)
      const newStartTimeAmPm = toAmPm(newStartTimeInDate)
      this.setState({
        startTime: newStartTimeInDate,
        startTimeAmPm: newStartTimeAmPm
      })
      this.props.onChangeStartTime(this.props.uid, newStartTimeInDate)
    } 
    //invalid input, revert to current value
    else {
      this.setState({
        startTimeAmPm: toAmPm(this.state.startTime)
      })
    }
  }

  //just save user input during typing
  handleChangeStartTimeAmPm = (e) => {
    this.setState({
      startTimeAmPm: e.target.value
    })
  }

  handleStart = (text, langId) => {
    const now = this.props.now ? new Date(this.props.now) : new Date()
    this.props.onStart(this.props.uid, text, now, langId)
  }

  handleStop = () => {
    this.props.onStop(this.props.uid, this.props.text, this.props.startTime, this.props.langId)
  }

  handleRemove = () => {
    this.props.onRemove(this.props.uid)
  }

  handleCreateLang = (langName, color) => {
    this.props.onCreateLang(this.props.uid, langName, color)
  }

  handleSelectLang = (langId) => {
    this.props.onSelectLang(this.props.uid, langId)
  }

  render() {
    return (
      <div>
        <EnterTime
          text={this.props.text}
          startTime={this.props.startTime}
          langId={this.props.langId}
          isFetching={this.props.isFetching}
          onChangeText={this.handleChangeText}            
          onOpenDialog={this.handleOpenDialog}
          onStop={this.handleStop}
          onStart={this.handleStart}
          onRemove={this.handleRemove}
          onCreateLang={this.handleCreateLang}
          onSelectLang={this.handleSelectLang}
          removedSuccess={this.props.removedSuccess}
        />
        <Dialog
          open={this.state.dialogOpen}
          onRequestClose={this.handleCloseDialog}
          contentStyle={{width: 250}}
        >
          Start <TextField
            value={this.state.startTimeAmPm}
            style={{marginLeft: 30, width: 80}}
            onChange={this.handleChangeStartTimeAmPm}
            onBlur={this.handleUpdateStartTimeAmPm}
            name="startTimeAmPm"
          />
          <br />
          End <span
            style={{marginLeft: 35, width: 80}}
          >{toAmPm(new Date())}</span>
        </Dialog>
      </div> 
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeText: (uid, text) => {
      dispatch(modText(uid, text))
    },
    onChangeStartTime: (uid, date) => {
      dispatch(changeStartTime(uid, date.getTime()))
    },
    onStop: (uid, text, date, langId) => {      
      dispatch(stop(uid, text, date, langId))
    },
    onStart: (uid, text, date, langId) => {
      dispatch(start(uid, text, date.getTime(), langId))
    },
    onPull: (uid) => {
      dispatch(pull(uid))
    },
    onRemove: (uid) => {
      dispatch(remove(uid))
    },
    onCreateLang: (uid, langName, color) => {
      dispatch(assignLangToTimeEntryInput(uid, langName, color))
    },
    onSelectLang: (uid, langId) => {
      dispatch(assignLangIdToTimeEntryInput(uid, langId))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    startTime: get(state,"timeEntryInput.startTime", null),
    text: get(state, "timeEntryInput.text", null),
    uid: get(state,"auth.user.uid", null),
    langId: get(state,"timeEntryInput.langId", null),
    isFetching: get(state, "timeEntryInput.isFetching", null),
    removedSuccess: get(state, "timeEntryInput.removedSuccess", false),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeBox)