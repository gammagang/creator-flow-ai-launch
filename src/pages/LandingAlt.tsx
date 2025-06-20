import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle,
  CreditCard,
  FileText,
  Heart,
  MessageSquare,
  Shield,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingAlt = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Flow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center max-w-5xl">
        <Badge className="mb-8 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
          <Zap className="w-4 h-4 mr-2" />
          AI-Powered Influencer Marketing
        </Badge>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
          Automate Your Entire
          <br />
          <span className="text-blue-600">Influencer Marketing</span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          From creator discovery to campaign execution, our AI platform
          streamlines every step of influencer marketing. Find creators,
          personalize outreach, negotiate deals, and track performance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Watch Demo
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          No credit card required • 14-day free trial • Trusted by 1000+ brands
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform handles the entire influencer marketing workflow with
              powerful automation and AI capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Creator Discovery
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Find the perfect Instagram creators using AI-powered search
                  with advanced filters for niche, engagement, and audience
                  demographics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  AI Outreach & Negotiation
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Automated, personalized outreach emails and AI-powered voice
                  negotiations in multiple languages to scale your campaigns.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Contract Automation
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Auto-generated contracts with e-signature integration.
                  Streamline deal closing and reduce legal overhead.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Management
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Secure payment processing with milestone-based payouts,
                  automated invoicing, and transparent tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Performance Analytics
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Real-time campaign tracking with detailed performance metrics,
                  ROI analysis, and automated reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Campaign Management
                </CardTitle>
                <CardDescription className="text-gray-600">
                  End-to-end campaign lifecycle management with creator
                  onboarding, content approval, and deadline tracking.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Why Choose Flow?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Scale at Speed
                    </h3>
                    <p className="text-gray-600">
                      Automate repetitive tasks and manage hundreds of creators
                      simultaneously with AI assistance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Reduce Costs
                    </h3>
                    <p className="text-gray-600">
                      Cut operational overhead by up to 70% with automated
                      workflows and intelligent matching.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Better Results
                    </h3>
                    <p className="text-gray-600">
                      AI-powered matching and personalization lead to higher
                      engagement and conversion rates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Global Reach
                    </h3>
                    <p className="text-gray-600">
                      Multilingual AI agents enable seamless communication with
                      creators worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Campaign Performance
                  </h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    +127% ROI
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">
                      Creators Reached
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                      2,847
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-medium">
                      Response Rate
                    </span>
                    <span className="font-bold text-lg text-gray-900">89%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-medium">
                      Avg. Engagement
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                      4.7%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700 font-medium">
                      Time Saved
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                      156 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Trusted by Leading Brands
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying about Flow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "Flow transformed our influencer marketing. We've scaled our
                  campaigns 10x while reducing costs significantly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">
                      Marketing Director, TechCorp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "The AI outreach feature is incredible. Our response rates
                  increased by 300% compared to manual outreach."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">MR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Michael Rodriguez
                    </p>
                    <p className="text-sm text-gray-600">Founder, StyleBrand</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "Finally, a platform that handles everything from discovery to
                  payment. Game-changer for our agency."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">AC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Amanda Chen</p>
                    <p className="text-sm text-gray-600">CEO, CreativeAgency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <br />
            Influencer Marketing?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of brands already using AI to scale their influencer
            campaigns efficiently and effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-3"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-blue-100 text-sm">
            14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Flow</span>
              </div>
              <p className="text-gray-400">
                Automate your entire influencer marketing workflow with
                AI-powered platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Flow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingAlt;
