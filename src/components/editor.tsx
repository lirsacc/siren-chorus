import { h } from "preact";
import { MutableRef, Ref, useEffect, useRef } from "preact/hooks";

import * as cmAutocomplete from "@codemirror/autocomplete";
import * as cmCommands from "@codemirror/commands";
import * as cmLanguage from "@codemirror/language";
import * as cmLint from "@codemirror/lint";
import * as cmSearch from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import * as cmView from "@codemirror/view";
import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

export const userColor =
  usercolors[Math.round(Math.random() * 100) % usercolors.length];

interface EditorProps {
  text: Y.Text;
  provider: WebrtcProvider;
}

const Editor = ({ text, provider }: EditorProps) => {
  const container: Ref<HTMLDivElement> = useRef(null);

  const editorState: MutableRef<EditorState | null> = useRef(null);
  const editorView: MutableRef<EditorView | null> = useRef(null);

  useEffect(() => {
    if (container.current) {
      editorState.current = EditorState.create({
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        doc: text.toString(),
        extensions: [
          EditorView.updateListener.of((update: cmView.ViewUpdate) => {
            if (!update.docChanged) return;
            console.debug("EDITOR UPDATED TO", update.state.doc.toString());
          }),
          cmView.lineNumbers(),
          cmView.highlightActiveLineGutter(),
          cmView.highlightSpecialChars(),
          // cmCommands.history(),
          cmLanguage.foldGutter(),
          cmView.drawSelection(),
          cmView.dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          cmLanguage.indentOnInput(),
          cmLanguage.syntaxHighlighting(cmLanguage.defaultHighlightStyle, {
            fallback: true,
          }),
          cmLanguage.bracketMatching(),
          cmAutocomplete.closeBrackets(),
          cmAutocomplete.autocompletion(),
          cmView.rectangularSelection(),
          cmView.crosshairCursor(),
          cmView.highlightActiveLine(),
          cmSearch.highlightSelectionMatches(),
          cmView.keymap.of([
            ...cmAutocomplete.closeBracketsKeymap,
            ...cmCommands.defaultKeymap,
            ...cmSearch.searchKeymap,
            // ...cmCommands.historyKeymap,
            ...yUndoManagerKeymap,
            ...cmLanguage.foldKeymap,
            ...cmAutocomplete.completionKeymap,
            ...cmLint.lintKeymap,
            cmCommands.indentWithTab,
          ]),
          yCollab(text, provider.awareness),
        ],
      });
      editorView.current = new EditorView({
        state: editorState.current,
        parent: container.current,
      });
    }
  }, [text, provider]);

  return <div ref={container} />;
};

export default Editor;
