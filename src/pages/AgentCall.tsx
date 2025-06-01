import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Phone, PhoneOff, Mail, Send } from "lucide-react";

const AgentCall = () => {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaign');
  const creatorId = searchParams.get('creator');
  const action = searchParams.get('action');

  // TODO: Replace with real campaign data fetch based on campaignId
  const campaigns = [
    {
      id: 1,
      name: "Summer Launch 2024",
      status: "active",
      budget: "$15,000",
      creatorsContacted: 24,
      creatorsResponded: 16,
      startDate: "2024-06-01",
      endDate: "2024-07-31",
      deliverables: ["Posts", "Stories", "Reels"]
    },
    {
      id: 2,
      name: "Back to School Campaign",
      status: "draft",
      budget: "$8,500",
      creatorsContacted: 0,
      creatorsResponded: 0,
      startDate: "2024-08-15",
      endDate: "2024-09-30",
      deliverables: ["Posts", "Stories"]
    },
    {
      id: 3,
      name: "Holiday Collection",
      status: "completed",
      budget: "$22,000",
      creatorsContacted: 35,
      creatorsResponded: 28,
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      deliverables: ["Posts", "Reels", "IGTV"]
    }
  ];

  const campaign = campaigns.find(c => c.id === parseInt(campaignId || '1')) || campaigns[0];

  const isOutreachMode = action === 'outreach';

  const emailContent = `Subject: Exciting Partnership Opportunity with ${campaign.name}

Dear Creator,

We hope this email finds you well. We're reaching out regarding an exciting partnership opportunity for our upcoming ${campaign.name} campaign.

Campaign Details:
- Budget: ${campaign.budget}
- Timeline: ${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}
- Deliverables: ${campaign.deliverables.join(', ')}

We believe your content style and audience would be a perfect fit for this campaign. We'd love to discuss this opportunity further and answer any questions you might have.

Please let us know if you're interested in learning more about this collaboration.

Best regards,
Campaign Team`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isOutreachMode ? 'Outreach Email' : 'Agent Call'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isOutreachMode ? 'Review and send outreach email' : 'Campaign details for agent call'}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{campaign.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isOutreachMode ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Email Preview</h3>
                  <div className="text-sm whitespace-pre-line bg-white p-3 rounded border">
                    {emailContent}
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Edit Email
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Budget</span>
                    </div>
                    <p className="font-medium text-lg">{campaign.budget}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Timeline</span>
                  </div>
                  <p className="text-gray-700 text-lg">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Deliverables</p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.deliverables.map((deliverable) => (
                      <Badge key={deliverable} variant="outline" className="text-sm">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Start Call
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                    <PhoneOff className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentCall;
