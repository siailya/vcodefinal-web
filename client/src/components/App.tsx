import '../style/App.css';
import {useEffect, useRef, useState} from "react";
import {AppRoot, Button, Card, Checkbox, ScreenSpinner} from "@vkontakte/vkui";
// @ts-ignore
import {Message} from "../data/Message.ts";
// @ts-ignore
import sampleMessages from "../data/sample/small.json"
// @ts-ignore
import MessageItem from "./MessageItem.tsx";
import axios from "axios";
// @ts-ignore
import {BACKEND} from "../config.ts"


function App() {
  const [currentTheme, setCurrentTheme] = useState<string>("light")
  const [messages, setMessages] = useState<Array<Message>>([])
  const [selectedMessages, setSelectedMessages] = useState([])
  const [previewMessage, setPreviewMessage] = useState(null)
  const [showMessagePreview, setShowMessagePreview] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const inputRef = useRef(null)
  const messagesListRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [messagesLength, setMessagesLength] = useState(0)

  // region mounted
  useEffect(() => {
    const savedTheme: string = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setCurrentTheme(savedTheme)
    }
    loadMessages()
    loadMessagesLength()
  }, [])
  //endregion

  // region watch
  useEffect(() => {
    localStorage.setItem("theme", currentTheme)
    document.documentElement.setAttribute("theme", currentTheme)
  }, [currentTheme])

  useEffect(() => {
  }, [messages])
  //endregion

  const onClickThemeChanger = () => {
    if (currentTheme === "light") {
      setCurrentTheme("dark")
    } else if (currentTheme === "dark") {
      setCurrentTheme("contrast")
    } else if (currentTheme === "contrast") {
      setCurrentTheme("kittens")
    } else if (currentTheme === "kittens") {
      setCurrentTheme("mil")
    } else {
      setCurrentTheme("light")
    }
  }

  const onClickUploadMessages = () => {
    inputRef.current.click()
  }

  const onFileUpload = (e) => {
    if (e.target?.files[0]?.size > 1024 * 1024 * 16) {
      alert("Превышен допустимый размер файла!")
    } else {
      const reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsText(e.target.files[0]);
      setShowSpinner(true)
    }

    function onReaderLoad(e) {
      const obj = JSON.parse(e.target.result);
      axios.post(BACKEND + "setMessagesList", obj)
        .then(r => {
          return loadMessages()
        })
        .catch((e) => {
          setShowSpinner(false)
          alert(e)
        })
    }
  }

  const onClickToggleMessageSelect = (index) => {
    if (selectedMessages.includes(index)) {
      setSelectedMessages(prev => prev.filter(el => el !== index))
    } else {
      setSelectedMessages(prev => [...prev, index])
    }
  }

  const onClickSelectAll = () => {
    if (messages.length !== selectedMessages.length &&
      selectedMessages.length !== messagesLength) {
      setSelectedMessages(Array.from({length: messagesLength || messages.length}, (item, index) => index))
    } else {
      setSelectedMessages([])
    }
  }

  const openPreview = (previewMessage) => {
    setPreviewMessage(previewMessage)
    setShowMessagePreview(true)
  }

  const sendSetStatus = (status) => {
    setShowSpinner(true)
    axios.post(BACKEND + "setManyMessagesStatus",
      {messagesIndexes: selectedMessages, status: status}).then(() => {
      loadMessages()
    }).then(() => {
      loadMessages()
      setShowSpinner(false)
    })
  }

  const readSelected = () => {
    sendSetStatus(true)
  }

  const unreadSelected = () => {
    sendSetStatus(false)
  }

  const toggleSelected = () => {
    setShowSpinner(true)

    axios.post(BACKEND + "setManyMessagesStatus",
      {messagesIndexes: selectedMessages, status: "toggle"}).then(() => {
      loadMessages()
    })
  }

  const loadMessages = (direction = null) => {
    setShowSpinner(true)
    let path = ""

    if (direction === "down") {
      path = `getMessages/${currentIndex + 15}/0`
    } else if (direction === "up") {
      path = `getMessages/${currentIndex - 15}/0`
    } else {
      path = `getMessages/${currentIndex}`
    }

    axios.get(BACKEND + `${path}`).then(r => {
      setMessages(r.data.map(m => new Message(m)))
      setSelectedMessages([])
      setShowSpinner(false)

      // const observer = new IntersectionObserver((entries, observer) => {
      //   for (let e of entries) {
      //     parseInt(e.target.id.replace("message_", ""))
      //   }
      // }, {
      //   root: messagesListRef.current
      // })
      //
      // // @ts-ignore
      // observer.observe(document.getElementById(`message_item_${currentIndex + 20}`))
    })
      .catch(e => {
        alert("Ошибка при загрузке данных: " + e)
      })

  }

  const loadMessagesLength = () => {
    axios.get(BACKEND + "getMessagesLength").then(r => {
      setMessagesLength(r.data.messagesLength)
    })
  }


  return (
    <AppRoot>
      <div className="App pb-5">
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
        {
          showSpinner &&
            <div className="loadingSpinner">
                <ScreenSpinner/>
            </div>
        }
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
          <input type="file" id="inputUpload" onChange={onFileUpload} accept="application/JSON" className="d-none"
                 ref={inputRef}/>

          <div className="mt-5 messages-list">
            <div className="controls mb-4">
              <Checkbox
                checked={messages.length <= selectedMessages.length && messages.length !== 0}
                onChange={onClickSelectAll}
              >
                Выбрать все письма
              </Checkbox>

              <div className="d-flex">
                <Button className="me-2"
                        disabled={selectedMessages.length === 0}
                        onClick={readSelected}
                >
                  Пометить выбранные прочитанными
                </Button>
                <Button className="me-2"
                        disabled={selectedMessages.length === 0}
                        onClick={unreadSelected}
                >
                  Пометить выбранные непрочитанными
                </Button>
                <Button
                  disabled={selectedMessages.length === 0}
                  onClick={toggleSelected}
                >
                  Поменять статус у выбранных
                </Button>
              </div>
            </div>

            {

              messages.length > 0 ?
                <Card style={{overflow: "hidden"}} className="messages-tint">
                  <div className="list-view" id="messages_list" ref={messagesListRef}>
                    {
                      messages.map((message, index) => {
                        return (
                          <MessageItem
                            key={index}
                            id={"message_" + message.index}
                            toggleSelect={() => onClickToggleMessageSelect(index)}
                            selected={selectedMessages.includes(index)}
                            message={message}
                            openPreview={() => openPreview(message)}
                          />
                        )
                      })
                    }
                  </div>
                </Card> : showSpinner ?
                  <h3 className="text-center">Сообщения грузятся...</h3> :
                  <h3 className="text-center">Ничего не нашлось :(</h3>
            }
          </div>
        </main>
      </div>
    </AppRoot>
  );
}

export default App;
