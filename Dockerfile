FROM denoland/deno:alpine-1.29.4

WORKDIR /home/sztm
COPY . .

RUN deno task cache

CMD deno task run