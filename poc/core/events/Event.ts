import { DataContainer } from '../DataContainer'

export class Event<T> extends DataContainer<T> {
  constructor (
    protected readonly data: T,
    public readonly type: string | symbol,
    protected readonly timestamp: Date = new Date()
  ) {
    super(data)
  }

  /** @returns {string} */
  get name (): string | symbol {
    return this.type
  }
}
