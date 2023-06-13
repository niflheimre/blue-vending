# Blue Vending

## Background
Blue Vending is a Unicorn company that sells Vending machines to the market, and we want
to launch a new product called Simple Vending Machine for SMEs in our partnership. It will
help them to produce at the cheapest cost.
We need to develop software for Blue Vending Machine to have simple functionality and
easily add a new expansion in the future.

# installation

The project is dockerized. to start the project, please run

```sh
./pre-script.sh
```
then

```sh
docker-compose up
```

The Node server will listen on port 8080 and the web application will be running on localhost:3000. 

`(note): the project is running on development.`

# Directories


`/client`

Contains web application, implemented using React.Js with Ant Design for styled component

`/postgres`

Store DB data

`/server`

Contains Node.JS interact with PostgreSQL


