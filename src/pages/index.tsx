import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { Header } from "~/components/Header";

import { api, type RouterOutputs } from "~/utils/api";
import { useState } from "react";
import { NoteEditor } from "~/components/NoteEditor";

import { NoteCard } from "~/components/NoteCard";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Notetaker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex h-full min-h-screen flex-col items-center">
          <Header />
          {sessionData?.user ? (
            <Content></Content>
          ) : (
            <div className="flex flex-auto flex-col justify-center px-8">
              <div className="rounded-2xl border border-pink-600 p-12 shadow-2xl">
                <h1 className="tracking bg-gradient-to-br from-pink-400 to-red-600 bg-clip-text text-5xl  font-extrabold text-transparent">
                  Welcome to Notetaker
                </h1>
                <h3 className=" pt-2 text-3xl">
                  Please <button onClick={() => void signIn()}>Log In </button>
                </h3>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

type Topic = RouterOutputs["topic"]["getAll"][0]; // Getting Type of Router Outputs!

const Content: React.FC = () => {
  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    { topicId: selectedTopic?.id ?? "" },
    { enabled: sessionData?.user !== undefined && selectedTopic !== null }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes(); // TO get the updates automatically
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 ">
      <div className="mx-5 px-2 pt-5">
        <h2 className="text-white">Your Topics</h2>
        <ul className="menu rounded-box mt-2 bg-base-100">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="New Topic"
          className="input-bordered input input-sm w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({
                title: e.currentTarget.value,
              });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3">
        <div className="mx-5 mt-5">
          <h2 className="text-lg text-white">Your Notes</h2>
          <div>
            {notes?.map((note) => (
              <div key={note.id} className="mt-5">
                <NoteCard
                  note={note}
                  onDelete={() => void deleteNote.mutate({ id: note.id })}
                ></NoteCard>
              </div>
            ))}
          </div>
        </div>
        <NoteEditor
          onSave={({ title, content }) => {
            void createNote.mutate({
              title,
              content,
              topicId: selectedTopic?.id ?? "",
            });
          }}
        />
      </div>
    </div>
  );
};
