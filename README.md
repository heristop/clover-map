# TreeMapPulse

**TreeMapPulse** is a versatile project management tool designed to track the progress of various types of projects and processes. Initially created for monitoring the migration of Information Systems or applications, **TreeMapPulse** helps you visualize and monitor the status of your projects effectively.

![screenshot](/public/screenshot.png)

## ✨ Features

- **Migration Tracking**: Effortlessly monitor the progress of migrations and transitions to ensure smooth operations.
- **Task Management**: Efficiently track tasks, subtasks, and their statuses to keep your projects organized and on schedule.
- **Customizable Statuses**: Define and customize statuses to fit your specific workflow, providing flexibility for various project needs.
- **Import/Export**: Easily import project data from JSON files and export current project data for backup or sharing.
- **Responsive Design**: Enjoy a seamless experience across desktops, tablets, and mobile devices with a fully responsive interface.
- **Editing and Customization**: Edit node labels, add new nodes, and delete or move existing nodes to tailor your project structure.
- **Drag and Drop**: Intuitively drag and drop nodes within the same level to reorder tasks and sections.
- **Visual Indicators**: Use visual cues to represent statuses, progress, and other key project metrics.
- **And More**: Discover additional features designed to optimize your project management experience.

## 🛠️ Installation

To install and run **TreeMapPulse** locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/heristop/tree-map-pulse.git
    cd tree-map-pulse
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Start the development server:

    ```bash
    pnpm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## 📚 Usage

### Loading Configuration

- **From Local Storage**: If a saved configuration is present in local storage, TreeMapPulse will automatically load it upon startup. This ensures your previous session's data is readily available.
- **From API**: If no local configuration is found, you can easily load a sample configuration by clicking the "Load Sample Data" button. This allows you to quickly start working with a predefined setup.

### Importing and Exporting Data

- **Import**:
  - Navigate to the configuration panel.
  - Click the upload button to import project data from a JSON file.
  - Select your JSON file from the file dialog. The imported data will replace the current configuration, allowing you to seamlessly continue your work.
- **Export**:
  - In the configuration panel, click the save button.
  - This will export the current project data to a JSON file, preserving your work and enabling easy sharing and backup.

### Managing Projects

- **Adding/Updating Statuses**:
  - Open the configuration panel to manage statuses.
  - You can add new statuses to categorize tasks more effectively, update existing ones to reflect changes in your workflow, or remove obsolete statuses.
- **Updating Tasks**:
  - Click on any task to cycle through its statuses.
  - This intuitive interface allows for quick updates, ensuring your project board accurately reflects the current state of each task.

### JSON Configuration Format

The JSON configuration file should adhere to the following structure to be compatible with TreeMapPulse:

```json
[
  {
    "key": "project-1",
    "name": "Project 1",
    "children": [
      {
        "key": "task-1",
        "name": "Task 1",
        "status": "In Progress",
        "children": []
      },
      {
        "key": "task-2",
        "name": "Task 2",
        "status": "Done",
        "children": []
      }
    ]
  }
]
```

- `key`: A unique identifier for the section or task, ensuring each element is distinct.
- `name`: The name of the section or task, providing a clear label for easy identification.
- `status`: The current status of the section or task (e.g., "In Progress", "Done"), allowing for effective tracking and categorization.
- `children`: An array of nested sections or tasks, supporting hierarchical project structures.
- `isCollapsed` (optional): A boolean flag indicating whether the section should be collapsed, helping to manage the visibility of complex structures.

By following this guide, you can effectively utilize TreeMapPulse to manage your projects, import/export data seamlessly, and maintain a well-organized JSON configuration.

## 📄 License

This project is licensed under the MIT License.

## 💬 Feedback and Contributions

We welcome feedback and contributions! If you have any suggestions or encounter any issues, please feel free to open an issue or submit a pull request.

---

![Logo](/public/logo-80x80.png)
