import { Logger as LoggerInterface } from "../core/interfaces";
import { Logger } from "../core/initialization/setup/decorators/Logger";

@Logger()
export class MyLogger implements LoggerInterface {
  init (): void {}

  log (level: string, message: unknown): void {
    console.log(level, message)
  }

  fatal (message: unknown): void {
    console.error(message)
  }

  error (message: unknown): void {
    console.error(message)
  }

  warn (message: unknown): void {
    console.warn(message)
  }

  info (message: unknown): void {
    console.info(message)
  }

  debug (message: unknown): void {
    console.debug(message)
  }

  trace (message: unknown): void {
    console.trace(message)
  }
}