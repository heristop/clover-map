# TreemapFlow

**TreemapFlow** is an intuitive project management tool that uses treemap visualization to help you track, manage, and optimize various projects and workflows. Originally conceived for monitoring Information System migrations, TreemapFlow has evolved into a versatile solution for visualizing and managing complex hierarchical data structures across multiple domains.

![screenshot](/public/screenshot.png)

## ✨ Features

- **Hierarchical Visualization**: Utilize treemap structures to represent complex project hierarchies, providing an at-a-glance view of your entire project landscape.
- **Dynamic Status Management**: Create, customize, and manage project statuses with ease, allowing for flexible workflow adaptation across different project types.
- **Interactive Project Navigation**: Seamlessly navigate through different levels of your project structure, from high-level overviews to granular task details.
- **Real-time Status Updates**: Instantly update and visualize the status of tasks and sections with a simple click, ensuring your project view is always current.
- **Multi-project Support**: Manage and switch between multiple projects effortlessly, keeping all your workflows organized in one place.
- **Responsive Design**: Enjoy a consistent and intuitive experience across desktop and mobile devices, allowing for project management on-the-go.
- **Data Import/Export**: Easily import project structures from JSON files and export your project data for backup or sharing purposes.
- **Drag-and-Drop Functionality**: Intuitively reorganize your project structure by dragging and dropping sections and tasks within the treemap.
- **Collapsible Sections**: Streamline your view by collapsing and expanding sections of your project, focusing on the most relevant information.
- **Project Editing Tools**: Add, rename, or delete sections and tasks directly within the interface, allowing for dynamic project structure modifications.
- **Visual Progress Indicators**: Quickly assess project progress through color-coded status indicators and intuitive visual cues.
- **Customizable View Options**: Toggle between different view modes (e.g., by name or key) to suit your project management style.
- **No Databasing**: No need to set up a database or server to use TreemapFlow. All data is stored locally in your browser's local storage.
- **And More**: Discover additional features designed to optimize your project management experience.

## 🛠️ Installation

To install and run **TreemapFlow** locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/heristop/treemap-flow.git
    cd treemap-flow
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

### Getting Started

1. **Load a Project**:
   - On first launch, click "Load Sample Data" to start with a pre-configured project.
   - Or, use the "Upload" button to import your own JSON project file.

2. **Navigate the Treemap**:
   - Click on sections to expand/collapse them.
   - Use the zoom and pan features to focus on specific areas.

### Managing Your Project

- **Update Statuses**: Click on a task to cycle through available statuses.
- **Edit Structure**: Use the edit mode to add, rename, or delete sections and tasks.
- **Customize Workflow**: Modify statuses in the configuration panel to match your process.

### Data Management

- **Import**: Click the "Upload" button to load a project from a JSON file.
- **Export**: Use the "Export" button to save your current project as a JSON file.

> [!TIP]
> - Toggle between dark and light modes for comfortable viewing.
> - Use the collapse/expand feature in the project panel for a cleaner interface.
> - Regularly export your project to backup your work.

For more detailed information on JSON structure and advanced features, please refer to our [documentation](docs/config.md).

## 📄 License

This project is licensed under the MIT License.

## 💬 Feedback and Contributions

We welcome feedback, bug reports, and contributions! If you have suggestions for improvements or encounter any issues, please don't hesitate to open an issue or submit a pull request on our GitHub repository.

![Logo](/public/logo-80x80.png)
