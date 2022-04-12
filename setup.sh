cd ./server/
touch .env
echo 'SECRET="thisismysecret"' >> .env
echo 'SALTROUNDS=10' >> .env
echo 'PORT=3000' >> .env

mkdir uploads/
mkdir uploads/videos/
mkdir uploads/thumbnails/

npm i

cd ../hometube-react-frontend/

npm i

npm run build