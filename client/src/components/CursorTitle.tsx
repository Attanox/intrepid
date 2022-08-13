import { motion } from "framer-motion";

interface Props {
  color: string;
  isExpanded: boolean;
}

const TopLeft = ({ color }: Props) => {
  return (
    <div
      style={{ width: "20px", height: "22px", background: color }}
      className="absolute top-0 left-0 rounded-tl-md"
    ></div>
  );
};

const CenterLeft = ({ color, isExpanded }: Props) => {
  return (
    <motion.div
      style={{ width: "20px", height: "1px", background: color }}
      initial={{
        scaleY: 2,
      }}
      animate={{
        scaleY: isExpanded ? 82 : 2,
      }}
      transition={{ duration: 1, delay: !isExpanded ? 0.75 : 0 }}
      className="absolute top-5 left-0 origin-top"
    />
  );
};
const BottomLeft = ({ color, isExpanded }: Props) => {
  return (
    <motion.div
      style={{ width: "20px", height: "20px", background: color }}
      initial={{
        translateY: "20px",
      }}
      animate={{
        translateY: isExpanded ? "100px" : "20px",
      }}
      transition={{ duration: 1, delay: !isExpanded ? 0.75 : 0 }}
      className="absolute left-0 rounded-bl-md origin-top"
    />
  );
};

const Center = ({ color, isExpanded }: Props) => {
  return (
    <motion.div
      style={{
        width: "1px",
        height: "1px",
        left: "19px",
        background: color,
      }}
      initial={{
        scaleX: 75,
        scaleY: 40,
      }}
      animate={{
        scaleX: isExpanded ? 180 : 75,
        scaleY: isExpanded ? 120 : 40,
      }}
      transition={{ duration: 1, delay: !isExpanded ? 0.75 : 0 }}
      className="absolute top-0 origin-top-left"
    />
  );
};

const TopRight = ({ color, isExpanded }: Props) => {
  return (
    <motion.div
      style={{
        width: "20px",
        height: "22px",
        background: color,
      }}
      initial={{
        translateX: "93px",
      }}
      animate={{
        translateX: isExpanded ? "193px" : "93px",
      }}
      transition={{ duration: 1, delay: !isExpanded ? 0.75 : 0 }}
      className="right absolute top-0 left-0 rounded-tr-md origin-top-left"
    />
  );
};
const CenterRight = ({ color, isExpanded }: Props) => {
  return (
    <motion.div
      style={{
        width: "20px",
        height: "1px",
        background: color,
      }}
      initial={{
        scaleY: 2,
        translateX: "93px",
      }}
      animate={{
        scaleY: isExpanded ? 82 : 2,
        translateX: isExpanded ? "193px" : "93px",
      }}
      transition={{ duration: 1, delay: !isExpanded ? 0.75 : 0 }}
      className="right absolute top-5 origin-top-left"
    />
  );
};
const BottomRight = ({ color, isExpanded }: Props) => {
  return (
    <motion.div
      style={{
        width: "20px",
        height: "20px",
        background: color,
      }}
      initial={{
        translateX: "93px",
        translateY: "20px",
      }}
      animate={{
        translateX: isExpanded ? "193px" : "93px",
        translateY: isExpanded ? "100px" : "20px",
      }}
      transition={{ duration: 1, delay: !isExpanded ? 0.75 : 0 }}
      className="right absolute rounded-br-md  origin-top-left"
    />
  );
};

export const Slice = {
  TopLeft,
  CenterLeft,
  BottomLeft,
  Center,
  TopRight,
  CenterRight,
  BottomRight,
};
