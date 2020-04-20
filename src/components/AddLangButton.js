import React, {Component, PropTypes} from 'react'

import CreateLang from './CreateLang'

import FlatButton  from 'material-ui/FlatButton'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import FontIcon from 'material-ui/FontIcon'
import TextField from 'material-ui/TextField'
import Dialog from 'material-ui/Dialog'

export class LangItem extends Component {
  static propTypes = {
    onSelectLang: PropTypes.func,
    name: PropTypes.string,
    color: PropTypes.string,
    id: PropTypes.string
  }

  handleSelectLang = () => {
    const {onSelectLang, id, name, color} = this.props    
    onSelectLang(id, name, color)
  }

  render() {
    return (
      <ListItem
        className='list-item' 
        primaryText={this.props.name} 
        leftIcon={<FontIcon className="material-icons" style={{color: this.props.color}}>flag</FontIcon>} 
        onClick={this.handleSelectLang}
      />      
    )
  }
}

export class LangItemList extends Component {
  static propTypes = {
    onSelectLang: PropTypes.func,
    langs: PropTypes.array,
    dialogMaxHeight: PropTypes.number
  }

  static defaultProps = {
    langs: [],
    dialogMaxHeight: 300
  }

  state = {
    filterLang: ''
  }

  componentDidMount () {
    this.findLang.focus()
  }

  handleFilterLangChange = (e) => {
    this.setState({
      filterLang: e.target.value
    })
  }
  render() {
    return (
      <div>
        <List className="list first">
          <FontIcon className="material-icons" style={{
            color: 'black', 
            fontSize: 18,
            top: 5,
            paddingRight: 8
          }}>search</FontIcon>
          <TextField
            id="find-lang"
            underlineShow={false}
            hintText="Find Language"
            className="input-filter"
            ref={node => this.findLang = node}
            value={this.state.filterLang}
            onChange={this.handleFilterLangChange}
          />
        </List>
        <Divider />
        <List className="list" style={{maxHeight: this.props.dialogMaxHeight, 'overflowY': 'scroll', 'overflowX': 'hidden'}}>
          {this.props.langs.map((lang) => {
            if (this.state.filterLang === '' || lang.name.indexOf(this.state.filterLang) !== -1) {
              return (
                <LangItem key={lang.key} id={lang.key} onSelectLang={this.props.onSelectLang} {...lang} />
              )
            } else {
              return undefined;
            }
          })}
        </List>
      </div>
    )
  }
}

export class LangButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    langName: PropTypes.string,
    langColor: PropTypes.string    
  }

  render() {
    return(
      this.props.langName
      ?
        <FlatButton
          onClick={this.props.onClick}
          label={this.props.langName}
          labelStyle={{color: this.props.langColor, textTransform: 'none'}}
          icon={<FontIcon className="material-icons" style={{color: this.props.langColor, fontSize: 20}}>flag</FontIcon>}
        />
      :
        <FlatButton
          onClick={this.props.onClick}
          label="Language"
          labelStyle={{textTransform: 'none'}}
          icon={<FontIcon className="material-icons" style={{color: 'black', fontSize: 30}}>language</FontIcon>}
        />      
    )
  }
}

class AddLangButton extends Component {
  static propTypes = {
    onCreateLang: PropTypes.func,
    onFetchList: PropTypes.func,
    onSelectLang: PropTypes.func,
    langs: PropTypes.array,
    langId: PropTypes.string,
    dialogMaxHeight: PropTypes.number
  }

  constructor (props) {
    super(props)
    const langValue = this.getLangButtonValue(props.langId, props)

    this.state = {
      openLangForm: false,
      createLangDialogOpen: false,
      langName: langValue ? langValue.name : null,
      langColor: langValue ? langValue.color : null,
      langId: props.langId ? props.langId : null
    }
  }

  getLangButtonValue = (langId, props) => {
    let result = null
    if (props.langs && props.langs.length && props.langs.length > 0) {
      props.langs.forEach((lang) => {
        if (lang.key === langId) {
          result = lang
          return false
        }
      })
    }
    return result
  }

  componentWillReceiveProps(nextProps) {
    //we got tagId pass in
    if ('langId' in nextProps) {
      if (nextProps.langId) {
        //if tags available in nextProps use it
        let props = null
        if (nextProps.langs && nextProps.langs.length && nextProps.langs.length > 0) {
          props = nextProps
        } else if (this.props.langs && this.props.langs.length && this.props.langs.length > 0) {
          props = this.props
        }

        if (!props) {
          return
        }
        const langValue = this.getLangButtonValue(nextProps.langId, props)
        if (langValue) {
          this.setState({
            langName: langValue.name,
            langColor: langValue.color
          })
        }
      } 
      //empty tag id
      else {
        this.setState({
          langName: null,
          langColor: null
        })        
      }
    }
  }

  componentWillMount() {
    this.props.onFetchList()
  }

  handleOpenLangForm = (event) => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      openLangForm: true,
      anchorEl: event.currentTarget,
    })    
  }

  handleCloseLangForm = () => {
    this.setState({
      openLangForm: false,
    });
  }

  handleOpenCreateLangDialog = () => {
    this.setState({
      createLangDialogOpen: true,
      openLangForm: false
    })
  }

  handleCloseCreateLangDialog = () => {
    this.setState({
      createLangDialogOpen: false
    })
  }

  handleCreateLang = (lang, color) => {
    this.props.onCreateLang(lang, color)
    this.handleCloseCreateLangDialog()
  }

  handleSelectLang = (langId, langName, langColor) => {    
    this.props.onSelectLang(langId)
    this.setState({langName, langColor})
    this.handleCloseLangForm()
  }

  render() {
    return (
      <div className="container-add-lang">
        <LangButton onClick={this.handleOpenLangForm} langName={this.state.langName} langColor={this.state.langColor} />
        <Popover
          open={this.state.openLangForm}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleCloseLangForm}
          animation={PopoverAnimationVertical}
          style={{
            paddingLeft: 10,
            paddingRight: 10
          }}
          className="container-add-lang-popup"
        >
          {
            ('langs' in this.props && this.props.langs && this.props.langs.length > 0) &&
              <LangItemList onSelectLang={this.handleSelectLang} langs={this.props.langs} dialogMaxHeight={this.props.dialogMaxHeight} />
          }
          <List className="list">
            <div style={{textAlign: 'left'}}>
              <FlatButton
                label="Add Language"
                labelStyle={{textTransform: 'none'}}
                icon={<FontIcon className="material-icons" style={{color: 'black'}}>add</FontIcon>}
                onClick={this.handleOpenCreateLangDialog}
              />
            </div>
          </List>
        </Popover>
        <Dialog
          title="Create new language"
          open={this.state.createLangDialogOpen}
          onRequestClose={this.handleCloseCreateLangDialog}
          contentStyle={{maxWidth: 400}}
        >
          <CreateLang onSave={this.handleCreateLang}/>
        </Dialog>        
      </div>
    )
  }
}

export default AddLangButton