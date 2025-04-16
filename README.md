# 📝 ToDoHelper

**ToDoHelper** is a web application designed to assist users with task planning by breaking down complex tasks into manageable steps using AI. The project follows an **MVC architecture** and consists of a frontend built with vanilla JavaScript, HTML, and CSS, and a backend powered by **Node.js** and **Express.**

## 💡 Purpose & Background

ToDoHelper was created with the goal of supporting users who experience cognitive or executive functioning challenges. The application uses AI to break down tasks into smaller, manageable steps — a feature that can be especially helpful for users with ADHD, autism, or stress-related difficulties.

As someone with a professional background in social work, I’ve seen firsthand how digital tools can either empower or exclude. With this project, I wanted to combine my technical skills with my understanding of accessibility and neurodiversity to create a meaningful, supportive interface.

This is an ongoing project and a personal passion — aimed at making technology more inclusive.

## ✨Features

✅ Breaks down tasks into manageable steps using OpenAI
✅ Supports different levels of detail for task breakdown
✅ Simple and intuitive UI for seamless interaction
✅ Modular code structure following MVC principles

## 🚀Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ToDoHelper.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ToDoHelper
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Add your OpenAI key to your .env file:
   ```bash
   OPENAI_API_KEY=your_api_key_here
   ```

## 📌Usage

1. Start the application:
   ```bash
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000`

## 📂 Project Structure

```
ToDoHelper/
│
├── frontend/
│   ├── js/
│   │   ├── app.js         # Main application entry point
│   │   ├── tasks.js       # Task management logic
│   │   └── ui.js          # UI rendering and DOM manipulation
│   ├── css/
│   │   └── styles.css     # Application styles
│   └── index.html         # Main HTML file
│
└── backend/
    ├── config/
    │   └── config.js      # Configuration settings
    ├── controllers/
    │   └── taskController.js
    ├── routes/
    │   └── api.js         # API route definitions
    ├── middleware/
    │   └── errorHandler.js
    ├── utils/
    │   └── aiHelper.js    # OpenAI integration
    └── server.js          # Express server setup
```

## 🛠️ Technologies Used

- **Frontend**:
  - HTML5
  - CSS (with responsive design)
  - Vanilla JavaScript (ES Modules)
- **Backend**:
  - Node.js
  - Express.js
  - OpenAI API (using the `openai` Node.js package)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
