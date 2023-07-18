FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /home/app
COPY package.json ./
COPY package-lock.json ./
RUN npm i

FROM node:16-alpine AS builder
WORKDIR /home/app
COPY --from=dependencies /home/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
CMD ["npm", "run", "dev"]
