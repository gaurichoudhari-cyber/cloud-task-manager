# Step 1: Node.js image 
FROM node:18

# Step 2: create folder inside the container
WORKDIR /app

# Step 3: Dependencies install
COPY package*.json ./
RUN npm install

# Step 4 : copy code
COPY . .

# Step 5: Port batana
EXPOSE 3000

# Step 6: App start 
CMD ["node", "index.js"]