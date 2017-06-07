'use babel'

import InitFileView from './init-file-view'
import template from './template'
import {
    CompositeDisposable
} from 'atom'

export default {
    initFileView: null,
    modalPanel: null,
    subscriptions: null,

    initialize(state) {
      this.idisposable = atom.workspace.observeActivePaneItem( editor => {
        if(!editor || !editor.getText)return;
        let ochangeTitle= editor.onDidChangeTitle(()=> {
          this.initVue(editor);
        })
        editor.onDidDestroy(()=> {
          ochangeTitle.dispose();
        })
        this.initVue(editor)
;      })

    },
    activate(state) {
        this.initFileView = new InitFileView(state.initFileViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.initFileView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable()

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'init-file:toggle': () => this.toggle()
        }))

    },

    deactivate() {
        this.modalPanel.destroy()
        this.subscriptions.dispose()
        this.initFileView.destroy()
        this.disposable.dispose()
    },

    serialize() {
        return {
            initFileViewState: this.initFileView.serialize()
        }
    },
    initVue(editorSource) {
      let editor = editorSource ? editorSource : atom.workspace.getActiveTextEditor()
      if (editor) {
          let fileName = editor.getTitle();
          let suffix=fileName.substr(fileName.lastIndexOf(".")+1,fileName.length-fileName.lastIndexOf("."))
          if(suffix == 'html' || suffix == 'htm') suffix = "html"
          if (editor.getText().trim() !== '') return
          let str = template[suffix]
          str && (editor.insertText(str))
      }
    },
    toggle() {
        this.initVue()
    }

};
