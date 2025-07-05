# **App Name**: CadetLink

## Core Features:

- Secure Authentication: Secure login/logout functionality for admins, managers, and cadets with role-based access control.
- Profile Management: Cadets can view and edit their profile information.
- Camp Automation: Cadets view upcoming camps, register through a link (generative AI tool verifies integrity of links before distribution), and store relevant details in local storage (regimental number, student ID, etc.).
- Attendance Records: Cadets can view attendance records; only admin can mark attendance manually in the Firestore database.
- Role-Based Dashboards: Tailored dashboards for admins (manage cadets/camps), management (monitor activity), and cadets (personal records).
- Batch Data: Admin to upload/download cadet data in standard formats (CSV, Excel).
- Streamline data entry: Auto-complete assistance for camp registration to pre-populate known cadet data.

## Style Guidelines:

- Primary color: A strong but muted military green (#5D8A72) evokes the traditions of the NCC.
- Background color: A light-tone neutral grey (#F0F2F0) creates a clean, professional backdrop.
- Accent color: Use a desaturated but clear navy blue (#4A777F) to highlight interactive elements and key information.
- Font pairing: 'PT Sans' (sans-serif) for body text and 'PT Sans' for headlines; strikes a balance between approachability and modernism.
- Icons: Utilize clean, modern line icons to represent actions, data points, and navigation elements.
- Responsive layout with a clear hierarchy. Prioritize key data and actions for each user role (cadet, manager, admin).
- Subtle transitions and feedback animations (e.g., button presses, form validation) to enhance user experience.