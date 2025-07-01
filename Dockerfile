# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV JWT_SECRET=webmart-pakistan-jwt-secret-key-2024
ENV MONGO_URI=mongodb://mongo:27017/web-mart

# Start the application
CMD ["npm", "start"] 