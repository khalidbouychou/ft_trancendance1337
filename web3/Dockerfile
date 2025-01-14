FROM debian

RUN apt update && apt install -y bash vim iproute2 ncat

RUN apt install nodejs npm -y

RUN npm install -g node-gyp truffle ganache-cli

COPY tools/startup.sh /

RUN chmod +x startup.sh

# ENV PRIVATE_KEY 0xDF1F5281594CD457780BE2DE7CE0834CC15F230258CD17F99541DEEAFDAD9BF2

# for truffle
WORKDIR /root

# init truffle dev int
RUN truffle init

# copy smart contract
COPY tools/HelloWorld.sol contracts/

# copy web3 migrations
COPY tools/1.deploy_contract.js migrations/

EXPOSE 7545

CMD ["/startup.sh"]
