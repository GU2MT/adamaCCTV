FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package manifests first to leverage Docker cache
COPY package*.json ./

# Install production dependencies (development dependencies will be installed in container at runtime for dev)
RUN npm ci --only=production || true

# Copy remaining files
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
