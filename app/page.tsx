import LoanSimulator from "@/components/loan-simulator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm mx-auto">
        <LoanSimulator />
      </div>
    </main>
  );
}
