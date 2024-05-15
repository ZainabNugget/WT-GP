
**General**

**To install angular:**
    ng new blog

**To run the angular app:**
    open terminal then go into the blog directory:
        cd blog
        ng serve --open

**To add a component**
    go into the frontend folder terminal
    type ng generate component "component-name"
    then go into frontend/src/app/app.component.ts and import the component
        for example: import { NavigationComponent } from './navigation/navigation.component';
        then add 'NavigationComponent' to the imports within the component
    Add the component into the app.component.html file
        you can check the html tag in the component.ts file

**First iteration of backend development**
    Added sign up and log in mechanisms
        used:
            express and cookies
            components
            http client
            API_ENDPOINT as the backend link
            emitters and services

**Second iteration of backend development**
    To add, post details pages and comments
                 images to the database

