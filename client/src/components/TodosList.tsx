import React, { FormEvent } from "react";
import { useSubscription, useMutation, gql } from "@apollo/client";
interface Todo {
  id: string;
  text: string;
  is_completed: boolean;
}

interface TodosQuery {
  todos: Todo[];
}

const GET_TODOS = gql`
  subscription {
    todos {
      id
      text
      is_completed
    }
  }
`;

const ADD_TODO = gql`
  mutation ($text: String!) {
    addTodo(text: $text)
  }
`;

const Todos = () => {
  const { data } = useSubscription<TodosQuery>(GET_TODOS);
  if (!data) {
    return <span>No todos to display 🙁</span>;
  }

  return (
    <div className="container mx-auto grid grid-cols-4">
      {data.todos.map(({ id, text }) => (
        <React.Fragment key={id}>
          <div
            className="col-span-2 card w-full bg-base-100 shadow-xl mx-auto mb-3"
            key={id}
          >
            <div className="card-body">
              <h2 className="card-title">{text}</h2>
            </div>
          </div>
          <div className="col-span-1" />
        </React.Fragment>
      ))}
    </div>
  );
};

const TodosList = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [postMessage] = useMutation(ADD_TODO);

  const onSend = (e: FormEvent) => {
    e.preventDefault();

    if (!inputRef.current) return;

    if (inputRef.current.value.length > 0) {
      postMessage({
        variables: { text: inputRef.current.value },
      });
    }
    inputRef.current.value = "";
  };

  return (
    <form onSubmit={onSend}>
      <div className="container mx-auto">
        <div className="grid grid-cols-4 justify-center items-end">
          <div className="col-span-2 p-2">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Todo</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full "
                ref={inputRef}
              />
            </div>
          </div>
          <div className="col-span-1 p-2 ">
            <button className="btn btn-primary w-full" type="submit">
              Send
            </button>
          </div>
        </div>
      </div>

      <Todos />
    </form>
  );
};

export default TodosList;
