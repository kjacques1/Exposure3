import React, {Component} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'

import AddLangButton from './AddLangButton'
import {fetchList} from '../actions/langs'

class LangButtonBox extends Component {
  handleFetchList = () => {
    const {langs, onFetchList, uid} = this.props
    if (!langs) {
      onFetchList(uid)
    }
  }
  render() {
    return (
      <AddLangButton {...this.props} onFetchList={this.handleFetchList} />
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onFetchList: (uid) => {
      dispatch(fetchList(uid))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    langs: get(state,"langs.langs", null),
    uid: get(state,"auth.user.uid", null)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LangButtonBox)
