# Learning Management System (LMS)

![LMS Banner](https://via.placeholder.com/800x200?text=LMS+Platform)

## Overview

The Learning Management System (LMS) is a web application that helps manage learning resources, user authentication, file management, and real-time interaction with an AI assistant. This platform is built with FastAPI for the backend and uses modern web technologies to deliver a seamless learning experience.

## Features

- **User Authentication** - Secure login and registration system
- **File Management** - Upload, download, and manage learning materials
- **AI Integration** - Intelligent chatbot assistant for learning support
- **URL Management** - Track active URLs for learning resources
- **User Profiles** - Personalized user experience

## Architecture

```mermaid
graph LR
    Client[Web Browser] -- HTTP --> API[FastAPI Backend]
    API -- SQL --> DB[(PostgreSQL)]
    API -- Auth --> JWT[JWT Provider]
    API -- Files --> Storage[File Storage]
    API -- AI Queries --> OpenAI[OpenAI API]
```

## Quick Start

=== "Installation"

    ```bash
    # Clone the repository
    git clone https://github.com/gadm21/LMS.git
    cd LMS
    
    # Set up virtual environment
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    
    # Install dependencies
    pip install -r requirements.txt
    ```

=== "Configuration"

    ```bash
    # Set up environment variables
    export DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
    export SECRET_KEY="your-secret-key"
    export OPENAI_API_KEY="your-openai-api-key"
    ```

=== "Run the Application"

    ```bash
    # Start the server
    uvicorn server.main:app --reload --port 7050
    ```

## Deployment

The LMS is deployed on Vercel:

- **Production URL**: [lms-swart-five.vercel.app](https://lms-swart-five.vercel.app)

## Welcome to the LMS Platform

<div class="grid cards" markdown>

- :material-school: **Modern Learning Experience**  
  Engaging platform designed for effective education delivery and management
  
- :material-account-group: **Personalized Learning**  
  AI-driven content adaptation to optimize student engagement and success
  
- :material-chart-line: **Advanced Analytics**  
  Comprehensive insights to track progress and improve outcomes
  
- :material-shield-account: **Secure & Reliable**  
  Enterprise-grade security for your sensitive educational data

</div>

## Platform Overview

![LMS Platform Overview](https://via.placeholder.com/800x400?text=LMS+Platform+Overview)

The LMS Platform is a next-generation learning management system built with modern technologies. Our solution combines powerful AI capabilities with intuitive design to enhance the educational experience for both educators and learners.

## API Documentation

The REST API documentation is available at:

- Local: `http://localhost:7050/docs`
- Production: `https://lms-swart-five.vercel.app/docs`

## Contributing

Contributions are welcome! See the [contributing guide](dev-guide/contributing.md) for how to get started.
