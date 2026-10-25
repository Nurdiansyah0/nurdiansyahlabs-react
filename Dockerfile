# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files first (for efficient caching)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that Vite runs on (configured as 5173 in vite.config.js)
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
