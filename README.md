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

- Register User User Sample 

```
POST http://localhost:9000/api/v1/register
Content-Type: application/json

{
  "firstName": "Johan",
  "lastName": "Maulana",
  "displayName": "Johan Maulana",
  "email": "johanmaulana01@mailinator.com",
  "password": "johan123"
}
```

- User Signin ( required if token expired )
```
POST http://localhost:9000/api/v1/signin
Content-Type: application/json

{
"email": "johanmaulana01@mailinator.com",
"password": "johan123"
}
```

- Init Wallet Account
```
POST http://localhost:9000/api/v1/init
Content-Type: application/x-www-form-urlencoded
Authorization: Token {{accessToken}}

customer_xid=6379db9a835d237bec1412c2
```

- Enable Wallet
```
POST http://localhost:9000/api/v1/enable
Authorization: Token {{accessToken}}
```

- Disable Wallet
```
PATCH http://localhost:9000/api/v1/disable
Authorization: Token {{accessToken}}
```

- View Wallet Balance
```
GET http://localhost:9000/api/v1/balance
Authorization: Token {{accessToken}}
```

- Add Money to Balance
```
POST http://localhost:9000/api/v1/deposits
Content-Type: application/x-www-form-urlencoded
Authorization: Token {{accessToken}}

amount=125000&reference_id=acEXPs9ARzqAjIyS3JiDUkXo
```

- Withdraw Money
```
POST http://localhost:9000/api/v1/withdrawals
Content-Type: application/x-www-form-urlencoded
Authorization: Token {{accessToken}}

amount=50000&reference_id=acEXPs9ARzqAjIyS3JiDUkXp
```

Thank you.