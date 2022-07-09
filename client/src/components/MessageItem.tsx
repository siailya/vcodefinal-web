import {Avatar, Cell, Checkbox, SimpleCell} from "@vkontakte/vkui";

// @ts-ignore
const MessageItem = ({message, selected, toggleSelect, openPreview}) => {
  const getClass = () => {
    const tokens = ["message-item"]

    if (selected) {
      tokens.push("selected")
    }

    if (!message.read) {
      tokens.push("unread")
    } else {
      tokens.push("read")
    }

    if (message.flag) {
      tokens.push("flag")
    }

    if (message.confidence) {
      tokens.push("confidence")
    }

    return tokens.join(" ")
  }

  return (
    <Cell
      className={getClass()}
      before={
        <Checkbox
          checked={selected}
          onChange={toggleSelect}
        >
        </Checkbox>
      }
      description={JSON.stringify(message.selected)}
    >
      <div className="d-flex align-content-center message-item__inner">
        <div className="from">
          <SimpleCell
            description={message.author.name}
            before={<Avatar src={message.author.avatar}/>}
            className="from-message"
          >
            {message.author.email}
          </SimpleCell>
        </div>
        <div className="my-auto preview row align-content-center">
          <div className="col-1 d-flex">
            {
              !message.read && <div className="unread-indicator my-auto"></div>
            }
            {
              message.important &&
                <span className="material-icons-outlined ms-1 my-auto important-indicator">priority_high</span>
            }
            {
              message.flag && <span className="material-icons-outlined flag-indicator ms-1 my-auto">flag</span>
            }
          </div>
          <div className="col-9">
            <h6 className="m-0 w-100 title-message d-flex">
              {
                message.finance && <span className="material-icons-outlined my-auto me-1 finances-indicator">paid</span>
              }
              <span className="my-auto w-100" style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                Re: {message.title}
              </span>
            </h6>
            <div className="d-inline-block text-message w-100 position-relative">
              {message.text}
              {
                message.file &&
                  <div className="position-relative">
                      <div className="attachment d-flex me-auto mt-3" onClick={openPreview}>
                          <img src={message.file.preview} className="me-1 my-auto"/>
                          <span className="my-auto filename">{message.file.filePath}</span>
                      </div>
                  </div>
              }
            </div>
          </div>
          <div className="time-send col-2 d-flex">
            <span className="my-auto">{message.dateTime}</span>
            <span className="material-icons-outlined lock-indicator my-auto ms-1">lock</span>
          </div>
        </div>
      </div>
    </Cell>
  )
}

export default MessageItem
