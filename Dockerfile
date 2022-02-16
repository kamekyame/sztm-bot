FROM denoland/deno:alpine-1.17.1

RUN apk add --no-cache curl

WORKDIR /home/sztm
COPY . .

RUN deno cache --no-check=remote --unstable src/main.ts

CMD deno run -A --no-check=remote --unstable src/main.ts $PORT