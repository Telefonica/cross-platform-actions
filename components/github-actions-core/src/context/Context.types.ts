import { LoggerInterface } from "../logger";
import { SecretServiceInterface } from "../secrets";

export interface ContextConstructorOptions {
  secretService: SecretServiceInterface;
  logger?: LoggerInterface;
}

export interface ContextConstructor {
  new (options: ContextConstructorOptions): ContextInterface;
}

export interface ContextInterface {
  readonly secretService: SecretServiceInterface;
  readonly logger?: LoggerInterface;
}
