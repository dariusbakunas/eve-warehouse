import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ level: "debug" })]
});

export default logger;
