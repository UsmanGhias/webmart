FROM node:21.6.2

# Set the working directory inside the container
WORKDIR ./

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Express app will run
EXPOSE 5000

# Command to run your Node.js application
CMD ["npm", "start"]
