module.exports = {
   "type": "postgres",
   "host": process.env.TYPEORM_HOST,
   "port": process.env.TYPEORM_PORT,
   "username": process.env.TYPEORM_USERNAME,
   "password": process.env.TYPEORM_PASSWORD,
   "database": process.env.TYPEORM_DATABASE,
   "synchronize": true,
   "logging": false,
   "entities": [
     "src/entity/**/*.ts",
   ],
   "migrations": [
    "src/migration/**/*.ts",
   ],
   "subscribers": [
     "src/subscribers/**/*.ts",
   ],
   "cli": {
     "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   },
}
