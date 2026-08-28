# 1. Base Image
FROM node:22-alpine

# 2. Set Working Directory
WORKDIR /app

# 3. Environment Variables
ENV NODE_ENV=production

# 4. Copy Package Manifests
COPY package*.json ./

# 5. Install Dependencies cleanly
RUN npm ci --only=production

# 6. Copy Source Code
COPY . .

# 7. Expose Server Port
EXPOSE 8000

# 8. Set Security User (Non-Root)
USER node

# 9. Default Execution Command
CMD ["node", "index.js"]
