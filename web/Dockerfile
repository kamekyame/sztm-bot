FROM denoland/deno:alpine-1.17.1

WORKDIR /home/sztm
COPY . .

RUN deno cache web/src/main.ts

CMD deno run -A web/src/main.ts $PORT