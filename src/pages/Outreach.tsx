
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Bot, User, Calendar } from "lucide-react";

const Outreach = () => {
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState("");

  // TODO: Replace with real outreach data
  const outreachHistory = [
    {
      id: 1,
      creator: "@fashionista_jane",
      subject: "Collaboration Opportunity - Summer Collection",
      status: "responded",
      sentDate: "2024-01-15",
      responseDate: "2024-01-16"
    },
    {
      id: 2,
      creator: "@fitness_guru_mike", 
      subject: "Partnership Proposal - Wellness Campaign",
      status: "pending",
      sentDate: "2024-01-14",
      responseDate: null
    },
    {
      id: 3,
      creator: "@food_blogger_sarah",
      subject: "Brand Collaboration - Food Content",
      status: "opened",
      sentDate: "2024-01-13",
      responseDate: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "responded": return "bg-green-100 text-green-800";
      case "opened": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "bounced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Outreach</h1>
          <p className="text-gray-600 mt-1">Send personalized emails to creators with AI assistance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4 mr-2" />
          Bulk Send
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Email Composer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                AI Email Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign">Campaign</Label>
                  <Input id="campaign" placeholder="Select campaign" />
                </div>
                <div>
                  <Label htmlFor="tone">Email Tone</Label>
                  <Input id="tone" placeholder="Professional, Friendly, Casual" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input 
                  id="subject" 
                  placeholder="Collaboration Opportunity - [Brand Name]"
                />
              </div>

              <div>
                <Label htmlFor="emailBody">Email Content</Label>
                <Textarea 
                  id="emailBody"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  placeholder="Hi [Creator Name],

I hope this email finds you well! I'm reaching out from [Brand Name] because..."
                  rows={10}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Bot className="w-4 h-4 mr-2" />
                  Generate with AI
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outreach History */}
          <Card>
            <CardHeader>
              <CardTitle>Outreach History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outreachHistory.map((outreach) => (
                  <div key={outreach.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{outreach.creator}</p>
                        <p className="text-sm text-gray-500">{outreach.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Sent {outreach.sentDate}
                          </span>
                          {outreach.responseDate && (
                            <span className="text-xs text-gray-500">
                              • Responded {outreach.responseDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(outreach.status)}>
                      {outreach.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Creators */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Choose creators to send personalized outreach emails
              </p>
              <Button variant="outline" className="w-full">
                Select Creators
              </Button>
            </CardContent>
          </Card>

          {/* Template Library */}
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-left">
                <div>
                  <p className="font-medium">Collaboration Invite</p>
                  <p className="text-xs text-gray-500">For new partnerships</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                <div>
                  <p className="font-medium">Follow-up Email</p>
                  <p className="text-xs text-gray-500">For non-responders</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left">
                <div>
                  <p className="font-medium">Contract Reminder</p>
                  <p className="text-xs text-gray-500">For contract signing</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Response Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Open Rate</span>
                <span className="font-medium">72%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Response Rate</span>
                <span className="font-medium">34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Conversion Rate</span>
                <span className="font-medium">18%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Outreach;
