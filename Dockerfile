FROM denoland/deno:alpine-2.1.4

WORKDIR /home/sztm
COPY . .

RUN deno task cache

CMD deno task run