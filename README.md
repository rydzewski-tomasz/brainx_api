# Brainx API

![](https://github.com/rydzewski-tomasz/brainx_api/actions/workflows/run-tests.yaml/badge.svg)

## Generating ecdsa keys
```
# Don't add passphrase
ssh-keygen -t ecdsa -b 256 -f ecdsa256.key -m PEM 
openssl ec -in ecdsa256.key -pubout -outform PEM -out ecdsa256.key.pub
cat ecdsa256.key | sed 's/$/\\n/' | tr -d '\n'
cat ecdsa256.key.pub | sed 's/$/\\n/' | tr -d '\n'
```

