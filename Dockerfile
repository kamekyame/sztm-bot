FROM denoland/deno:alpine-1.25.3

WORKDIR /home/sztm
COPY . .

RUN deno cache --no-check=remote --unstable src/main.ts

CMD deno run -A --no-check=remote --unstable src/main.ts