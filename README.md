# Quick project ⚡️
## API rest

This project solves the problem of calculating the total cost of the trip by a route with precision.
This problem already occurs due to the lack of information, therefore the project provides the solution to the
development of an API Rest that performs the calculation of costs incurred on a journey that includes expenses
fixed and variable as well as the costs incurred in tolls according to the route.

In order to see the operation of this API, swagger will be used where the documentation will be. There you can
interact and find the route that suits you best.
![](img/docs.png)

Within the documentation will be the specification of which parameters will have to be passed to see
an exact result and as you wish. The following JSON is the result we hope to deliver on time
to request our service.
```
{
    "fuel_price": 420000,
    "total_kms": 1207,
    "duration": "32h",
    "other_expenses": 165000,
    "tolls": {...},
    "path": {...},
    "total_price": 1525000,
    ...
}
```

The following resources were needed for the development of this project:

[API peajes](https://api-tolls.herokuapp.com/api-docs): It is a service with updated toll prices
in Colombia


[API Google Routes](https://developers.google.com/maps): A service provided by google where it predicts
which is the most suitable route to reach the destination.

---

### pre-requisite
Before starting, it is important to consider the following programs in order to execute the project
  - Docker
  - Git
  - Node


# start 🚀
To be able to run the application and use it in a local development environment you can follow
the following steps:

Clone the repository to have the local project:
```
git clone git@github.com:SneyderHOL/Quick_Project.git
```
Before to start you need to install the dependecies
```
npm install
```

The dependencies are going to be installed inside the container, keep in mind that the containers
are designed to work in development mode, if desired change the mode you need to edit the
docker-compose and replace the following line
```
command: "sh -c 'npm run dev'" ------> "sh -c 'npm run start'"
```

So that the container is running and you can communicate with it, run it at port 300
```
docker-compose up -d
```

In order to see the API responses (logs) -> execute the following command:
```
docker logs test
```



When you have finished testing and running the project you can remove the container with the
next command
```
docker-compose down
```


### Running the tests
Coming...


### Built with 🛠️
The core language used to develop the application is
- Node.js - 12.16.1

The libraries that will be used to develop the application are:
- mongoose to use all the information as NoSQL
- JWT for API authentication and security
- Swagger for API documentation
- Bodyparser

Frameworks:
- Express


### authors 🗒
- Jefferson Alexander Leon Back-end
- Juan Carlos Rengifo Back-end
- Eduard Sneyder Amador DevOps
- Andres Santiago Reyes DevOps
