import React from "react";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const UserEnter = (props: { setCurrentUser: (u: string) => void }) => {
  const { setCurrentUser } = props;
  const [showDialog, setShowDialog] = React.useState(true);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = inputRef.current?.value;
    if (value) {
      setShowDialog(false);
      setCurrentUser(value);
    }
  };

  return (
    <Dialog
      isOpen={showDialog}
      style={{ background: "transparent" }}
      aria-label="user enter form"
    >
      <form onSubmit={onSubmit} className="modal-box mx-auto">
        <h3 className="font-bold text-lg">
          Hey! Enter your name to join collab
        </h3>

        <div className="w-full h-8" />

        <div className="form-control w-full">
          <input
            type="text"
            placeholder="Your name"
            className="input input-bordered w-full"
            ref={inputRef}
          />
        </div>

        <div className="w-full h-4" />

        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            Enter
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default UserEnter;
