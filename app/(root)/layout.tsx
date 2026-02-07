import LeftSidebar from '@/components/leftsidebar/LeftSidebar';
import Navigation from '@/components/navigation/Navigation';
import RightSidebar from '@/components/rightsidebar/RightSidebar';
import React from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 realtive">
      <Navigation />

      <div className="flex">
        <LeftSidebar />

        <section className="flex min-h-screen flex-1 flex-col px-6 pt-36 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </div>
    </main>
  );
};

export default RootLayout;
