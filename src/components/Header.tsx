
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 md:px-12 md:py-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <span className="text-white text-xl font-bold">Spato Finance</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/docs">
          <Button 
            variant="ghost" 
            className="text-white hover:text-purple-200 hover:bg-white/10 transition-all duration-300"
          >
            Read Documentation
          </Button>
        </Link>
        <Link to="/login">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Access Platform
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
