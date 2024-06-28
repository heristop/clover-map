# TreePulse

🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜

**TreePulse** is a versatile project management tool designed to track the progress of various types of projects and processes. Initially created for monitoring the migration of Information Systems or applications, **TreePulse** helps you visualize and monitor the status of your projects effectively.

![screenshot](/public/screenshot.png)

## ✨ Features

- **Migration Tracking**: Monitor the migration progress of your Information Systems or applications.
- **Task Management**: Track tasks, subtasks, and their statuses.
- **Bug Tracking**: Manage bug reports, assign them to developers, and monitor their resolution.
- **Production Management**: Visualize production stages, quality control statuses, and inventory levels.
- **Sales and Marketing**: Follow marketing campaigns, sales opportunities, and contracts.
- **HR Management**: Track recruitment processes, employee training programs, and more.
- **Customizable Statuses**: Define and customize statuses to fit your specific workflow.
- **Import/Export**: Import project data from JSON files and export current project data for backup or sharing.
- **And more...**

## 🛠️ Installation

To install and run **TreePulse** locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/heristop/tree-pulse.git
    cd tree-pulse
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

- **From Local Storage**: If there is a saved configuration in local storage, TreePulse will load it automatically.
- **From API**: If no local configuration is found, you can load a sample configuration by clicking the "Load Sample Data" button.

### Importing and Exporting Data

- **Import**: Use the upload button in the configuration panel to import project data from a JSON file.
- **Export**: Use the save button in the configuration panel to export the current project data to a JSON file.

### Managing Projects

- **Adding/Updating Statuses**: In the configuration panel, you can add new statuses, update existing ones, or remove them.
- **Updating Tasks**: Click on a task to cycle through its statuses.

### JSON Configuration Format

The JSON configuration file should follow this format:

```json
[
  {
    "key": "project1",
    "name": "Project 1",
    "children": [
      {
        "key": "task1",
        "name": "Task 1",
        "status": "In Progress",
        "children": []
      },
      {
        "key": "task2",
        "name": "Task 2",
        "status": "Done",
        "children": []
      }
    ]
  },
  {
    "key": "project2",
    "name": "Project 2",
    "children": []
  }
]
```

- `key`: Unique identifier for the section or task
- `name`: Name of the section or task
- `status`: Current status of the section or task
- `children`: Nested sections or tasks

## 📄 License

This project is licensed under the MIT License.

## 💬 Feedback and Contributions

We welcome feedback and contributions! If you have any suggestions or encounter any issues, please feel free to open an issue or submit a pull request.
