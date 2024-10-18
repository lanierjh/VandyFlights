# VandyFlights
* Our product VandyFlights aims to aid Vanderbilt students find cheap flights whether for returning home or for vacations during times such as Fall and Spring break. Our product also aims to aid Vanderbilt students in finding out where other Vanderbilt students are going on vacation breaks. Collectively, we help to provide students with options of where to go on vacation breaks for the cheapest possible price by finding cheap flights to popular destinations other students are going to. This helps solve the chore of finding nice destinations to visit during vacation breaks, while keeping in mind the college student budget. Our scope extends to a social media platform where students who collectively went to a destination would be able to post pictures from their trip, which can further inform future students’ decisions on trips to take.
* Some frameworks we will be using is React and Typescript for the front end, Python for the backend, and a FastAPI framework to connect the two. Docker wioll be used for the hosting service for other users to use. MySQL will be used for the database, along with a SkyScanner API to connect real flights and times to our website.

## How to run

1) start mysql server
* Locally, Jane has been using ```brew services start mysql```, then ```mysql -u admin -p``` to login with our admin credentials.
2) in ```/path/to/VandyFlights/client``` run
```npm run dev```
* This runs the frontend code
3) run ```python venv/bin/fastapi dev core/routes.py```
* This starts the API routes
