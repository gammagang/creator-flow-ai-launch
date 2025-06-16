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
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingNeat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {" "}
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/30 border-b border-white/40 shadow-[0px_2px_0px_0px_#000]">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          {" "}
          <div className="flex items-center space-x-3">
            {" "}
            <div className="w-10 h-10 bg-gradient-to-br from-orange-300 to-pink-300 rounded-2xl flex items-center justify-center relative">
              <Bot className="w-6 h-6 text-white" />
              <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
            </div>{" "}
            <span className="text-2xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Flow
              </span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {" "}
            <Link to="/auth">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-orange-600 hover:bg-white/50 rounded-xl px-6 shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
              >
                Login
              </Button>
            </Link>{" "}
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-6 py-3 shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>{" "}
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center max-w-5xl relative">
        {/* Decorative sparkles */}
        <Sparkles className="w-6 h-6 text-yellow-400 absolute top-20 left-1/4 animate-pulse" />
        <Sparkles className="w-4 h-4 text-pink-400 absolute top-32 right-1/3 animate-pulse delay-150" />
        <Sparkles className="w-5 h-5 text-orange-400 absolute top-16 right-1/4 animate-pulse delay-300" />{" "}
        <Badge className="mb-8 bg-white/80 backdrop-blur-sm text-orange-700 hover:bg-white/90 border-0 text-sm font-medium rounded-full px-4 py-2">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          AI-Powered Influencer Marketing
        </Badge>{" "}
        <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gray-800 leading-tight">
          <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Automate Your Entire
          </span>
          <br />
          <span className="relative bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Influencer Marketing
            <Heart className="w-8 h-8 text-pink-400 absolute -top-2 -right-8 animate-bounce" />
          </span>
        </h1>
        <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          From creator discovery to campaign execution, our AI platform
          streamlines every step of influencer marketing. Find creators,
          personalize outreach, negotiate deals, and track performance - all in
          one delightful place.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          {" "}
          <Link to="/auth">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white text-lg px-10 py-4 rounded-2xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2 transition-all duration-300 font-semibold"
            >
              Start Free Trial
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>{" "}
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-10 py-4 rounded-2xl border-2 border-orange-200 text-orange-700 hover:bg-white/80 backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2 transition-all duration-300 font-semibold bg-white/60"
          >
            Watch Demo
            <Sparkles className="w-5 h-5 ml-2 text-yellow-500" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          No credit card required • 14-day free trial • Made with{" "}
          <Heart className="w-4 h-4 inline text-pink-400" /> for creators
        </p>
      </section>{" "}
      {/* Features Section */}
      <section className="container mx-auto px-8 lg:px-12 pt-6 pb-12 max-w-7xl">
        {" "}
        <div className="text-center mb-24">
          <h2 className="text-5xl font-bold mb-8 text-gray-800 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Everything You Need to Scale Influencer Marketing
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            Our AI platform handles the entire influencer marketing workflow,
            from discovery to performance tracking - with a touch of magic ✨
          </p>
        </div>{" "}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {" "}
          <Card className="group hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-300 border-2 border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[6px_6px_0px_0px_#000] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-4">
                Smart Creator Discovery
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed font-medium">
                Find the perfect Instagram creators using AI-powered search with
                advanced filters for niche, engagement, and audience
                demographics. Like having a crystal ball! 🔮
              </CardDescription>
            </CardHeader>
          </Card>{" "}
          <Card className="group hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-300 border-2 border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[6px_6px_0px_0px_#000] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-4">
                AI Outreach & Negotiation
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed font-medium">
                Automated, personalized outreach emails and AI-powered voice
                negotiations in multiple languages to scale your campaigns. Your
                personal assistant! 🤖
              </CardDescription>
            </CardHeader>
          </Card>{" "}
          <Card className="group hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-300 border-2 border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[6px_6px_0px_0px_#000] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-4">
                Contract Automation
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed font-medium">
                Auto-generated contracts with e-signature integration.
                Streamline deal closing and reduce legal overhead. No more
                paperwork nightmares! 📄
              </CardDescription>
            </CardHeader>
          </Card>{" "}
          <Card className="group hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-300 border-2 border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[6px_6px_0px_0px_#000] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-4">
                Payment Management
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed font-medium">
                Secure payment processing with milestone-based payouts,
                automated invoicing, and transparent tracking for both brands
                and creators. Money made simple! 💰
              </CardDescription>
            </CardHeader>
          </Card>{" "}
          <Card className="group hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-300 border-2 border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[6px_6px_0px_0px_#000] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-4">
                Performance Analytics
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed font-medium">
                Real-time campaign tracking with detailed performance metrics,
                ROI analysis, and automated reporting. Data that actually makes
                sense! 📊
              </CardDescription>
            </CardHeader>
          </Card>{" "}
          <Card className="group hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-300 border-2 border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-[6px_6px_0px_0px_#000] hover:-translate-x-2 hover:-translate-y-2">
            <CardHeader className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[6px_6px_0px_0px_#000] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 mb-4">
                Campaign Management
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed font-medium">
                End-to-end campaign lifecycle management with creator
                onboarding, content approval, and deadline tracking.
                Orchestration at its finest! 🎭
              </CardDescription>
            </CardHeader>
          </Card>
        </div>{" "}
      </section>{" "}
      {/* Benefits Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/40 to-pink-100/40"></div>
        <Sparkles className="w-8 h-8 text-yellow-400 absolute top-12 left-12 animate-pulse" />
        <Sparkles className="w-6 h-6 text-pink-400 absolute bottom-12 right-12 animate-pulse delay-200" />{" "}
        <div className="container mx-auto px-8 lg:px-12 relative max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-24 xl:gap-32 items-center">
            {" "}
            <div>
              <h2 className="text-5xl font-bold mb-12 text-gray-800 leading-tight">
                <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Why Choose Flow?
                </span>
              </h2>
              <div className="space-y-10">
                {" "}
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3">
                      Scale at Speed ⚡
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      Automate repetitive tasks and manage hundreds of creators
                      simultaneously with AI assistance. Like having
                      superpowers!
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3">
                      Reduce Costs 💰
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      Cut operational overhead by up to 70% with automated
                      workflows and intelligent matching. Your budget will thank
                      you!
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3">
                      Better Results 📈
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      AI-powered matching and personalization lead to higher
                      engagement and conversion rates. Results that wow!
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3">
                      Global Reach 🌍
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      Multilingual AI agents enable seamless communication with
                      creators worldwide. The world is your oyster!
                    </p>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-white/50 shadow-[6px_6px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Campaign Performance ✨
                  </h3>{" "}
                  <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0 px-4 py-2 rounded-full">
                    +127% ROI
                  </Badge>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl">
                    <span className="text-gray-700 font-medium">
                      Creators Reached
                    </span>
                    <span className="font-bold text-xl text-gray-800">
                      2,847
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                    <span className="text-gray-700 font-medium">
                      Response Rate
                    </span>
                    <span className="font-bold text-xl text-gray-800">89%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl">
                    <span className="text-gray-700 font-medium">
                      Avg. Engagement
                    </span>
                    <span className="font-bold text-xl text-gray-800">
                      4.7%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
                    <span className="text-gray-700 font-medium">
                      Time Saved
                    </span>
                    <span className="font-bold text-xl text-gray-800">
                      156 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Testimonials */}{" "}
      <section className="py-20 bg-white/50 backdrop-blur-sm shadow-[0px_-2px_0px_0px_#000] relative">
        <div className="container mx-auto px-8 lg:px-12 max-w-7xl">
          <div className="text-center mb-24">
            {" "}
            <h2 className="text-5xl font-bold mb-8 text-gray-800 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Trusted by Leading Brands
              </span>
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              See what our customers are saying about Flow ❤️
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
            {" "}
            <Card className="border-0 rounded-3xl bg-white/80 backdrop-blur-sm hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed font-medium text-lg">
                  "Flow transformed our influencer marketing. We've scaled our
                  campaigns 10x while reducing costs significantly. It's like
                  magic! ✨"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-sm">SJ</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Sarah Johnson</p>
                    <p className="text-sm text-gray-600 font-medium">
                      Marketing Director, TechCorp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>{" "}
            <Card className="border-0 rounded-3xl bg-white/80 backdrop-blur-sm hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed font-medium text-lg">
                  "The AI outreach feature is incredible. Our response rates
                  increased by 300% compared to manual outreach. Mind-blowing
                  results! 🚀"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-sm">MR</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Michael Rodriguez</p>
                    <p className="text-sm text-gray-600 font-medium">
                      Founder, StyleBrand
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>{" "}
            <Card className="border-0 rounded-3xl bg-white/80 backdrop-blur-sm hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 leading-relaxed font-medium text-lg">
                  "Finally, a platform that handles everything from discovery to
                  payment. Game-changer for our agency. Pure genius! 💎"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-sm">AC</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Amanda Chen</p>
                    <p className="text-sm text-gray-600 font-medium">
                      CEO, CreativeAgency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>{" "}
      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/80 to-pink-300/80"></div>

        {/* Decorative elements */}
        <Sparkles className="w-10 h-10 text-white/60 absolute top-12 left-20 animate-pulse" />
        <Sparkles className="w-6 h-6 text-white/40 absolute top-20 right-32 animate-pulse delay-150" />
        <Sparkles className="w-8 h-8 text-white/50 absolute bottom-16 left-32 animate-pulse delay-300" />
        <Heart className="w-8 h-8 text-white/60 absolute bottom-20 right-20 animate-bounce" />

        <div className="container mx-auto px-8 lg:px-12 text-center relative max-w-6xl">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Transform Your
            <br />
            Influencer Marketing? ✨
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Join thousands of brands already using AI to scale their influencer
            campaigns efficiently and effectively. The future is here! 🚀
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            {" "}
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-50 text-xl px-12 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 font-bold shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000]"
              >
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-xl px-12 py-4 rounded-2xl backdrop-blur-sm bg-white/10 transition-all duration-300 hover:-translate-y-0.5 font-bold shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000]"
            >
              Schedule Demo
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <p className="text-white/80 font-medium text-lg">
            14-day free trial • No setup fees • Cancel anytime • Made with{" "}
            <Heart className="w-5 h-5 inline text-pink-200" /> for creators
          </p>
        </div>
      </section>{" "}
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              {" "}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center relative">
                  <Bot className="w-6 h-6 text-white" />
                  <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
                </div>
                <span className="text-2xl font-bold">Flow</span>
              </div>
              <p className="text-gray-300 leading-relaxed font-medium">
                Automate your entire influencer marketing workflow with
                AI-powered platform. Made with{" "}
                <Heart className="w-4 h-4 inline text-pink-400" /> for creators.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Product</h3>
              <ul className="space-y-4 text-gray-300 font-medium">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Company</h3>
              <ul className="space-y-4 text-gray-300 font-medium">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-6 text-white text-lg">Support</h3>
              <ul className="space-y-4 text-gray-300 font-medium">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-medium">
              &copy; 2024 Flow. All rights reserved. Built with{" "}
              <Heart className="w-4 h-4 inline text-pink-400" /> and lots of ☕
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingNeat;
