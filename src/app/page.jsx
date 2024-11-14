"use client";
import AntLayout from './AntLayout';

export default function HomePage() {
  return (
    <AntLayout>
      <div
        style={{
          padding: 24,
          minHeight: 'calc(100vh - 134px)',
        }}
      >
        <h1>Welcome to My Next.js App!</h1>
        <p>This is a home page using Ant Design layout with responsive sider.</p>
      </div>
    </AntLayout>
  );
}
