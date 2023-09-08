To run this thing

docker-compose up
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
npm run dev