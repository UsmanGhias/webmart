# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Expose the port the app runs on
EXPOSE 3001

# Define environment variable
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"] 