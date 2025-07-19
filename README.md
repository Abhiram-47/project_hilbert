# Digital Writing Garden

A modern, flexible writing platform for blogs and notes with hierarchical organization.

## Features

- **Flexible Organization**: Create notes and blogs in any directory structure you want
- **Dual Content Types**: Separate blogs from casual notes with visual indicators
- **Live Preview**: Switch between edit and preview modes instantly
- **Local Storage**: All your content is saved locally in your browser
- **Responsive Design**: Works beautifully on desktop and mobile
- **GitHub Pages Ready**: Configured for easy deployment to GitHub Pages

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Deployment to GitHub Pages

1. Push your code to a GitHub repository
2. Enable GitHub Pages in your repository settings
3. The GitHub Action will automatically build and deploy your site

Or build manually:

```bash
npm run build:gh-pages
```

## Usage

- **Create Folders**: Click the + button next to any folder to create subfolders
- **Add Notes/Blogs**: Use the same + button to create new notes or blog posts
- **Organize Freely**: Drag and drop functionality coming soon - for now, create content in the desired location
- **Edit & Preview**: Toggle between editing and reading modes
- **Auto-Save**: Content is automatically saved to your browser's local storage

## File Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # File tree and navigation
│   └── Editor.tsx      # Note editing and preview
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── pathUtils.ts
└── App.tsx             # Main application component
```

## Customization

The app uses Tailwind CSS for styling. You can customize:

- Colors and themes in `tailwind.config.js`
- Component styles in the respective component files
- Add new features by extending the type definitions and components

## Data Storage

All notes and organizational structure are stored in your browser's localStorage. To backup or transfer your data:

1. Open browser developer tools
2. Go to Application/Storage tab
3. Find localStorage for your domain
4. Export the `digital-garden-notes` key


## Contributing

Feel free to submit issues and enhancement requests!
