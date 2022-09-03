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

const UPDATE_TODO = gql`
  mutation ($id: ID!, $is_completed: Boolean!) {
    updateTodo(id: $id, is_completed: $is_completed)
  }
`;

const UPDATE_TODO_ALL = gql`
  mutation ($is_completed: Boolean!) {
    updateTodoAll(is_completed: $is_completed)
  }
`;

const DELETE_TODO = gql`
  mutation ($id: ID!) {
    deleteTodo(id: $id)
  }
`;

const Todos = () => {
  const { data } = useSubscription<TodosQuery>(GET_TODOS);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [updateTodoAll] = useMutation(UPDATE_TODO_ALL);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const all_checked = data?.todos.length
    ? !data?.todos.some((t) => !t.is_completed)
    : false;

  return (
    <div className="h-full max-h-[40vh] md:max-h-[82vh] overflow-y-auto scrollbar">
      <table className="table h-full w-full">
        <thead>
          <tr>
            <th className="sticky top-0" style={{ zIndex: "20" }}>
              <label>
                <input
                  checked={all_checked}
                  onChange={async (e) =>
                    await updateTodoAll({
                      variables: {
                        is_completed: e.target.checked,
                      },
                    })
                  }
                  type="checkbox"
                  className="checkbox"
                />
              </label>
            </th>
          </tr>
        </thead>
        <div className="flex flex-col items-stretch justify-center">
          {data ? (
            data.todos.map(({ id, text, is_completed }) => (
              <div className="bg-base-100 flex h-16" key={id}>
                <div className="p-4">
                  <label>
                    <input
                      onChange={async (e) =>
                        await updateTodo({
                          variables: {
                            id,
                            is_completed: e.target.checked,
                          },
                        })
                      }
                      checked={is_completed}
                      type="checkbox"
                      className="checkbox"
                    />
                  </label>
                </div>
                <div className="flex-1 p-4">
                  <h2
                    className={`card-title ${
                      is_completed ? "line-through" : ""
                    }`}
                  >
                    {text}
                  </h2>
                </div>
                <div className="ml-auto pr-4 flex items-center text-error text-right">
                  <button
                    onClick={async () =>
                      await deleteTodo({
                        variables: {
                          id,
                        },
                      })
                    }
                    className="btn btn-circle btn-outline btn-error"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <tr>
              <th></th>
              <td>
                <span>No todos to display 🙁</span>
              </td>
              <td></td>
            </tr>
          )}
        </div>
      </table>
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
    <form className="w-full h-full" onSubmit={onSend}>
      <div className="card h-full w-full bg-neutral shadow-xl">
        <div className="card-body p-2 md:p-5">
          <div className="w-full flex card-title">
            <div className="form-control w-full">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                ref={inputRef}
              />
            </div>

            <button className="btn btn-primary ml-auto" type="submit">
              Add
            </button>
          </div>
          <Todos />
        </div>
      </div>
    </form>
  );
};

export default TodosList;
