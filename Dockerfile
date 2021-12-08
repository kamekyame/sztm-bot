FROM denoland/deno:alpine-1.16.4

WORKDIR /home/sztm
COPY . .

RUN deno cache main.ts

CMD deno run -A main.ts $PORT