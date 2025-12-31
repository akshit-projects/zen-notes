# Use Node.js base image
FROM node:18

WORKDIR /app

# Copy and install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy and build frontend
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Copy rest of the backend code
COPY server ./server

# Expose the backend port
EXPOSE 9000

# Start backend
CMD ["node", "server/index.js"]
