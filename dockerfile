# ==============================
#  Base image
# ==============================
FROM node:20-bookworm-slim AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm

# ==============================
#  Dependencies
# ==============================
FROM base AS deps
RUN pnpm install --frozen-lockfile

# ==============================
#  Builder
# ==============================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build
RUN pnpm prune --prod   # chỉ giữ production deps

# ==============================
#  Runner
# ==============================
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# copy build output và deps đã prune
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
