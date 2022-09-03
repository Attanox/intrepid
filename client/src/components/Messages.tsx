import { getColor } from "@/utils";
import { gql, useSubscription } from "@apollo/client";
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

  return (
    <div className="card w-full h-full p-2 md:p-5 overflow-auto scrollbar bg-neutral rounded-t-2xl shadow-xl">
      {data?.messages
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .map((message) => {
          return (
            <motion.div
              style={{
                background: getColor(message.name),
              }}
              className="alert flex-row items-center py-2 mb-2 scrollbar"
            >
              <b>{message.name}:</b>
              <h3 style={{ marginTop: 0 }} key={message.id}>
                {message.content}
              </h3>
            </motion.div>
          );
        })}
    </div>
  );
};

export default Messages;
