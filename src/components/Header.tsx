import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="t-5 navbar bg-transparent tracking-widest text-primary-content shadow-xl">
      <div className="flex-1 pl-5 text-xl font-bold">
        {sessionData?.user?.name ? (
          <span className="bg-gradient-to-br from-pink-400 to-red-600 bg-clip-text text-transparent">
            Notes for {sessionData?.user.name}
          </span>
        ) : (
          <span className="bg-gradient-to-br from-pink-400 to-red-600 bg-clip-text text-transparent">
            Notetaker
          </span>
        )}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn"
              onClick={() => void signOut()}
            >
              <div className="w-10 rounded-full">
                <img
                  src={sessionData?.user?.image ?? ""}
                  alt={sessionData?.user?.name ?? ""}
                />
              </div>
            </label>
          ) : (
            <button
              className="btn-ghost rounded-btn btn"
              onClick={() => void signIn()}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
