# Use Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight server to serve static files
RUN npm install -g serve

# Expose port inside container
EXPOSE 8080

# Start the app
CMD ["serve", "-s", "dist", "-l", "8080"]
