import express, {Express, Request, Response} from 'express';
import history from "connect-history-api-fallback"
import dotenv from 'dotenv';
import path from "path";
import bodyParser from "body-parser";
import {stat} from "fs";

const cors = require('cors')
const sampleMessages = require("../sample/small.json")

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
// @ts-ignore
let currentMessagesList: any[] = sampleMessages.map((m, index) => ({...m, index: index}))

// region Middlewares
const staticFileMiddleware = express.static(path.join(__dirname, "..", "..", "client", "build"))

app.use(cors())
app.use(bodyParser({limit: 1024 * 1024 * 16}))
// endregion


app.get('/api/status', (req: Request, res: Response) => {
  res.send("Server is running now!");
});

app.post("/api/setMessagesList", (req, res) => {
  // @ts-ignore
  currentMessagesList = req.body.map((m, index) => ({...m, index: index}))
  res.send("OK")
})

app.post("/api/setReadStatus", (req, res) => {
  const {messageIndex, messageStatus} = req.body

  currentMessagesList[messageIndex].read = messageStatus

  res.send("OK")
})

app.post("/api/setManyMessagesStatus", (req, res) => {
  const {messagesIndexes, status} = req.body

  if (status === "toggle") {
    currentMessagesList = currentMessagesList.map(m => {
      if (messagesIndexes.includes(m.index)) {
        return {...m, read: !m.read}
      }
      return m
    })
  } else {
    currentMessagesList = currentMessagesList.map(m => {
      if (messagesIndexes.includes(m.index)) {
        return {...m, read: status}
      }
      return m
    })
  }

  res.send("OK")
})


app.get("/api/getMessages/:start/:size?", (req, res) => {
  const msgs = [...currentMessagesList].splice(parseInt(req.params.start), parseInt(req.params.size || "1000"))

  res.send(msgs)
})


app.get("/api/getMessagesLength", (req, res) => {
  res.send({messagesLength: currentMessagesList.length})
})

// region ServeClientStatic
app.use(history())
app.use(staticFileMiddleware)
// endregion

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
