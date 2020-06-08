const NotFoundCode = 0

export default class NotFoundError {
  type = 'resource'
  code = NotFoundCode
  message: string
  constructor(message: string) {
    this.message = message
  }
}
