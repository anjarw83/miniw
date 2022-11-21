# Mini Wallet
Sample Exercise mini wallet

Requirements:
* NodeJs
* MongoDb

## Installation
 
Install all Dependencies
```
npm i
```

Initialize Database

```
npm run migration:up
```

Ensure all migration up

```
npm run migration:status
```


## Run Application
Copy `sample.env` to `.env`

```
cp sample.env .env
```

Adjust Port and db connection `.env` files

Default apps port is `9000` & db port at `27017`

Run apps using
```
npm run start
```

### List API Sample

- Register new user

```
curl -X POST --location "http://localhost:9000/api/v1/register" \
    -H "Content-Type: application/json" \
    -d "{
          \"firstName\": \"Johan\",
          \"lastName\": \"Maulana\",
          \"displayName\": \"Johan Maulana\",
          \"email\": \"johanmaulana01@mailinator.com\",
          \"password\": \"johan123\"
        }"
```

- User Signin ( required if token expired )
```
curl -X POST --location "http://localhost:9000/api/v1/signin" \
    -H "Content-Type: application/json" \
    -d "{
          \"email\": \"johanmaulana01@mailinator.com\",
          \"password\": \"johan123\"
        }"
```

- Init Wallet Account
```
curl -X POST --location "http://localhost:9000/api/v1/wallet/init" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "Authorization: Token {{accessToken}}" \
    -d "customer_xid=6379db9a835d237bec1412c2"
```

- Enable Wallet
```
POST http://localhost:9000/api/v1/wallet
Authorization: Token {{accessToken}}
```

- Disable Wallet
```
PATCH http://localhost:9000/api/v1/wallet
Authorization: Token {{accessToken}}
```

- View Wallet Balance
```
GET http://localhost:9000/api/v1/wallet
Authorization: Token {{accessToken}}
```

- Add Money to Balance
```
POST http://localhost:9000/api/v1/wallet/deposits
Content-Type: application/x-www-form-urlencoded
Authorization: Token {{accessToken}}

amount=125000&reference_id=acexps9arzqajiys3jidukxo
```

- Withdraw Money
```
POST http://localhost:9000/api/v1/wallet/withdrawals
Content-Type: application/x-www-form-urlencoded
Authorization: Token {{accessToken}}

amount=50000&reference_id=acexps9arzqajiys3jidukxp
```

Thank you.