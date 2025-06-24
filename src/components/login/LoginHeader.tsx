
const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center pt-8 pb-6 px-6">
      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
        <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">
        Spato Finance
      </h1>
      <p className="text-gray-600 text-center">
        Corporate Asset Tokenization Platform
      </p>
    </div>
  );
};

export default LoginHeader;
