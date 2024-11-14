import { Link, useRouteError } from "react-router-dom"; 
import { Button } from "@/components/ui/button"; 

const Error = () => {
  const error = useRouteError(); 

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-3xl font-semibold mb-2">Something went wrong.</h2>

        {error && (
          <p className="text-gray-600 mb-4">
            <strong>{error.status}</strong>: {error.statusText || error.message}
          </p>
        )}

        <p className="text-lg mb-6">
          We can&apos;t seem to find the page you&apos;re looking for.
        </p>

        <div className="flex justify-center space-x-4">
          <Button>
            <Link to="/" className="text-white">
              Go Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
