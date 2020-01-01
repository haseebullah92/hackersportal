import React, { Component } from 'react';
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'
import deflist from 'markdown-it-deflist'
import abbreviation from 'markdown-it-abbr'
import insert from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { getDocument, updateDocument } from '../../../services/document-service';
import PreDefinedDocumentTemplates from './PreDefinedDocumentTemplates';

class EditDocument extends Component {

  mdEditor = null
  mdParser = null
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      metaTags: '',
      content: '',
    };
    // initial a parser
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) { }
        }
        return '' // use external default escaping
      }
    })
      .use(emoji)
      .use(subscript)
      .use(superscript)
      .use(footnote)
      .use(deflist)
      .use(abbreviation)
      .use(insert)
      .use(mark)
      .use(tasklists, { enabled: this.taskLists })
    this.renderHTML = this.renderHTML.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.changeSelectHandler = this.changeSelectHandler.bind(this);
    this.get(props.match.params.id);
  }

  get = (id) => {
    let that = this;
    getDocument(id)
      .then(
        function (resp) {
          if (resp.success) {
            that.setState({ id: resp.data.id, name: resp.data.name, metaTags: resp.data.metaTags, content: resp.data.content });
          }
        },
        (error) => {
          ToastsStore.error("An error occur!");
        },
      );
  }

  submitForm = () => {
    if (this.state.name && this.state.content) {
      var that = this;
      updateDocument(this.state)
        .then(resp => {
          if (resp.success) {
            ToastsStore.success("Document updated successfully!");
            that.props.history.push('/app/mydocuments');
          } else {
            ToastsStore.error(resp.message);
          }
        }).catch(error => {
          ToastsStore.error("An error occur!");
        });
    }
  }

  changeSelectHandler = (event) => {
    this.setState({ "content": PreDefinedDocumentTemplates[event.target.value] });
  }

  changeHandler = (event) => {
    const nam = event.target.name;
    const val = event.target.value;
    this.setState({ [nam]: val });
  };

  handleEditorChange({ html, text }, event) {
    this.setState({ "content": text });
    console.log('handleEditorChange', html, text, event)
  }

  renderHTML(text) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mdParser.render(text))
      }, 1)
    })
  }
  onBeforeClear = () => {
    return new Promise((resolve, reject) => {
      const result = window.confirm('Are you sure you want to clear your markdown :-)')
      const toClear = result ? true : false
      resolve(toClear);
    })
  }
  handleGetMdValue = () => {
    this.mdEditor && alert(this.mdEditor.getMdValue())
  }
  handleGetHtmlValue = () => {
    this.mdEditor && alert(this.mdEditor.getHtmlValue())
  }

  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <div className="card mb-3">
              <div className="card-header">
                <i className="fa fa-file-text-o"></i> {this.props.view ? <span>View</span> : <span>Edit</span>} Document
              </div>
              <div className="card-body my-auto">
                <div className="row">
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <div className='form-label-group'>
                        <label htmlFor='inputName'>Document Title</label>
                        <input
                          type='text'
                          id='inputName'
                          className='form-control'
                          placeholder='Document Title'
                          required='required'
                          name='name'
                          onChange={this.changeHandler}
                        />
                      </div>
                    </div>
                    <div className='form-group'>
                      <div className='form-label-group'>
                        <label htmlFor='inputMetaTags'>Meta Tags (comma seprated)</label>
                        <input
                          type='text'
                          id='inputMetaTags'
                          className='form-control'
                          placeholder='Meta Tags'
                          name='metaTags'
                          onChange={this.changeHandler}
                        />
                      </div>
                    </div>
                    <div className='form-group'>
                      <div className='form-label-group'>
                        <label htmlFor='inputTemplate'>Template</label>
                        <select
                          id='inputTemplate'
                          className='form-control'
                          name='template'
                          onChange={this.changeSelectHandler}>
                          <option value=""> -- Select -- </option>
                          <option value="XXS">XXS</option>
                          <option value="SQLI">SQLI</option>
                          <option value="MITM">MITM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12">
                    <MdEditor
                      ref={node => this.mdEditor = node}
                      value={this.state.content}
                      style={{ height: '400px' }}
                      renderHTML={this.renderHTML}
                      config={{
                        view: {
                          menu: true,
                          md: true,
                          html: true,
                          fullScreen: true
                        }
                      }}
                      onChange={this.handleEditorChange}
                      onBeforeClear={this.onBeforeClear}
                    />
                  </div>
                </div>
                {
                  !this.props.view ? <div className="row">
                    <div className="col-md-12 form-group">
                      <input
                        type='button'
                        className='btn btn-primary mt-3 pull-right'
                        value='Save'
                        onClick={this.submitForm}
                      />
                    </div>
                  </div> : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditDocument;
