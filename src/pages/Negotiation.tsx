import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Phone,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";

const Negotiation = () => {
  // TODO: Replace with real negotiation data
  const negotiations = [
    {
      id: 1,
      creator: "@fashionista_jane",
      status: "in_progress",
      initialOffer: "$1,500",
      counterOffer: "$2,000",
      currentOffer: "$1,750",
      lastActivity: "2 hours ago",
      deliverables: ["2 Posts", "4 Stories"],
      method: "voice",
    },
    {
      id: 2,
      creator: "@fitness_guru_mike",
      status: "agreed",
      finalAmount: "$1,200",
      deliverables: ["1 Reel", "2 Stories"],
      lastActivity: "1 day ago",
      method: "email",
    },
    {
      id: 3,
      creator: "@food_blogger_sarah",
      status: "pending",
      initialOffer: "$800",
      deliverables: ["1 Post", "2 Stories"],
      lastActivity: "3 days ago",
      method: "voice",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agreed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Negotiation Hub</h1>
          <p className="text-gray-600 mt-1">
            Manage deal negotiations with AI-powered voice calls and manual
            tracking
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          Start New Negotiation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Negotiations */}
          <Card>
            <CardHeader>
              <CardTitle>Active Negotiations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {negotiations.map((negotiation) => (
                <div key={negotiation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{negotiation.creator}</h3>
                      <p className="text-sm text-gray-500">
                        {negotiation.lastActivity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(negotiation.status)}>
                        {negotiation.status.replace("_", " ")}
                      </Badge>
                      {negotiation.method === "voice" && (
                        <Badge variant="outline">
                          <Phone className="w-3 h-3 mr-1" />
                          Voice
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Initial Offer</p>
                      <p className="font-medium">{negotiation.initialOffer}</p>
                    </div>
                    {negotiation.counterOffer && (
                      <div>
                        <p className="text-sm text-gray-500">Counter Offer</p>
                        <p className="font-medium">
                          {negotiation.counterOffer}
                        </p>
                      </div>
                    )}
                    {negotiation.currentOffer && (
                      <div>
                        <p className="text-sm text-gray-500">Current Offer</p>
                        <p className="font-medium">
                          {negotiation.currentOffer}
                        </p>
                      </div>
                    )}
                    {negotiation.finalAmount && (
                      <div>
                        <p className="text-sm text-gray-500">Final Amount</p>
                        <p className="font-medium text-green-600">
                          {negotiation.finalAmount}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Deliverables</p>
                    <div className="flex flex-wrap gap-1">
                      {negotiation.deliverables.map((deliverable, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-3 h-3 mr-1" />
                      Voice Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Update Deal
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Manual Deal Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Deal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                For negotiations completed outside the platform (email,
                WhatsApp, etc.)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="creator">Creator Username</Label>
                  <Input id="creator" placeholder="@creator_username" />
                </div>
                <div>
                  <Label htmlFor="finalAmount">Final Amount</Label>
                  <Input id="finalAmount" placeholder="$1,500" />
                </div>
              </div>

              <div>
                <Label htmlFor="deliverables">Agreed Deliverables</Label>
                <Textarea
                  id="deliverables"
                  placeholder="2 Instagram posts, 4 stories, 1 reel..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline">Delivery Timeline</Label>
                  <Input id="timeline" placeholder="2 weeks" />
                </div>
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upfront">100% Upfront</SelectItem>
                      <SelectItem value="completion">On Completion</SelectItem>
                      <SelectItem value="split">50/50 Split</SelectItem>
                      <SelectItem value="milestone">Milestone Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or agreed terms..."
                  rows={3}
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Save Deal & Generate Contract
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Voice Call Settings */}
          <Card>
            <CardHeader>
              <CardTitle>AI Voice Call Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="voicePersonality">AI Personality</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxBudget">Max Budget</Label>
                <Input id="maxBudget" placeholder="$2,000" />
              </div>

              <div>
                <Label htmlFor="negotiationGoals">Negotiation Goals</Label>
                <Textarea
                  id="negotiationGoals"
                  placeholder="Keep cost under $1,500, require Stories..."
                  rows={3}
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Schedule AI Call
              </Button>
            </CardContent>
          </Card>

          {/* Negotiation Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Negotiation Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Savings</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Duration</span>
                <span className="font-medium">3.2 days</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <IndianRupee className="w-4 h-4 mr-2" />
                View Budget Status
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Negotiation;
