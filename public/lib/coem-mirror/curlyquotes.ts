// adapted from closebrackets.ts

import {EditorView, KeyBinding} from "@codemirror/view"
import {EditorState, EditorSelection, Transaction, Extension,
  StateCommand} from "@codemirror/state"
import {Text, codePointAt, codePointSize} from "@codemirror/text"
import { insertBracket } from './closebrackets'

/// Extension to enable quote-replacing behavior.
/// When a "dumb"/straight quote is typed, it is
/// immediately replaced with a "smart"/opening
/// curly quote.
export function curlyQuotes(): Extension {
  return [inputHandler]
}

const before = "—)]:."

/// Input handler to check for straight quotes to
/// replace with curly quotes.
const inputHandler = EditorView.inputHandler.of((view, from, to, insert) => {
  if (view.composing || view.state.readOnly) return false
  let sel = view.state.selection.main
  if (insert.length > 2 || insert.length == 2 && codePointSize(codePointAt(insert, 0)) == 1 ||
      from != sel.from || to != sel.to) return false
    
  // check if a quote can be replaced
  let tr = replaceQuote(view.state, insert)

  // if not, don't do anything
  if (!tr) return false

  // if so, dispatch transaction
  view.dispatch(tr)

  // communicate that a change has happened
  return true
})

/// Command that triggers bracket-closing behavior after
/// replacing straight quote with curly quote.
export const triggerCloseQuotes: StateCommand = ({state, dispatch}) => {
  if (state.readOnly) return false

  // check for next character
  let next;
  let dont = null, changes = state.changeByRange(range => {
    next = nextChar(state.doc, range.head)
    return {range: dont = range}
  })
  // set character to opening or closing quote depending on
  // if there is no next character / if next character is
  // whitespace / if next character is in the before list
  let char;
  if (!next || /\s/.test(next) || before.indexOf(next) > -1) {
    char = "“"
  } else {
    char = "”"
  }

  // dispatch transaction
  // insert opening or closing bracket depending on
  // if opening bracket already exists
  let tr = insertBracket(state, char)
  dispatch(tr)
  return true
}

/// A keymap to trigger bracket-closing behavior after
/// replacing straight quote with curly quote.
export const replaceQuoteKeymap: readonly KeyBinding[] = [
  {key: '"', run: triggerCloseQuotes}
]

/// Implements the extension's behavior on replacing straight
/// quotes with curly quotes
function replaceQuote(state: EditorState, quote: string): Transaction | null {
  // check if character is a straight quote
  if (quote == '"') {
    let dont = null, changes = state.changeByRange(range => {
      return {changes: {insert: "“", from: range.head},
              range: EditorSelection.cursor(range.head + quote.length)}
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

function nextChar(doc: Text, pos: number) {
  let next = doc.sliceString(pos, pos + 2)
  return next.slice(0, codePointSize(codePointAt(next, 0)))
}

function prevChar(doc: Text, pos: number) {
  let prev = doc.sliceString(pos - 2, pos)
  return codePointSize(codePointAt(prev, 0)) == prev.length ? prev : prev.slice(1)
}