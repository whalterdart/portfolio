export const environment = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'your_mongodb_atlas_uri_here',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: '7d',
  },
  port: process.env.PORT || 3001,
};
