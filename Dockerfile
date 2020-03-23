# Build for npm modules
FROM node:12 as build-stage

# Change working directory
WORKDIR /app

# Install npm production packages
COPY package*.json ./
RUN npm ci --only=production

# 2nd production image
FROM node:12-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /app/node_modules node_modules
COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]
