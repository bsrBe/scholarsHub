import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    // 1. Removed min-h-screen (the parent div.flex-1 handles the minimum height)
    // 2. Changed items-center to items-start to align content to the top
    // 3. Changed py-* to pt-* and increased the value slightly (pt-16/sm:pt-20) 
    //    to provide clear spacing below the Navbar while pulling the card up.
    <div className="bg-gray-50 flex flex-1 items-start justify-center px-4 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-12">
      <div className="w-full max-w-lg mx-auto">
        <Outlet />
      </div>
    </div>
  );
}