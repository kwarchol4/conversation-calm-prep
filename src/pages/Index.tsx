
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Witaj ponownie, Jan! 👋
          </h2>
          <p className="text-gray-600 text-sm">
            Porozmawiaj z AI asystentem o swoich wyzwaniach komunikacyjnych i otrzymaj spersonalizowane porady.
          </p>
        </div>

        <ChatBot />
      </main>
    </div>
  );
};

export default Index;
