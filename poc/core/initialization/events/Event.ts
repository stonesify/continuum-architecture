import { DataContainer } from '../../DataContainer'

export class Event<T> extends DataContainer<T> {
  constructor (
    public readonly type: string | Symbol,
    protected readonly data: T,
    protected readonly timeStamp: Date = new Date()
  ) {
    super(data)
  }

  /** @returns {string} */
  get name (): string | Symbol {
    return this.type
  }
}
