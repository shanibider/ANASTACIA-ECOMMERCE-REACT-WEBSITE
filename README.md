# Comprehensive Clothing E-commerce React Website

## Overview

This is a comprehensive feature-rich e-commerce website developed as a server-client React application.
It includes secure user registration and login functionality via Firebase database. Utilizes MongoDB for data storage, and integrates PayPal API for secure payment processing during the demo order. The project also incorporates a shopping cart, review system, categorized product listings, and offers comprehensive admin and user actions.

### Languages and Tools used in this project:

[![My Skills](https://skillicons.dev/icons?i=js,react,html,css,bootstrap,mongodb,nodejs)](https://skillicons.dev)


## Technologies Used

- **Frontend:**
  - React
  - HTML5
  - Bootstrap
 
- **Backend:**
  - Node.js
  - Express.js

- **State Management:**
  - React Hooks (useState, useReducer, useContext, useEffect, useParams)

- **HTTP Requests:**
  - Axios
  - AJAX
  - Fetch API

- **Database:**
  - MongoDB (for product data)
  - Firebase (for user data)

- **Payment Integration:**
  - PayPal API

<br>

## Key Features

- [x] **Home Page:**
  - Lists products

- [x] **Detailed Product View:**
  - Provides in-depth information about a selected product

- [x] **Product Categories:**
  - Categorizes products for easy navigation

- [x] **Shopping Cart:**
  - Allows users to add and manage items in their cart

- [x] **Order Processing with PayPal:**
  - Securely handles payment processing using the PayPal API for demo purposes

- [x] **Secure User Registration and Login:**
  - Ensures a safe and secure user authentication system

- [x] **Admin Functionalities:**
  - Manages 'Products' and 'Orders' lists
  - Features a dashboard displaying real-time metrics: registered users, order count, and financial performance through total money orders.
  - Enables the creation, editing, and deletion of products

- [x] **User Functionalities:**
  - Accesses order history
  - Edits user profile

- [x] **About The Team Page:**
  - Provides information about the development team
    
<br>



## The application follows these key patterns:
THe architecture focuses on structured state management, components, and effective handling of side effects and navigation in a React app.

1. **State Management:**
   - Uses `useReducer` for organized state management.

2. **Global State:**
   - Manages global state for properties like `cart`, `userInfo`, `loading`, and `error`.

3. **Side Effects:**
   - Handles side effects, such as data fetching, with `useEffect`.

4. **Component Structure:**
   - Organizes the app into modular components, promoting a component-based architecture.

5. **React Router:**
   - Implements React Router for navigation.

6. **Conditional Rendering:**
   - Conditionally displays UI elements based on the application's state.

7. **Authentication Handling:**
   - Manages user authentication through global state.

8. **Middleware (`logger`):**
   - Uses a middleware function (`logger`) for state change logging.

9. **RESTful API Calls:**
   - Utilizes Axios for making API calls to a backend server.




<br>

## Ecommerce Website Preview :
### Demo Website

👉 Demo : 

<img src="https://user-images.githubusercontent.com/72359805/230923394-09e38358-b620-4bc1-a3f0-f2620eb510c0.mp4" alt=" Click here for Demo" width="300">



###### Home Page
![home](https://user-images.githubusercontent.com/72359805/230922135-b29b6c60-afd5-48ec-9fc4-d5e2e44a085a.PNG)

###### Product out of stock alert

![out of stock alert](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/58f0ea96-a220-47e3-a682-9e683fd04557)

###### Detailed Product View
![product](https://user-images.githubusercontent.com/72359805/230922485-2206ef84-98bf-42fa-8365-c2e0c192ade0.PNG)

###### Shopping Cart 
![cart](https://user-images.githubusercontent.com/72359805/230922510-57753e47-0df0-4e5e-8fe4-a7bbb61e810b.PNG)

###### Preview order  
![place order](https://user-images.githubusercontent.com/72359805/230922503-9a7df6f3-7203-43ac-87a8-a6453476bcde.PNG)


<br>

### Place an order via PayPal API:  

###### Place order  
![place order paypal](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/37f789f4-a0e5-4870-b250-89228553b3dc)

###### Checkout steps - shipping
![shipping](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/7986aa25-75fd-4cfa-b234-3e7e0858f897)

###### Checkout steps - payment method
![payment method](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/6207865a-b308-41b7-bb26-7ca75bcbe39c)

###### Place an order with demo user via PayPal
![place order paypal  demo 2](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/e98e741a-9e6a-44fb-bc25-02ff4215987b)

###### Paid order
![place order paypal  demo 3](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/86d4ae07-2cd3-474f-a51d-7e77d8c11cff)


<br>

## User functionality:

###### User order history
![order history](https://user-images.githubusercontent.com/72359805/230922850-bf35dce7-eaea-4ff2-9d95-741a9b0edb77.PNG)

###### User edit profile
![edit profile](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/422c48d0-a035-4e0c-91b0-711b9918a2b0)

<br>

## Admin functionality:

###### Admin dashboard displaying real-time metrics: registered users, order count, and financial performance through total money orders
![Admin info](https://user-images.githubusercontent.com/72359805/230922856-8218eadd-3c44-4689-8710-5757060e9177.PNG)

###### Products list
![proudcts list](https://user-images.githubusercontent.com/72359805/230922896-699796f4-1268-441f-b5c1-417273d1aec9.PNG)

######  Edit product 
![edit product](https://user-images.githubusercontent.com/72359805/230922907-bb0abeb0-6cad-42d3-9629-238447091dbd.PNG)

######  All users orders list
![orders list](https://user-images.githubusercontent.com/72359805/230922948-31ea760e-cccf-4d6c-b4ce-9b9b5d964419.PNG)

<br> 

###### Search bar
![search](https://user-images.githubusercontent.com/72359805/230922982-83d66ae1-cc6d-4cca-b5be-b21c1f7c7628.PNG)


###### about us page
![about us](https://user-images.githubusercontent.com/72359805/230923017-44b75026-def1-40bf-af5f-7d8f2d76ee1b.PNG)

![about us2](https://user-images.githubusercontent.com/72359805/230923021-ee53f35c-7676-485a-93a7-5f53cb9eaec9.PNG)

###### Spinner Component showing the loading state

![loadingBox component](https://github.com/shanibider/Anastacia-Ecommerce-React-Website/assets/72359805/51546c31-6154-4802-9eed-ea4128915cd9)





<br>

## Setup Instructions
1. Clone the repository: `git clone [repository_url]`
2. Set up the MongoDB database and Firebase authentication.
3. Configure environment variables.
4. Run Backend-
```
$ cd our-website
$ cd backend
$ npm i
$ npm start
```

5. Run Frontend-
   
open new terminal
```
$ cd our-website
$ cd frontend
$ npm i
$ npm start
```

Seed Users and Products (backend)-
Run this on browser: http://localhost:5000/api/seed
(Will returns admin email, password and sample products).

Admin Login-
Run http://localhost:3000/signin


<br>

## 🔗 Connect with me 👩‍💻😊
[![github](https://img.shields.io/badge/my_github-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shanibider)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shani-bider-0848b8177/)

<footer>
<p style="float:left; width: 20%;">
Copyright © Shani Bider, 2023
</p>
</footer>
