# TreemapFlow

**TreemapFlow** is an intuitive project management tool that uses treemap visualization to help you track, manage, and optimize various projects and workflows. Originally conceived for monitoring Information System migrations, TreemapFlow has evolved into a versatile solution for visualizing and managing complex hierarchical data structures across multiple domains.

![screenshot](/public/screenshot.png?a)

## ✨ Features

* **Treemap Visualization**: Represent complex project hierarchies with an intuitive overview
* **Dynamic Status Management**: Create and customize statuses to adapt to various project types
* **Interactive Navigation**: Easily move from overview to task details
* **Real-time Updates**: Instantly refresh task status with a single click
* **Multi-project Support**: Manage multiple projects and switch between them effortlessly
* **Responsive Design**: Enjoy a consistent experience across desktop and mobile
* **Data Import/Export**: Easily import and export your project structures in JSON
* **Drag-and-Drop**: Intuitively reorganize your project structure
* **Collapsible Sections**: Optimize your view by folding/unfolding project sections
* **Editing Tools**: Add, rename or delete sections and tasks directly in the interface
* **Visual Indicators**: Quickly assess progress through color-coded status indicators
* **Customizable Views**: Toggle between different display modes based on your preferences
* **No Database**: All data is stored locally in your browser

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
   * On first launch, click "Load Sample Data" to start with a pre-configured project.
   * Or, use the "Upload" button to import your own JSON project file.

2. **Navigate the Treemap**:
   * Click on sections to expand/collapse them.
   * Use the zoom and pan features to focus on specific areas.

### Managing Your Project

* **Update Statuses**: Click on a task to cycle through available statuses.
* **Edit Structure**: Use the edit mode to add, rename, or delete sections and tasks.
* **Customize Workflow**: Modify statuses in the configuration panel to match your process.

### Data Management

* **Import**: Click the "Upload" button to load a project from a JSON file.
* **Export**: Use the "Export" button to save your current project as a JSON file.

> [!TIP]
>
> * Toggle between dark and light modes for comfortable viewing.
> * Use the collapse/expand feature in the project panel for a cleaner interface.
> * Regularly export your project to backup your work.

For more detailed information on JSON structure and advanced features, please refer to our [documentation](docs/config.md).

## 💬 Feedback and Contributions

We welcome feedback, bug reports, and contributions! If you have suggestions for improvements or encounter any issues, please don't hesitate to open an issue or submit a pull request on our GitHub repository.

![Logo](/public/logo-80x80.png)
