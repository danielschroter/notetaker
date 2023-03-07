import { useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const NoteEditor = ({
  onSave,
}: {
  onSave: (note: { title: string; content: string }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className="card mt-5  shadow-xl">
      <div className="card-body p-5">
        <h2 className="bg card-title">
          <input
            className="input-bordered input w-full"
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          width="100%"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setCode(value)}
        ></CodeMirror>
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              onSave({
                title,
                content: code,
              });
              setCode("");
              setTitle("");
            }}
            className="btn-primary btn-sm btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
