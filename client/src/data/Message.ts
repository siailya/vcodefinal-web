export class Author {
  constructor(value: any) {
    for (let key of Object.keys(value)) {
      if (this.hasOwnProperty(key)) {
        this[key] = value[key]
      }
    }
  }

  name: string
  avatar: string
  email: string

  get fromString() {
    return `${this.name} <${this.email}>`
  }
}

export class File {
  constructor(value: any) {
    for (let key of Object.keys(value)) {
      if (this.hasOwnProperty(key)) {
        this[key] = value[key]
      }
    }
  }

  filePath: string
  preview: string
}

export class Message {
  constructor(value: any) {
    for (let key of Object.keys(value)) {
      if (key === "author") {
        this.author = new Author(value["author"])
      } else if (key === "file") {
        this.file = new File(value["file"])
      } else if (this.hasOwnProperty(key)) {
        this[key] = value[key]
      }
    }
  }

  author: Author
  dateTime: string
  text: string
  title: string
  newThread: boolean
  important: boolean
  flag: boolean
  confidence: boolean
  finance: boolean
  read: boolean
  file?: File
}
