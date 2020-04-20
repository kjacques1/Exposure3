import React, {Component} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'

import {remove} from '../actions/timeEntries'
import {assignLangToTimeEntry, assignLangIdToTimeEntry} from '../actions/langs'

import TimeRowElement from './TimeRowElement'

class TimeRowElementBox extends Component {
  handleCreateLang = (langName, langColor) => {
    this.props.onCreateLang(this.props.uid, this.props.id, langName, langColor)
  }

  handleSelectLang = (langId) => {
    this.props.onSelectLang(this.props.uid, this.props.id, langId)
  }
  render() {
    return (
      <TimeRowElement 
        {...this.props} 
        onCreateLang={this.handleCreateLang} 
        onSelectLang={this.handleSelectLang}
      />
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onRemove: (uid, entryId) => {
      dispatch(remove(uid, entryId))
    },
    onCreateLang: (uid, entryId, langName, langColor) => {
      dispatch(assignLangToTimeEntry(uid, entryId, langName, langColor))
    },
    onSelectLang: (uid, entryId, langId) => {
      dispatch(assignLangIdToTimeEntry(uid, entryId, langId))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    uid: get(state,"auth.user.uid", null)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeRowElementBox)
