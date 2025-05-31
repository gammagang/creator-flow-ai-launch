
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Users, MessageSquare, FileText, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "AI Creator Discovery",
      description: "Find the perfect influencers with our intelligent matching algorithm"
    },
    {
      icon: MessageSquare,
      title: "Automated Outreach",
      description: "Personalized AI-generated emails that convert"
    },
    {
      icon: FileText,
      title: "Smart Contracts",
      description: "Auto-generated contracts with e-signature integration"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track campaign success with detailed insights"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">InfluencerFlow</h1>
        </div>
        <Link to="/auth">
          <Button>Get Started</Button>
        </Link>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Influencer
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Marketing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Automate your entire influencer marketing workflow - from discovery to payment. 
            Find creators, send personalized outreach, negotiate deals, and track performance with AI.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to transform your influencer marketing?
          </h2>
          <p className="text-gray-600 mb-8">
            Join hundreds of brands already using InfluencerFlow to scale their campaigns.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started Today
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
