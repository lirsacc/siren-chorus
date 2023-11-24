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
  initial?: string;
  onUpdate?: (contents: string) => void;
}

const Editor = ({ onUpdate, initial }: EditorProps) => {
  const container: Ref<HTMLDivElement> = useRef(null);

  // These should probably come from outside the editor here and be app global.
  const doc: MutableRef<Y.Doc | null> = useRef(null);
  const provider: MutableRef<WebrtcProvider | null> = useRef(null);
  const text: MutableRef<Y.Text | null> = useRef(null);
  const editorState: MutableRef<EditorState | null> = useRef(null);
  const editorView: MutableRef<EditorView | null> = useRef(null);

  const [contents, setContents] = useState(initial || "");

  useEffect(() => {
    if (onUpdate) {
      onUpdate(contents);
    }
  }, [contents, onUpdate]);

  useEffect(() => {
    if (container.current) {
      // These should probably come from outside the editor here and be app global.
      doc.current = new Y.Doc();

      provider.current = new WebrtcProvider(
        "codemirror6-demo-room-2",
        doc.current,
      );
      text.current = doc.current.getText(initial);

      provider.current.awareness.setLocalStateField("user", {
        name: "Anonymous " + Math.floor(Math.random() * 100),
        color: userColor.color,
        colorLight: userColor.light,
      });

      editorState.current = EditorState.create({
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        doc: text.current.toString(),
        extensions: [
          EditorView.updateListener.of((update: cmView.ViewUpdate) => {
            if (!update.docChanged) return;
            setContents(update.state.doc.toString());
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
          yCollab(text.current, provider.current.awareness),
        ],
      });
      editorView.current = new EditorView({
        state: editorState.current,
        parent: container.current,
      });
    }
  }, [initial]);

  return <div ref={container} />;
};

export default Editor;
