# Reservations API

## Response structure

The structure of the API responses' body is as follows:

-   for successful responses, a JSON object containing the properties:
    -   `success`: `true`
    -   `data`: An object, structure detailed for each route below.
-   for unsuccessful responses, a JSON object containing the
    properties:
    -   `success`: `false`
    -   `error`: An object containing a `message` property, and
        sometimes additional helpful properties.

## /api/v1/reservations

### GET

Get the all the reservations from the db.

**Return codes**:

-   200 - OK
-   400 - BAD_REQUEST (There was a problem fetching data)

**Usage example**:  
 `localhost:3100/api/v1/reservations`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "reservations": [
            {
                "guest": true,
                "_id": "5ead38cf340c241a2014b4b7",
                "email": "laura_stan@gmail.com",
                "userFirstName": "laura",
                "userLastName": "stan",
                "reservationDate": "2020-05-15T20:30:00.000Z",
                "phoneNumber": "0753533239",
                "numberOfSeats": 5,
                "restaurantId": "5e8c51298dc0561b64ecc341",
                "__v": 0
            },
            {
                "guest": true,
                "_id": "5ead3934340c241a2014b4b8",
                "email": "botez.georgiana99@gmail.com",
                "userFirstName": "georgiana",
                "userLastName": "botez",
                "reservationDate": "2020-05-25T18:30:00.000Z",
                "phoneNumber": "0755455477",
                "numberOfSeats": 2,
                "restaurantId": "5e8c51298dc0561b64ecc341",
                "__v": 0
            },
            {
                "guest": true,
                "_id": "5eb15306812dfb6a38aba88b",
                "email": "andra@yahoo.com",
                "userFirstName": "Andra",
                "userLastName": "Simion",
                "reservationDate": "2020-05-24T11:52:00.000Z",
                "phoneNumber": "0231341227",
                "numberOfSeats": 2,
                "restaurantId": "5eb11ec24f81a21fc863d642",
                "__v": 0
            }
        ]
    }
}
```

## /api/v1/reservations/:reservationId

### GET

Get a specific reservation by its id.

**Return codes**:

-   200 - OK
-   400 - BAD_REQUEST (There was a problem fetching data)

**Usage example**:  
 `localhost:3100/api/v1/reservations/5ead38cf340c241a2014b4b7`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "reservations": [
            {
                "guest": true,
                "_id": "5ead38cf340c241a2014b4b7",
                "email": "laura_stan@gmail.com",
                "userFirstName": "laura",
                "userLastName": "stan",
                "reservationDate": "2020-05-15T20:30:00.000Z",
                "phoneNumber": "0753533239",
                "numberOfSeats": 5,
                "restaurantId": "5e8c51298dc0561b64ecc341",
                "__v": 0
            }
        ]
    }
}
```

## /api/v1/reservations

### POST

Post a reservation to Reservation Database

**Return codes**:

-   201 - CREATED
-   400 - BAD_REQUEST

**Body example**

`userId` este optional.

```JSON
{
    "userId": "5eb175539dff1b3844a84ab8",
	"email": "andra@gmail.com",
    "userFirstName": "Andra",
    "userLastName": "Simion",
    "phoneNumber": "0231341227",
    "restaurantId": "5eb16d673a637d28884dc226",
    "numberOfSeats": 2,
    "reservationDate": "2020-05-24T15:52:00"
}
```

**Usage example**:  
 `localhost:3100/api/v1/reservations`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "reservation": {
            "guest": false,
            "_id": "5eb2868deefb31331c672029",
            "userId": "5eb175539dff1b3844a84ab8",
            "email": "andra@gmail.com",
            "userFirstName": "Andra",
            "userLastName": "Simion",
            "reservationDate": "2020-05-24T12:52:00.000Z",
            "phoneNumber": "0231341227",
            "numberOfSeats": 2,
            "restaurantId": "5eb16d673a637d28884dc226",
            "__v": 0
        }
    }
}
```

## /api/v1/reservations/:reservationId

### PATCH

Modifies a reservation in database.

**Return codes**:

-   202 - ACCEPTED
-   400 - BAD_REQUEST

**Body example**

```JSON
{
    "numberOfSeats": 5,
    "reservationDate": "2020-05-24T12:52:00"
}
```

**Usage example**:  
 `localhost:3100/api/v1/reservations/5eb2868deefb31331c672029`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "reservation": {
            "n": 1,
            "nModified": 1,
            "opTime": {
                "ts": "6823664913978753025",
                "t": 50
            },
            "electionId": "7fffffff0000000000000032",
            "ok": 1,
            "$clusterTime": {
                "clusterTime": "6823664913978753025",
                "signature": {
                    "hash": "e+aWUBjrZ7GkaQZD+ZvBkJppNpY=",
                    "keyId": "6759538930535628801"
                }
            },
            "operationTime": "6823664913978753025"
        }
    }
}
```

## /api/v1/reservations/:reservationId

### DELETE

Delete a reservation from database

**Return codes**:

-   200 - OK
-   204 - NO_CONTENT

**Usage example**:  
 `localhost:3100/api/v1/reservation/5eb152c9e6addf016c28e3ca`

**Returned data example**:

```JSON
{
    "success": true,
    "data": {
        "reservation": {
            "n": 1,
            "opTime": {
                "ts": "6823666073619922945",
                "t": 50
            },
            "electionId": "7fffffff0000000000000032",
            "ok": 1,
            "$clusterTime": {
                "clusterTime": "6823666073619922945",
                "signature": {
                    "hash": "tYTpYyRGGboR3ZmUUBxhpI6Jiqg=",
                    "keyId": "6759538930535628801"
                }
            },
            "operationTime": "6823666073619922945",
            "deletedCount": 1
        }
    }
}
```
