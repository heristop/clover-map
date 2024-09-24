# JSON Configuration Format

The JSON configuration file should adhere to the following structure to be compatible with Clover Map:

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

By following this guide, you can effectively utilize Clover Map to manage your projects, import/export data seamlessly, and maintain a well-organized JSON configuration.
