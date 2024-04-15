FROM denoland/deno:alpine-1.42.3

WORKDIR /home/sztm
COPY . .

RUN deno task cache

CMD deno task run