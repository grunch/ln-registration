# Lightning Network event registration app

Simple lightning event registration nodejs app, this app connects to a lnd node using gRPC.

# Instalation

To connect with a lnd node we need to set 3 variables in the `.env` file .

_LND_CERT_BASE64:_ LND node TLS certificate on base64 format, you can get it with `base64 ~/.lnd/tls.cert | tr -d '\n'` on the lnd node.

_LND_MACAROON_BASE64:_ Macaroon file on base64 format, the macaroon file contains permission for doing actions on the lnd node, for this app a good choice is to use the `invoice.macaroon` file, you can get it with `base64 ~/.lnd/data/chain/bitcoin/mainnet/invoice.macaroon | tr -d '\n'`.

_LND_GRPC_HOST:_ IP address or domain name from the LND node and the port separated by colon (`:`), example: `192.168.0.2:10009`.

To install just run:

```
$ git clone git@github.com:grunch/ln-registration.git
$ cd ln-registration
$ npm install
```

# Executing

```
$ npm start
```
