import React, { FormEvent } from "react";
import { useSubscription, useMutation, gql } from "@apollo/client";
import { Container, Row, Col, FormInput, Button, Alert } from "shards-react";

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

const Todo = () => {
  const { data } = useSubscription<TodosQuery>(GET_TODOS);
  if (!data) {
    return <span>No todos to display 🙁</span>;
  }

  return (
    <React.Fragment>
      {data.todos.map(({ id, text }) => (
        <Alert key={id} theme="dark" style={{ marginBottom: "10px" }}>
          {text}
        </Alert>
      ))}
    </React.Fragment>
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
      <Container>
        <Todo />

        <Row>
          <Col xs={2} style={{ padding: 0 }}>
            <FormInput label="User" value={"Andi!"} disabled />
          </Col>
          <Col xs={8}>
            <FormInput label="Content" innerRef={inputRef} />
          </Col>
          <Col xs={2} style={{ padding: 0 }}>
            <Button type="submit" style={{ width: "100%" }}>
              Send
            </Button>
          </Col>
        </Row>
      </Container>
    </form>
  );
};

export default () => <TodosList />;
