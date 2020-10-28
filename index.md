## Welcome to Quick Project

Quick Project is a RestAPI Portfolio Project where the main funcionality is the calculation of the cost that takes to a logistic company to transport a mercancy in a vehicle from an origin point to a destination point in Colombia, considering variables like route, tolls, vehicle, and more.

### About The Project

The Quick Project is developed with nodeJS and Express Framework for the back-end, MongoDB Atlas for storage and Redis for cache, the front-end implementation is developed with Gatsby that is a React-based open source framework. The API integration with the FrontEnd allows to display the main service of the API.

# Challenges
## Technical challenge:
We currently have a test front implemented in the Heroku cloud platform that we use to make requests to the API service that we are developing.
Since the front URL handles an https protocol, it was necessary to implement the ssl certificate on the AWS server where our API service is hosted since it presented us with a mixed content error. This brought some challenges as we had to use the services of a dns provider like GitHub education partner name.com to generate a domain name and SSL certificate. We initially had problems with the implementation as we had a missing CNAME record that was necessary to redirect the traffic to the AWS load balancer. We finally managed to resolve this error and the frontend is connecting properly.

On the other hand, one of the challenges we faced for a few weeks was the limitation of requests to an API and that the response we provided was slow due to the algorithm we had. In other words, our backend service needed to calculate which tolls were on a route, for this, this service consumed an API called Open Routes, this service only allowed us to access 40 times per minute, the problem was that we needed to consume this service more than 60 times per minute. Apart from the problem mentioned above, the service we had implemented took more than 30 seconds depending on the route. The solution we provided was to implement cache so that there would be a fast response and it would only consume the API once and not do it again. To implement this solution, the first thing we did was to document how we were going to implement it and what we were going to use. After a few days of documentation and using several services, we had the solution and it was to use Redis locally (a database for the use of cache) to save this information and use it when it is requested again. With this solution we could solve the two problems we had and improve the performance.


## Non-technical challenge:
We have requested information from our client to be implemented within the functions that are in charge of calculating the costs associated with a route; Information such as: variables that indicate the categories of cargo vehicles with which the client currently works, common and unconventional routes with which he claims to have problems in calculating costs and charging for the route to be carried out.
This information was provided incompletely, so we had to charge a route with inaccurate information. The solution was to leave some variables with default values to continue with the development with the option that these variables can be updated when the client provides the remaining information.

New requirements also emerged that had not been requested at first as a graphical interface, for which we had to renegotiate the business case to be able to add this new requirement and set the deadlines in which it must be delivered. This brought more workload to the group but we handled the situation by implementing an interface with a minimalist style. Initially handling the functions and calls to the api by a vanilla Javascript file to later migrate it to React if time permits.
Additionally we had to acquire credentials with google to be able to use and implement the following APIS: Directions - Geocoding - Maps JavaScript and Places. This development will be implemented using the services offered by Heroku for the deployment of applications.


The difficulties during this development helped us to grow in knowledge, work as a team in a proactive
and organized way to persevere in every detail in order to create a reliable and quality product,
implementing documentation, good practices and implementing reliable technologies and APIS.
This project will be part of our repository on GitHub along with other work done during our preparation
at the Holberton software academy, which helped us in our training process as full stack developers..
