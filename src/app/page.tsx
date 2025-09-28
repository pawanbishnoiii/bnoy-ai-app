export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🤖 BNOY AI Chat Platform
            </h1>
            <p className="text-gray-600 mb-6">
              Welcome to your AI-powered chat application!
            </p>
            <div className="space-y-4">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Start New Chat
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                View Chat History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
