#!/bin/bash

# start test chain
ganache-cli --host 0.0.0.0 --port 7545 --gasPrice 1 --account "${PRIVATE_KEY},0xffffffffffffffff" &

CONFIG_FILE="/root/truffle-config.js"

#replace some default values
sed -i 's/version: "[^"]*"/version: "0.8.17"/' ${CONFIG_FILE}
sed -i "s|// development: {|development: {|" ${CONFIG_FILE}
sed -i 's|//  host: "127.0.0.1",|host: "127.0.0.1",|' ${CONFIG_FILE}
sed -i 's|//  port: 8545|port: 7545|' ${CONFIG_FILE}
sed -i 's|//  network_id: "\*",|network_id: "\*",|' ${CONFIG_FILE}
sed -i '/(default: none)/ { N; s/\/\/ \(\},\)/\1/ }' ${CONFIG_FILE}

# compile smart contract
truffle compile

# deploy smart contract
truffle migrate

echo "all good, sleeping .."
sleep infinity
