# Railway deployment configuration
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
