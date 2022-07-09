import '../style/App.css';
import {useEffect, useState} from "react";
import {AppRoot, Button, Card, Checkbox} from "@vkontakte/vkui";
// @ts-ignore
import {Message} from "../data/Message.ts";
// @ts-ignore
import sampleMessages from "../data/sample/small.json"
// @ts-ignore
import MessageItem from "./MessageItem.tsx";

function App() {
  const [currentTheme, setCurrentTheme] = useState<string>("light")
  const [messages, setMessages] = useState<Array<Message>>(sampleMessages.map(m => new Message(m)))
  const [selectedMessages, setSelectedMessages] = useState([])
  const [previewMessage, setPreviewMessage] = useState(null)
  const [showMessagePreview, setShowMessagePreview] = useState(false)

  // region mounted
  useEffect(() => {
    const savedTheme: string = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setCurrentTheme(savedTheme)
    }
  }, [])
  //endregion

  // region watch
  useEffect(() => {
    localStorage.setItem("theme", currentTheme)
    document.documentElement.setAttribute("theme", currentTheme)
  }, [currentTheme])
  //endregion

  const onClickThemeChanger = () => {
    if (currentTheme === "light") {
      setCurrentTheme("dark")
    } else if (currentTheme === "dark") {
      setCurrentTheme("light")
    }
  }

  const onClickUploadMessages = () => {
    console.log("upload")
  }

  const onClickToggleMessageSelect = (index) => {
    console.log(index)
    if (selectedMessages.includes(index)) {
      setSelectedMessages(prev => prev.filter(el => el !== index))
    } else {
      setSelectedMessages(prev => [...prev, index])
    }
  }

  const onClickSelectAll = () => {
    if (messages.length !== selectedMessages.length) {
      setSelectedMessages(Array.from({length: messages.length}, (item, index) => index))
    } else {
      setSelectedMessages([])
    }
  }

  const openPreview = (previewMessage) => {
    setPreviewMessage(previewMessage)
    setShowMessagePreview(true)
  }

  return (
    <AppRoot>
      <div className="App">
        <div className={"preview-modal " + (showMessagePreview ? "show" : "")}>
          <Card style={{overflow: "hidden", textAlign: "center"}}>
            {showMessagePreview && <img className="w-100" src={previewMessage.file.preview} alt=""/>}
            <Button className="mt-4 mx-auto mb-3" onClick={() => setShowMessagePreview(false)}>
              Закрыть превью
            </Button>
          </Card>
        </div>
        <div
          className={"backdrop " + (showMessagePreview ? "show" : "")}
          onClick={() => setShowMessagePreview(false)}
        >
        </div>
        <header className="service-header">
          <div className="container py-3 d-flex justify-content-between">
            <h1 className="service-name">ВездеПочта!</h1>

            <div className="theme-switcher">
              <button className="d-flex" onClick={onClickThemeChanger}>
                <span className="material-icons-outlined m-auto">light_mode</span>
              </button>
            </div>
          </div>
        </header>

        <main className="container mt-5">
          <Button
            className="d-flex upload-data mb-5"
            color="white"
            before={
              <div className="d-flex">
                <span className="material-icons-outlined m-auto">file_upload</span>
              </div>
            }
            size="m"
            onClick={onClickUploadMessages}
          >
            Загрузить свой список писем
          </Button>

          <div className="mt-5 messages-list">
            <div className="controls mb-4">
              <Checkbox
                checked={messages.length === selectedMessages.length}
                onChange={onClickSelectAll}
              >
                Выбрать все письма
              </Checkbox>

            </div>

            <Card style={{overflow: "hidden"}}>
              <div className="list-view">
                {
                  messages.map((message, index) => {
                    return (
                      <MessageItem
                        key={index}
                        toggleSelect={() => onClickToggleMessageSelect(index)}
                        selected={selectedMessages.includes(index)}
                        message={message}
                        openPreview={() => openPreview(message)}
                      />
                    )
                  })
                }
              </div>
            </Card>
          </div>
        </main>
      </div>
    </AppRoot>
  );
}

export default App;
