FROM denoland/deno:alpine-1.17.1

RUN apk add --no-cache curl

WORKDIR /home/sztm
COPY . .

RUN deno cache src/main.ts

CMD deno run -A src/main.ts $PORT