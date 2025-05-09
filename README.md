
Built by https://www.blackbox.ai

---

# La Gestiona

## Project Overview
La Gestiona is a web-based application designed to effectively manage and keep track of various project folders. It allows users to add, modify, search, and delete folders, while also tracking the state of the folders. With a sleek design and intuitive navigation, La Gestiona makes folder management efficient and user-friendly.

## Installation
To run La Gestiona locally, you need to follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd la-gestiona
   ```

2. **Open the `index.html` file:**
   Simply open the `index.html` file in your preferred web browser to access the application.

3. **Make sure you have internet access:**
   Since the project uses Tailwind CSS from CDN, an active internet connection is required.

## Usage
Once the application is open in your browser, you can navigate through the following features:

- **Ajouter un dossier**: Input folder details and submit to add a new folder.
- **Liste des dossiers**: View a list of all added folders.
- **Modifier un dossier**: Modify existing folders.
- **Supprimer un dossier**: Remove folders from the list.
- **États**: Check the different states of your folders, including processed and missing documents.
- **Rechercher un dossier**: Search for a specific folder by name or by specifying a date range.

## Features
- **User-Friendly Interface**: Easy navigation through various sections for managing folders.
- **Dynamic Forms**: Forms that adapt as users input information.
- **Comprehensive Search**: Search for folders based on name and dates.
- **Responsive Design**: Works seamlessly across different devices.

## Dependencies
This project utilizes the following dependencies:
- **Tailwind CSS**: CSS framework for styling.
- **Font Awesome**: Icons for visual elements.

Note: Tailwind CSS and Font Awesome are included via CDN in the `index.html`.

## Project Structure
The project structure is as follows:

```
la-gestiona/
├── index.html           # The main HTML file that contains the user interface
├── css/
│   └── style.css        # Custom styles (if any) can be added here.
├── js/
│   └── app.js           # JavaScript file for dynamic functionality
```

### HTML File (`index.html`)
This main file contains the complete structure and design setup for the La Gestiona application, utilizing Tailwind CSS for styling and Font Awesome for icons.

### CSS Directory
This directory is currently designed to hold custom CSS files, if you need to extend the existing styles.

### JavaScript Directory
Contains the `app.js` file which holds the logic for handling user interactions and dynamic data management.

---

Feel free to contribute to this project, or create issues for any bugs or feature requests you may have. Enjoy managing your folders with La Gestiona!