
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Heart, MessageCircle, Eye } from "lucide-react";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track campaign performance and ROI</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Heart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156K</div>
            <p className="text-xs text-green-600">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-green-600">+0.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2x</div>
            <p className="text-xs text-green-600">+0.4x from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* TODO: Replace with real campaign analytics */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Summer Launch 2024</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>12 creators</span>
                  <span>•</span>
                  <span>24 posts</span>
                  <span>•</span>
                  <span>1.2M reach</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <div className="text-sm text-gray-500 mt-1">4.5% engagement</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Wellness Campaign</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>8 creators</span>
                  <span>•</span>
                  <span>16 posts</span>
                  <span>•</span>
                  <span>800K reach</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                <div className="text-sm text-gray-500 mt-1">5.2% engagement</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Replace with real post data */}
              <div className="flex items-center gap-3">
                <img src="/placeholder.svg" alt="Post" className="w-12 h-12 rounded bg-gray-200" />
                <div className="flex-1">
                  <p className="font-medium">@fashionista_jane</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>12.5K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>234</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>45K</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img src="/placeholder.svg" alt="Post" className="w-12 h-12 rounded bg-gray-200" />
                <div className="flex-1">
                  <p className="font-medium">@fitness_guru_mike</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>8.2K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>156</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>32K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Creator Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/placeholder.svg" alt="Creator" className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className="font-medium">@fashionista_jane</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">6.2%</div>
                  <div className="text-xs text-gray-500">engagement</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/placeholder.svg" alt="Creator" className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className="font-medium">@fitness_guru_mike</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">5.8%</div>
                  <div className="text-xs text-gray-500">engagement</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/placeholder.svg" alt="Creator" className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className="font-medium">@food_blogger_sarah</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">4.9%</div>
                  <div className="text-xs text-gray-500">engagement</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
