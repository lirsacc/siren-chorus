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
