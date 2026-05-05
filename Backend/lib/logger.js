const winston = require('winston');
const LogstashTransport = require('winston-logstash-transport').LogstashTransport;

// Cấu hình Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Chuyển log sang dạng JSON để ELK dễ phân tích
  ),
  transports: [
    // 1. Ghi log ra Console để bạn vẫn nhìn thấy ở terminal
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // 2. Gửi log tới Logstash (Docker) qua cổng 5044
    new LogstashTransport({
      host: process.env.LOGSTASH_HOST || 'localhost',
      port: process.env.LOGSTASH_PORT || 5044
    })
  ]
});

// Bắt lỗi nếu không kết nối được Logstash để server không bị crash
logger.on('error', (error) => {
  console.error('Error in logger transport:', error);
});

module.exports = logger;
