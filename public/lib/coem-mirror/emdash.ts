// adapted from closebrackets.ts

import {EditorView, KeyBinding} from "@codemirror/view"
import {EditorState, EditorSelection, Transaction, Extension,
  StateCommand} from "@codemirror/state"
import {codePointAt, codePointSize} from "@codemirror/text"
import { insertBracket } from './closebrackets'

/// Extension to enable hyphen-replacing behavior.
/// When a hyphen is typed, it is immediately replaced
/// with an em dash.
export function emDash(): Extension {
  return [inputHandler]
}

/// Input handler to check for hyphens to replace with
/// em dashes.
const inputHandler = EditorView.inputHandler.of((view, from, to, insert) => {
  if (view.composing || view.state.readOnly) return false
  let sel = view.state.selection.main
  if (insert.length > 2 || insert.length == 2 && codePointSize(codePointAt(insert, 0)) == 1 ||
      from != sel.from || to != sel.to) return false
  
  // check if a dash can be replaced
  let tr = replaceDash(view.state, insert)

  // if not, don't do anything
  if (!tr) return false

  // if so, dispatch transaction
  view.dispatch(tr)

  // communicate that a change has happened
  return true
})

/// Command that triggers bracket-closing behavior after
/// replacing hyphen with em dash.
export const triggerCloseBrackets: StateCommand = ({state, dispatch}) => {
  if (state.readOnly) return false

  // dispatch transaction
  let tr = insertBracket(state, '—')
  dispatch(tr)
  return true
}

/// A keymap to trigger bracket-closing behavior after
/// replacing hyphen with em dash.
export const replaceHyphenKeymap: readonly KeyBinding[] = [
  {key: '-', run: triggerCloseBrackets}
]

/// Implements the extension's behavior on replacing hyphens
/// with em dashes. 
function replaceDash(state: EditorState, dash: string): Transaction | null {
  // check if character is a hyphen
  if (dash == '-') {
    let dont = null, changes = state.changeByRange(range => {
      return {changes: {insert: "—", from: range.head},
              range: EditorSelection.cursor(range.head + dash.length)}
    })
    // depending on dont, create a transaction that updates
    // the editor state with the change of replacing
    // the straight quote with the curly quote
    return dont ? null : state.update(changes, {
      scrollIntoView: true,
      userEvent: "input.type"
    })
  }
  return null;
}