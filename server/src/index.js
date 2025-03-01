// import statements
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// define statSync & createReadStream
const statSync = fs.statSync;
const createReadStream = fs.createReadStream;

const app = express(); // use express for the server
const PORT = 3000; // port that server will run at

app.use(cors()); // allow requests from other origins

const ASSETS_PATH = path.join(__dirname, "assets"); // path to the assets

// API endpoint to stream audio from
app.get("/audio/:id", (req, res) => {
  const audioId = req.params.id; // get audio id from request parameters
  const filePath = path.join(ASSETS_PATH, `audio-${audioId}.mp3`); // path to audio file
  const CHUNK_SIZE = 500 * 1e3; //  0.5MB chunk size

  // send audio in chunks
  const range = req.headers.range || "0";
  const audioSize = statSync(filePath).size; // get audio size

  // define start and end of current chunk
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
  const contentLength = end - start + 1;

  // set headers for transfer to client
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${audioSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
    "Transfer-Encoding": "chunked",
  };

  res.writeHead(206, headers);

  // create audio stream
  const stream = createReadStream(filePath, { start, end });
  stream.pipe(res);
});

// run the app on port 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
