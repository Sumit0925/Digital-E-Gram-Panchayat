import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileText, Users, Clock, Shield, ArrowRight } from "lucide-react";

const Homepage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Digital Services",
      description: "Apply for various government services online with ease",
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Quick Processing",
      description: "Faster processing times with digital workflows",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Transparent System",
      description: "Track your application status in real-time",
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Secure Platform",
      description: "Your data is protected with advanced security measures",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Digital E-Gram Panchayat
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Streamlining government services for a better tomorrow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/services"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200"
                  >
                    View Services
                  </Link>
                </>
              ) : (
                <Link
                  to="/services"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 flex items-center"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the convenience of digital governance with our
              comprehensive e-services platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of citizens who have already embraced digital
            governance
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Create Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
