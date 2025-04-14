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

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eco_routes.git
cd eco_routes
2. Install Dependencies
bash
Copy
Edit
npm install
3. Start the Development Server
bash
Copy
Edit
npm start
Then open:
👉 http://localhost:8080

🌐 Deployment
Deployed using Netlify

To deploy:

Create a production build:

bash
Copy
Edit
npm run build
Upload the /dist folder manually to Netlify via https://app.netlify.com/drop

Or set up continuous deployment from GitHub:

Build Command: npm run build

Publish Directory: dist

📚 Project Report
This project is supported by a 10,000+ word academic dissertation submitted to the University of Greenwich, addressing:

Sustainable transportation

Green software architecture

Environmental impact modeling

Integration of real-time APIs

📬 Author
Made with 💚 by Angel Raju
MSc Computing and Information Systems
University of Greenwich
