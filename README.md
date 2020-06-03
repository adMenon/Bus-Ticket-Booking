# Bus-Ticket-Booking

The backend server uses a JWT based login system. So initialy use the  Signup API to create an account.

Use the account credentials to login. On successful request, you will receive a jwt token. Use this for authorization for the User and Admin.


## APIs created

The service can be considered as a set of user APIs, admin APIs, and auth APIs

## Auth API's

### POST userAuth/signup 
  API for creating an account
 
  #### payload 
    {
        Name: (String),
        email: (String), // should be a proper email id
        Password: (String),
        PhoneNumber: (String), //should be a proper 10 digit phone number
        AdminCode:(environment variable), // include this field for admin
    }

### POST userAuth/login
  API for login

  #### payload
    {
      email: (string), //registered email
      Password: (string), // registered password
    }

  On success, token will be received for authentication.
  
## Admin API

### GET admin/allBuses
  API for viewing all the existing buses.

  Note -> the _id_ in the response is BusId

### POST admin/addBus
  API for adding a new bus with specified number of seats

  #### payload
    {
      noOfSeats:(Number)
    }

  Note -> Make sure the buses are added before the user makes requests.

### DELETE admin/deleteAll
  API for deleting all the Buses

### DELETE /admin/Bus/:BusID
  API for deleting bus by Id

### GET /admin/Bus/:BusID
  API for getting the details of open and closed seats and the passengers of a bus by id.

### PATCH /admin/Bus/:BusID
  API for reseting the seats of a bus by id.

## User API
  
### GET /newBooking/allBuses
  API for viewing all the buses. Use this for getting the BusID for further operations and requests like viewing seats and booking tickets.

### GET /newBooking/showOpen
  API for viewing open tickets of a bus. For booking tickets, choose from the open seats.

  #### payload
    {
      BusId: (String) // get this from 'Get all bus details' API
    }
### GET /newBooking/showClosed
  API for viewing closed tickets of a bus.

  #### payload
    {
      BusId: (String) // get this from 'Get all bus details' API
    }

### POST /newBooking/book
  API for booking tickets in a bus.


  #### payload
    {
      "Booking":[
        {
          "seatNo": (Number),
          "Passenger":{
            "Name": (String),
            "Gender": (String),
            "Age": (NUmber)
          }
        },
      ], // Booking is an array of objects, each for one seat
      "BusID": (String)
    }

  On success, tickets will be returned which will include BookingID which is required for viewing and cancelling tickets.
  
### POST /ticketStatus/viewTicket
  API for viewing booked ticket.

  #### payload
    {
       BookingID: (String) // get this from 'Book Tickets' API
       BusID: (String) 
    }
### PATCH /ticketStatus/deleteTicket
  API for Deleting tickets
  #### payload
    {
      "BookingID": (String), // get this from Book Ticket request
      "seats": (Array of Numbers denoting the seats to be cancelled),
      "BusID": (String)
    }
