import { h } from "preact";
import { MutableRef, Ref, useEffect, useRef, useState } from "preact/hooks";

import * as cmAutocomplete from "@codemirror/autocomplete";
import * as cmCommands from "@codemirror/commands";
import * as cmLanguage from "@codemirror/language";
import * as cmLint from "@codemirror/lint";
import * as cmSearch from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import * as cmView from "@codemirror/view";

interface EditorProps {
  initial?: string;
  onUpdate?: (contents: string) => void;
}

const Editor = ({ onUpdate, initial }: EditorProps) => {
  const container: Ref<HTMLDivElement> = useRef(null);
  const editor: MutableRef<EditorView | null> = useRef(null);

  const [contents, setContents] = useState(initial || "");

  useEffect(() => {
    if (onUpdate) {
      onUpdate(contents);
    }
  }, [contents]);

  useEffect(() => {
    // WARN: Find a way to do bidirectional updates of some sort once the
    // overall architecture / data flow is sorted.
    console.warn("Changing initial value isn't supported");
  }, [initial]);

  const editorState = useRef(
    EditorState.create({
      doc: contents,
      extensions: [
        EditorView.updateListener.of((update: cmView.ViewUpdate) => {
          if (!update.docChanged) return;
          setContents(update.state.doc.toString());
        }),
        cmView.lineNumbers(),
        cmView.highlightActiveLineGutter(),
        cmView.highlightSpecialChars(),
        cmCommands.history(),
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
          ...cmCommands.historyKeymap,
          ...cmLanguage.foldKeymap,
          ...cmAutocomplete.completionKeymap,
          ...cmLint.lintKeymap,
          cmCommands.indentWithTab,
        ]),
      ],
    }),
  );

  useEffect(() => {
    if (container.current && editor.current == undefined) {
      const editorView = new EditorView({
        state: editorState.current,
        parent: container.current,
      });
      editor.current = editorView;
    }
  }, [container.current]);

  return <div ref={container}></div>;
};

export default Editor;
