/**
 * Logger interface
 */
export interface LoggerInterface {
  info: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
  notice: (message: string) => void;
  debug: (message: string) => void;
}
