import { getColor } from "@/utils";
import { gql, useSubscription } from "@apollo/client";
import React from "react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  content: string;
  user: string;
  name: string;
  createdAt: string;
}

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      content
      user
      name
      createdAt
    }
  }
`;

const Messages = () => {
  const { data } = useSubscription<{ messages: Message[] }>(GET_MESSAGES);

  console.log("data", data?.messages);

  return (
    <div className="toast toast-center w-1/2 max-h-40 overflow-auto scrollbar bg-neutral rounded-t-2xl shadow-xl">
      {data?.messages
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .map((message) => {
          return (
            <motion.div
              style={{
                background: getColor(message.name),
              }}
              className="alert py-2 scrollbar"
            >
              <b>{message.name}:</b>
              <h3 key={message.id}>{message.content}</h3>
            </motion.div>
          );
        })}
    </div>
  );
};

export default Messages;
