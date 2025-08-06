# 🎨 Canvas Editor - Collaborative Drawing Application

A real-time collaborative canvas editor built with React and Fabric.js, featuring Firebase integration for data persistence and sharing capabilities. Create, edit, and share your drawings with others through shareable URLs.

![Canvas Editor Demo](https://your-canvas-editor.netlify.app)

## ✨ Features

### 🎯 Core Functionality

- **Drawing Tools**: Rectangle, Circle, Text, and Free Drawing (Pen)
- **Object Manipulation**: Select, move, resize, rotate objects
- **Real-time Collaboration**: Multiple users can edit the same canvas simultaneously
- **Persistent Storage**: Canvas state automatically saved to Firebase Firestore
- **Offline Support**: Continue working when Firebase is unavailable

### 🔗 Sharing & Collaboration

- **Shareable URLs**: Generate unique URLs for each canvas
- **View-Only Mode**: Share read-only versions of your canvas
- **Session Management**: Each canvas gets a unique session ID

### 🎨 Customization

- **Properties Panel**: Modify fill color, stroke color, stroke width, opacity
- **Responsive Design**: Works on desktop and mobile devices
- **Export Functionality**: Download canvas as PNG image

### 🔧 Technical Features

- **Offline Mode**: Graceful degradation when Firebase is unavailable
- **Manual Save**: Explicit save button for better control
- **Status Indicators**: Visual feedback for save status and connectivity
- **Error Handling**: Robust error handling and user feedback

## 🚀 Live Demo

Visit the live application: [Canvas Editor Demo](https://your-canvas-editor.netlify.app)

## 🛠️ Installation

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Firebase project (optional, for cloud features)

### Quick Start

1. **Clone the repository**

git clone https://github.com/yourusername/canvas-editor.git
cd canvas-editor

2. **Install dependencies**

npm install

3. **Start development server**

npm start

4. **Open your browser**

http://localhost:3000

The application will work in offline mode by default. To enable cloud features, see the Configuration section below.

## ⚙️ Configuration

### Firebase Setup (Optional)

To enable real-time collaboration and cloud storage:

1. **Create a Firebase Project**

- Go to [Firebase Console](https://console.firebase.google.com)
- Click "Create a project"
- Follow the setup wizard

2. **Enable Firestore Database**

- In your Firebase project, go to "Firestore Database"
- Click "Create database"
- Choose "Start in test mode" for development

3. **Get Firebase Configuration**

- Go to Project Settings → General → Your apps
- Click "Web" and register your app
- Copy the configuration object

4. **Configure Environment Variables**

- Go to Canvas-Editor→ src → firebase.js
- Update the following

REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id

## 📖 Usage

### Basic Operations

#### Creating Objects

- **Rectangle**: Click the "Rectangle" button in the toolbar
- **Circle**: Click the "Circle" button in the toolbar
- **Text**: Click the "Text" button, then double-click the text to edit
- **Free Drawing**: Click the "Draw" button and draw on the canvas

#### Manipulating Objects

- **Select**: Click the "Select" button, then click on objects
- **Move**: Drag selected objects
- **Resize**: Drag the corner handles of selected objects
- **Rotate**: Drag the rotation handle above selected objects
- **Delete**: Select objects and click the "Delete" button

#### Saving and Sharing

- **Manual Save**: Click the "Save" button to save to Firebase
- **Share**: Click the "Share" button to get shareable URLs
- **Export**: Click the "Export" button to download as PNG
- **New Canvas**: Click the "New" button to create a new canvas

### URL Structure

- **Edit Mode**: `https://yourapp.com/canvas/{unique-id}`
- **View-Only Mode**: `https://yourapp.com/canvas/{unique-id}?viewOnly=true`
- **Offline Mode**: `https://yourapp.com/canvas/offline`

## 📁 Project Structure

canvas-editor/
├── public/
│ ├── index.html
│ └── \_redirects
├── src/
│ ├── components/
│ │ ├── Canvas/
│ │ │ ├── CanvasEditor.jsx
│ │ │ ├── Toolbar.jsx
│ │ │ └── PropertiesPanel.jsx
│ │ ├── Layout/
│ │ │ ├── Header.jsx
│ │ │ └── ShareModal.jsx
│ │ └── UI/
│ │ └── StatusIndicator.jsx
│ ├── hooks/
│ │ ├── useCanvas.js
│ │ ├── useFirestore.js
│ │ ├
│ │ └── useScene.js
│ ├── App.js
│ ├── App.css
│ ├── index.js
│ ├── index.css
│ └── firebase.js
├
├── .gitignore
├
├── package.json
└── README.md

## 🔧 Built With

- **[React](https://reactjs.org/)** - Frontend framework
- **[Fabric.js](http://fabricjs.com/)** - HTML5 canvas library
- **[Firebase](https://firebase.google.com/)** - Backend services
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[Netlify](https://www.netlify.com/)** - Deployment platform

## 🐛 Troubleshooting

### Common Issues

#### Canvas Not Loading

- Check browser console for JavaScript errors
- Verify DOM element exists with correct ID
- Clear browser cache and refresh

#### Firebase Connection Issues

- Verify environment variables are set correctly
- Check Firebase project settings and security rules
- Ensure Firestore is enabled in Firebase console

#### Objects Not Appearing

- Check canvas dimensions and object coordinates
- Verify Fabric.js version compatibility
- Clear canvas and try again

#### Save/Load Problems

- Check network connectivity
- Verify Firebase configuration
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Fabric.js](http://fabricjs.com/) for the amazing canvas library
- [Firebase](https://firebase.google.com/) for backend services
- [React](https://reactjs.org/) team for the excellent framework
- [Netlify](https://www.netlify.com/) for easy deployment

**Made with ❤️ by Medhansh**

⭐ Star this repo if you found it helpful!
# canvas-editor
