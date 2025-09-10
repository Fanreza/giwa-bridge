#!/bin/bash

docker container stop aethereal-giwa-bridge
docker container rm aethereal-giwa-bridge
docker image rm aethereal-giwa-bridge
docker build -t aethereal-giwa-bridge .
docker run -d -p 4005:3000 --restart unless-stopped --name aethereal-giwa-bridge aethereal-giwa-bridge
