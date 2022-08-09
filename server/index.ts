import server from "./src/server";

server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});
