import * as winston from 'winston';

const loggingConsole = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.simple()
  ),
});

const transports = [];

transports.push(loggingConsole);

export const logger = winston.createLogger({
  transports,
});

if (process.env.NODE_ENV === 'test') {
  logger.pause();
}

export function makeLogger(name: string) {
  return logger.child({ module: name });
}
