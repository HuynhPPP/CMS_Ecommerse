const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CMS E-commerce API',
      version: '1.0.0',
      description: 'API documentation for the CMS E-commerce project',
      contact: {
        name: 'HuynhPPP',
        email: 'tankhuong02@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8386',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js', './controllers/*.js', './docs/**/*.yaml'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
