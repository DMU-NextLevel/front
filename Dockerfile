FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN yarn install --production

CMD ["yarn", "start"]
