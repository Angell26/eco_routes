# 🌍 Eco-Routes – Environmentally Friendly Travel Path Optimization
![Screenshot 2025-04-14 030619](https://github.com/user-attachments/assets/6439c925-773a-4aca-9e95-23f6d6701fac)

[![Netlify Status](https://api.netlify.com/api/v1/badges/2e4a0f47-f3ea-4a42-a7d5-4ad1267b81b5/deploy-status)](https://app.netlify.com/sites/earnest-bombolone-ceb0ff/deploys)

**Live Site**: [https://earnest-bombolone-ceb0ff.netlify.app/](https://earnest-bombolone-ceb0ff.netlify.app/)

---

## 📌 Overview

**Eco-Routes** is a sustainable web application that helps users discover **eco-friendly travel paths** using real-time data on traffic, weather, and public transit. The goal is to **reduce carbon emissions** while enabling smarter, environmentally conscious travel decisions.

This project was developed as part of the final dissertation for the MSc in Computing and Information Systems at the University of Greenwich.

---

## 🚀 Features

- ♻️ Carbon footprint-aware route suggestions  
- 🚶‍♀️🚲🚇 Multi-modal transport integration (walk, bike, transit)  
- 📊 Real-time environmental impact display  
- 📍 Interactive maps powered by Leaflet  
- 🔄 Live traffic, weather, and transport updates  

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Styled-Components, Framer Motion  
- **Maps**: Leaflet, React-Leaflet  
- **APIs**: Google Maps API, OpenWeatherMap, TfL, TomTom  
- **Build Tools**: Webpack, Babel  
- **Hosting**: Netlify  

---

## 📦 Folder Structure

eco_routes/ ├── public/ │ └── index.html ├── src/ │ ├── components/ │ ├── pages/ │ ├── assets/ │ ├── styles/ │ └── index.js ├── package.json ├── webpack.config.js └── .gitignore

yaml
Copy
Edit

---

## 🖥️ How to Run Locally

### 1. Clone the repository
bash
Copy
git clone https://github.com/your-username/eco_routes.git
cd eco_routes
2. Install Dependencies
bash
Copy
npm install
3. Start the Development Server
bash
Copy
npm start
Then open:
👉 http://localhost:8080

🌐 Deployment
To deploy the application on Netlify, follow these steps:

1. Create a Production Build
bash
Copy
npm run build
2. Upload the /dist Folder to Netlify
Go to Netlify and upload the /dist folder manually.

Alternatively, set up continuous deployment from GitHub:

Build Command: npm run build

Publish Directory: dist
📬 Author
Made by Angel
