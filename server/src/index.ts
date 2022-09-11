import server from "./server";

server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});
