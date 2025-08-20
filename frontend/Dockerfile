FROM node:18-alpine

WORKDIR /app

# Accept API URL at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the application (uses REACT_APP_API_URL)
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"] 