import BridgeWidget from './components/BridgeWidget';
import BackgroundDoodles from './components/BackgroundDoodles';
import logo from './assets/Banny_Bridge_logo.svg';

function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundDoodles />

      {/* Logo - Column flow on mobile, Fixed on desktop */}
      <div className="w-full flex justify-center pt-8 pb-4 md:fixed md:top-6 md:left-6 md:justify-start md:p-0 md:w-auto z-20 shrink-0">
        <img
          src={logo}
          alt="Banny Bridge"
          className="h-12 md:h-16 w-auto drop-shadow-[0_0_15px_rgba(45,91,255,0.5)] hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 w-full mb-8 md:mb-0">
        <BridgeWidget />
      </div>
    </div>
  );
}

export default App;
