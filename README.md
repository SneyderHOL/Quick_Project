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
``` JSON
{
    "total_kms": 1207,
    "duration": "32h",
    "fuel_price": 420000,
    "other_expenses": 165000,
    "tolls": {...},
    "path": {...},
    "total_price": 1525000,
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
``` sh
git clone git@github.com:SneyderHOL/Quick_Project.git
```
Before to start you need to install the dependecies
``` sh
npm install
```

The dependencies are going to be installed inside the container, keep in mind that the containers
are designed to work in development mode, if desired change the mode you need to edit the
docker-compose and replace the following line
``` sh
command: "sh -c 'npm run dev'" ------> "sh -c 'npm run start'"
```

So that the container is running and you can communicate with it, run it at port 300
``` sh
docker-compose up -d
```

In order to see the API responses (logs) -> execute the following command:
``` sh
docker logs test
```


When you have finished testing and running the project you can remove the container with the
next command
``` sh
docker-compose down
```


### Running the tests
![](img/testingJS.png)

### Built with 🛠️
The core language used to develop the application is
- Node.js - 12.16.1

The libraries that will be used to develop the application are:
- mongoose to use all the information as NoSQL
- redis for API authentication and security
- Swagger for API documentation

Frameworks:
- Express

---------

## Information 🗒
- [ ]  Information about the vehicles was obtained through the company Quick and from the following resources:
-  https://www.budgetdirect.com.au/car-insurance/research/average-fuel-consumption-australia.html
-  https://drive.google.com/file/d/1chP-YlXZpYQj-agxaqHkMldBp3LxymDB/view?usp=sharing
-  https://drive.google.com/file/d/1GA9R69hIzqO9SgXhE8PKEXwyD4NKY5N5/view?usp=sharing
-  https://theicct.org/sites/default/files/publications/HDVemissions_oct09.pdf
-  https://dspace.ups.edu.ec/bitstream/123456789/10009/1/UPS-GT001116.pdf


- [ ]  For more information on toll collection, you can follow the following repository:
-  https://github.com/andresvanegas19/tolls-colombia-2020


------
### authors 🗒
- Juan Carlos Rengifo Front-end
- Jefferson Alexander Leon Front-end
- Eduard Sneyder Amador DevOps
- Andres Santiago Reyes Back-end
