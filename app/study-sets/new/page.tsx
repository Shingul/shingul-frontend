"use client";

import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import CreateStudySetForm from "@/components/CreateStudySetForm";

export default function CreateStudySetPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab="Study Sets" />
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-0">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "New Study Set" },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-6 sm:mb-8">
            Create New Study Set
          </h1>

          <CreateStudySetForm showCancel={true} />
        </div>
      </main>
    </div>
  );
}
