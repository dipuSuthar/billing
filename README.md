Simple Billing App

A modern, responsive billing/invoice application built with React, Vite, and Material UI. It allows users to enter customer details, add billing items, calculate totals, apply discounts and GST, and export the bill as a PDF.

Images
<img width="1897" height="915" alt="image" src="https://github.com/user-attachments/assets/ce3e0817-edf4-4220-8cfe-87cabcfe2d8b" />


✨ Features
👤 Customer Details
Customer name
Phone number
Billing date
Address
🧾 Billing Items
Select items from a list
Add custom/new items
Select measurement units
Enter quantity
Enter item rate
Automatically calculate item totals
Edit existing items
Delete items
💰 Bill Summary
Subtotal calculation
Discount
GST/Tax
Grand total
📄 PDF Export
Generate and export the bill as a PDF
Uses jsPDF and jspdf-autotable
📱 Responsive UI
Clean dashboard-style layout
Responsive design for different screen sizes
Material UI components and icons
⚡ Fast Development
Powered by Vite
React 19
ESLint configured for code quality
🖥️ Application Preview

The application provides a simple billing interface with:

A sidebar for navigation
Customer information section
Add Item section
Item list with edit/delete actions
Billing summary
PDF export functionality
🛠️ Tech Stack
Frontend
React 19.2.0
React DOM 19.2.0
Vite 7.2.4
UI
Material UI (MUI) 7.3.5
MUI Icons 7.3.5
Emotion React 11.14.0
Emotion Styled 11.14.1
PDF Generation
jsPDF 3.0.4
jsPDF AutoTable 5.0.2
Development & Code Quality
ESLint 9.39.1
ESLint React Hooks Plugin
ESLint React Refresh Plugin
@vitejs/plugin-react
TypeScript React type definitions
📦 Installation

Clone the repository:

git clone <repository-url>

Navigate to the project directory:

cd simple-billing-app

Install dependencies:

npm install
🚀 Running the Application

Start the development server:

npm run dev

The application will be available at the local URL displayed by Vite, usually:

http://localhost:5173
🏗️ Production Build

Create an optimized production build:

npm run build

Preview the production build locally:

npm run preview
🔍 Linting

Run ESLint to check the project for code-quality issues:

npm run lint
📋 How to Use
1. Enter Customer Details

Fill in the customer information:

Customer Name
Phone
Date
Address
2. Add Billing Items

Select an item from the item list and provide:

Measurement/unit
Quantity
Rate

Click Add Item to add the item to the bill.

You can also use Add New Item when a required item isn't available in the existing list.

3. Manage Items

Items added to the bill appear in the Item List.

Each item provides actions to:

✏️ Edit the item
🗑️ Delete the item

The item total is calculated based on quantity and rate.

4. Review the Summary

The summary section displays:

Subtotal
Discount
Tax (GST)
----------------
Grand Total
5. Export the Bill

Click Export PDF to generate a printable/downloadable PDF invoice.

📁 Suggested Project Structure
simple-billing-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

The exact structure may vary depending on how the project components are organized.

📦 Dependencies
Production Dependencies
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.3.5",
  "@mui/material": "^7.3.5",
  "jspdf": "^3.0.4",
  "jspdf-autotable": "^5.0.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
Development Dependencies
{
  "@eslint/js": "^9.39.1",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.1.1",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "vite": "^7.2.4"
}
🧮 Billing Calculation

For each item, the basic calculation is:

Item Total = Quantity × Rate

The bill subtotal is:

Subtotal = Sum of all Item Totals

The final amount is calculated after applying the configured discount and GST/tax:

Grand Total = Subtotal - Discount + Tax
🎨 UI Design

The application uses Material UI to provide a clean and consistent interface.

The design includes:

Teal-based navigation/header
Card-based content sections
Responsive form fields
Material icons for actions
Clear billing summary
Simple and user-friendly workflow
🔮 Future Improvements

Possible enhancements include:

 Save bills to local storage
 Customer history
 Product/item management
 Automatic invoice numbering
 Multiple GST rates
 Company/business details
 Custom invoice templates
 Print invoice directly
 Search and filter invoices
 Export invoice as Excel/CSV
 Backend/database integration
 User authentication
 Dark mode
📄 License

This project is available for personal and educational use. Add an appropriate license such as MIT if you intend to distribute it as an open-source project.

Built with React + Vite + Material UI ⚡
