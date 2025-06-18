import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  TrendingUp,
  Users,
  Mail,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  // TODO: Replace with real data from backend
  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      change: "+2 this week",
      icon: TrendingUp,
      color: "from-green-400 to-green-500",
    },
    {
      title: "Creators Contacted",
      value: "156",
      change: "+23 this month",
      icon: Users,
      color: "from-blue-400 to-blue-500",
    },
    {
      title: "Response Rate",
      value: "68%",
      change: "+5% vs last month",
      icon: Mail,
      color: "from-purple-400 to-purple-500",
    },
    {
      title: "Total Spent",
      value: "$24,500",
      change: "+$3,200 this month",
      icon: IndianRupee,
      color: "from-orange-400 to-orange-500",
    },
  ];

  const { user } = useAuth();
  const name =
    (user?.identities?.[0]?.identity_data?.contact_name as string) || "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              Welcome back,{" "}
              <span className="font-semibold text-orange-600">{name}</span>!
              Here's what's happening with your campaigns.
            </p>
          </div>
          <Link to="/dashboard/campaigns/create">
            <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-base font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8 pt-0">
              <Link to="/dashboard/creators" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl h-12 text-base font-semibold border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Discover New Creators
                </Button>
              </Link>
              <Link to="/dashboard/outreach" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl h-12 text-base font-semibold border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send AI Outreach
                </Button>
              </Link>
              <Link to="/dashboard/contracts" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl h-12 text-base font-semibold border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Generate Contract
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-5">
                {/* TODO: Replace with real activity data */}
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-base text-gray-700 font-medium">
                    Contract signed with @fashionista_jane
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  <span className="text-base text-gray-700 font-medium">
                    New response from @fitness_guru_mike
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                  <span className="text-base text-gray-700 font-medium">
                    Campaign "Summer Launch" went live
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
