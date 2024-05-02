FROM denoland/deno:alpine-1.43.1

WORKDIR /home/sztm
COPY . .

RUN deno task cache

CMD deno task run