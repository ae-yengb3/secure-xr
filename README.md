# SecureScanX README

## Introduction

SecureScanX is a web application designed for cybersecurity monitoring and protection. It provides features for scanning web applications for vulnerabilities, viewing detailed scan results, and interacting with an AI-powered security assistant.

## Features

* **User Authentication:** Secure user registration and login functionality.
* **Dashboard:** An overview of scan statistics, including total scans, completed scans, active scans, and total vulnerabilities detected. It also displays a summary of vulnerabilities by severity and a list of recent alerts.
* **Scans:** Users can initiate new security scans by providing a target URL and selecting a scan type (Vulnerability, Leak, or Hybrid). The application provides real-time progress updates during scans.
* **Results:** A comprehensive view of all scan reports. Users can filter and sort the results based on various criteria such as target, status, vulnerabilities, risk level, scan type, and date. Detailed reports for each scan provide in-depth information about the vulnerabilities found.
* **AI Assistant:** An interactive chat interface where users can ask questions about their security reports and receive AI-powered insights and recommendations.
* **Vulnerability Management:** Users can mark vulnerabilities as "resolved" or a "false positive" to track their remediation efforts.
* **CSV Export:** Scan reports can be exported to a CSV file for offline analysis and reporting.

## Technologies Used

* **Frontend:**
    * Next.js
    * React
    * Redux Toolkit for state management
    * TypeScript
    * Tailwind CSS for styling
    * shadcn/ui for UI components
    
* **Backend:** [Backend Repo](https://github.com/ae-yengb3/secure-scan)

   
## Pages

### Landing Page

The landing page provides an overview of SecureScanX, its features, and a call to action for users to sign up or log in. It is located at `app/page.tsx`.

### Signup Page

The signup page allows new users to create an account by providing their full name, email address, password, and region. It is located at `app/signup/page.tsx`.

### Login Page

The login page enables existing users to log in to their accounts using their email and password. It is located at `app/login/page.tsx`.

### Dashboard Page

The dashboard provides a high-level overview of the user's security posture, displaying key metrics and recent activities. It is located at `app/dashboard/page.tsx`.

### Scans Page

The scans page allows users to configure and initiate new security scans. It provides options for selecting the scan type, target type, and target URL. The page also displays the progress of ongoing scans. It is located at `app/scans/page.tsx`.

### Results Page

The results page displays a list of all completed scans, with options for filtering and sorting. Users can click on a scan to view a detailed report. It is located at `app/results/page.tsx`.

### Scan Result Detail Page

This page provides a detailed breakdown of a specific scan report, including a list of all vulnerabilities found, their severity, and recommendations for remediation. It is located at `app/results/[id]/page.tsx`/page.tsx].

### AI Assistant Page

The AI assistant page features a chat interface where users can interact with an AI to get insights into their scan results and security vulnerabilities. It is located at `app/assistant/page.tsx`.

## Components

The application uses a variety of reusable UI components, including:

* Accordion
* Alert
* Alert Dialog
* Aspect Ratio
* Avatar
* Badge
* Breadcrumb
* Button
* Calendar
* Card
* Carousel
* Chart
* Checkbox
* Collapsible
* Command
* Context Menu
* Dialog
* Drawer
* Dropdown Menu
* Form
* Hover Card
* Input
* Input OTP
* Label
* Menubar
* Navigation Menu
* Pagination
* Popover
* Progress
* Radio Group
* Resizable
* Scroll Area
* Select
* Separator
* Sheet
* Sidebar
* Skeleton
* Slider
* Sonner
* Switch
* Table
* Tabs
* Textarea
* Toast
* Toaster
* Toggle
* Toggle Group
* Tooltip

These components are located in the `components/ui` directory.
