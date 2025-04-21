FROM node:18-alpine
 
WORKDIR /app

 
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build
 
EXPOSE 4000

CMD ["npm","run", "start:dev"]
