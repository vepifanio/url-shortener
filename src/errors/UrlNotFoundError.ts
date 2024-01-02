export class UrlNotFoundError extends Error {
  constructor() {
    super('URL not found.')
  }
}
