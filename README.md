# 🎨 Artwork DataTable - GrowMeOrganic Assignment

> A powerful, feature-rich React application showcasing advanced data table capabilities with persistent selection across pages.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PrimeReact](https://img.shields.io/badge/PrimeReact-007ACC?style=for-the-badge&logo=react&logoColor=white)](https://primereact.org/)

---

## 🌟 Live Demo

🔗 **[View Live Application](https://datatable-assignment-growmeorganic.netlify.app/)**

## 📹 Video Demonstration

> Watch the complete feature walkthrough and implementation details


---

## 📋 Table of Contents

- [Features](#-features)
- [Assignment Requirements](#-assignment-requirements)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Implementation Details](#-key-implementation-details)
- [Performance Optimizations](#-performance-optimizations)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🎯 Core Functionality

- **📊 Advanced Data Table** - Built with PrimeReact DataTable component for robust data display
- **🔄 Server-Side Pagination** - Efficient data fetching with API calls for each page
- **✅ Persistent Row Selection** - Selections maintained across page changes
- **🎛️ Custom Bulk Selection Panel** - Select/deselect multiple rows with custom quantity
- **🔍 Real-time Selection Counter** - Track total selected items across all pages
- **⚡ Loading States** - Visual feedback during data fetching
- **❌ Error Handling** - Graceful error messages for failed API calls
- **📱 Responsive Design** - Works seamlessly across different screen sizes

### 🎨 User Experience

- **Checkbox Selection** - Individual row selection with checkboxes
- **Select All Toggle** - Quick selection/deselection of current page items
- **Custom Bulk Selector** - Input custom quantity for bulk operations
- **URL Persistence** - Page state maintained in URL for bookmarking
- **Sortable Columns** - Sort by Title, Artist, or Origin
- **Null-Safe Rendering** - Displays "N/A" for missing data

---

## ✅ Assignment Requirements

All assignment criteria have been **successfully implemented** and verified:

### 📝 Development Requirements

- [x] **React App Created with Vite** - Modern, fast build tool
- [x] **TypeScript Implementation** - 100% TypeScript, zero JavaScript
- [x] **PrimeReact DataTable** - Professional table component integrated
- [x] **Initial Data Fetch** - First page loads automatically on mount
- [x] **Pagination Implemented** - Full pagination controls with page navigation
- [x] **Server-Side Pagination** - API called for each page change
- [x] **Row Selection Checkboxes** - Individual and bulk selection enabled
- [x] **Custom Selection Panel** - Advanced bulk selection interface
- [x] **Persistent Selection** - Selections maintained across all pages

### 🔒 Critical Checks Verified

- [x] **No Full Data Storage** - Only current page data stored in state
- [x] **API Called on Every Page Change** - Fresh data fetched for each navigation
- [x] **Selection Persistence** - Row selections/deselections persist across page changes
- [x] **Cross-Page Selection Integrity** - Selections maintained when revisiting pages

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.x |
| **TypeScript** | Type Safety | 5.x |
| **Vite** | Build Tool | 5.x |
| **PrimeReact** | UI Component Library | Latest |
| **Axios** | HTTP Client | Latest |
| **Art Institute of Chicago API** | Data Source | Public API |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SrijitaBaksi/growMeOrganic.git
   cd growMeOrganic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
growMeOrganic/
├── src/
│   ├── components/
│   │   └── Datatable.tsx      # Main DataTable component
│   ├── App.tsx                 # Root component
│   ├── App.css                 # Application styles
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md
```

---

## 🔑 Key Implementation Details

### 1️⃣ Efficient State Management

```typescript
// Only current page data is stored - prevents memory issues
const [artworksOnPage, setArtworksOnPage] = useState<Artwork[]>([]);

// Selection stored as Record<id, Artwork> for O(1) lookup
const [selectionState, setSelectionState] = useState<Record<number, Artwork>>({});
```

### 2️⃣ Server-Side Pagination

```typescript
// API called on every page change
useEffect(() => {
  fetchArtworksForPage(currentPage + 1);
}, [currentPage]);
```

### 3️⃣ Persistent Selection Logic

- Selections stored in a **Record/Dictionary** structure indexed by artwork ID
- When page changes, only current page data is updated
- Selection state remains intact, providing persistence
- Active selections filtered from current page for display

### 4️⃣ Custom Bulk Selection

- Users can input any quantity (e.g., 20 rows)
- System fetches multiple pages if needed
- Toggles selection/deselection intelligently
- Prevents memory overflow by not storing all fetched data

### 5️⃣ URL State Management

```typescript
// Page state persisted in URL
const url = new URL(window.location.href);
url.searchParams.set("page", (e.page + 1).toString());
window.history.pushState({}, "", url);
```

---

## ⚡ Performance Optimizations

1. **Lazy Loading** - Only fetches data for the current page
2. **Efficient Re-renders** - Minimal state updates using useEffect dependencies
3. **Optimized Selection Lookup** - O(1) selection checks using Record structure
4. **API Call Optimization** - Debounced and controlled API requests
5. **Memory Management** - No accumulation of data from previous pages

---

## 🎯 API Reference

**Data Source:** [Art Institute of Chicago API](https://api.artic.edu/docs/)

**Endpoint Used:**
```
GET https://api.artic.edu/api/v1/artworks?page={pageNumber}
```

**Response Structure:**
```typescript
{
  data: Artwork[],
  pagination: {
    limit: number,
    total: number
  }
}
```

---

## 🧪 Testing Checklist

Before submission, verify these critical features:

- [ ] Application loads without errors
- [ ] First page data displays correctly
- [ ] Pagination controls work properly
- [ ] API called on every page navigation
- [ ] Single row selection works
- [ ] Select all checkbox toggles current page
- [ ] Bulk selection panel functions correctly
- [ ] Selection persists when changing pages
- [ ] Deselection persists when changing pages
- [ ] Selection counter updates accurately
- [ ] No memory leaks (check DevTools)
- [ ] Responsive on mobile devices
- [ ] Error states display properly

---

## 🚢 Deployment

This application is deployed on **[Platform Name]** and can be accessed at:

🔗 **[Add your deployment URL here]**

### Build Command:
```bash
npm run build
```

### Output Directory:
```
dist/
```

---

## 👨‍💻 Developer

**Srijita Baksi**

- GitHub: [@SrijitaBaksi](https://github.com/SrijitaBaksi)
- Repository: [growMeOrganic](https://github.com/SrijitaBaksi/growMeOrganic)

---

## 📄 License

This project was created as part of the GrowMeOrganic technical assessment.

---

## 🙏 Acknowledgments

- **GrowMeOrganic** for the assignment opportunity
- **Art Institute of Chicago** for providing the public API
- **PrimeReact** for the excellent component library
- **Vite** for the blazing-fast development experience

---

<div align="center">

### ⭐ If you found this implementation helpful, please consider giving it a star!

**Made with ❤️ and TypeScript**

</div>
