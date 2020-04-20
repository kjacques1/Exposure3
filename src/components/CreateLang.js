import React, {Component, PropTypes} from 'react'

import ColorPicker from './ColorPicker'

import RaisedButton  from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

class CreateLang extends Component {
  static propTypes = {
    onSave: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      langNameInputError: null,
      langName: ''
    }
  }

  handleSave = (event) => {
    event.preventDefault()

    this.setState({
      langNameInputError: this.state.langName ? null : "Language name is required"
    })
    const lang = this.state.langName
    const color = this.colorInput.getValue()
    if (lang && color) {
      this.props.onSave(lang, color)
    }
  }

  handleChange = (e) => {
    this.setState({
      langName: e.target.value
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSave}>
        <TextField
          hintText="Language name"
          id="lang-name"
          errorText={this.state.langNameInputError}
          value={this.state.langName}
          onChange={this.handleChange}
        />
        <br/>
        <br/>
        <ColorPicker ref={color => this.colorInput = color}/>
        <br/>
        <br/>
        <RaisedButton
          secondary={true}
          fullWidth={true}
          label="Create Language"
          labelStyle={{textTransform: 'none'}}
          onClick={this.handleSave}
        />
      </form>
    )
  }
}

export default CreateLang