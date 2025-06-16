
import Header from "@/components/Header";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Witaj ponownie, Jan! 👋
          </h2>
          <p className="text-gray-600">
            Porozmawiaj z AI asystentem o swoich wyzwaniach komunikacyjnych i otrzymaj spersonalizowane porady.
          </p>
        </div>

        <ChatBot />
      </main>
    </div>
  );
};

export default Index;
