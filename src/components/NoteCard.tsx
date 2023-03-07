import { useState } from "react";

import ReactMarkdown from "react-markdown";

import { type RouterOutputs } from "~/utils/api";

type Note = RouterOutputs["note"]["getAll"][0];

export const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card mt-5 border border-gray-700 shadow-2xl ">
      <div className="card-body m-0 p-1">
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="collapse-title">{note.title}</div>
          <div className="collapes-content">
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        <div className="card-actions  justify-end">
          <button className="btn-warning btn-sm btn" onClick={onDelete}>
            delete
          </button>
        </div>
      </div>
    </div>
  );
};
