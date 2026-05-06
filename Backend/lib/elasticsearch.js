const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

// Hàm kiểm tra kết nối với cơ chế Retry
const checkConnection = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await esClient.info();
      console.log('Successfully connected to Elasticsearch');
      return true;
    } catch (error) {
      console.log(`Elasticsearch not ready, retrying... (${i + 1}/${retries})`);
      if (i === retries - 1) {
        console.error('Could not connect to Elasticsearch after several attempts.');
      } else {
        // Đợi 5 giây trước khi thử lại
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  }
  return false;
};

// Gọi hàm kiểm tra khi khởi động
checkConnection();

module.exports = esClient;
