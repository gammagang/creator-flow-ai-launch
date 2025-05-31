
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Plus, Calendar, User } from "lucide-react";

const Contracts = () => {
  // TODO: Replace with real contract data
  const contracts = [
    {
      id: 1,
      creator: "@fashionista_jane",
      campaign: "Summer Launch 2024",
      amount: "$1,750",
      status: "signed",
      createdDate: "2024-01-15",
      signedDate: "2024-01-16",
      deliverables: ["2 Posts", "4 Stories"]
    },
    {
      id: 2,
      creator: "@fitness_guru_mike",
      campaign: "Wellness Campaign",
      amount: "$1,200",
      status: "pending_signature",
      createdDate: "2024-01-14",
      deliverables: ["1 Reel", "2 Stories"]
    },
    {
      id: 3,
      creator: "@food_blogger_sarah",
      campaign: "Food Content Series",
      amount: "$800",
      status: "draft",
      createdDate: "2024-01-13",
      deliverables: ["1 Post", "2 Stories"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "signed": return "bg-green-100 text-green-800";
      case "pending_signature": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600 mt-1">Manage influencer collaboration contracts and e-signatures</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Generate Contract
        </Button>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{contract.creator}</h3>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{contract.campaign}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Amount: {contract.amount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created: {contract.createdDate}</span>
                      </div>
                      {contract.signedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Signed: {contract.signedDate}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contract.deliverables.map((deliverable, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {deliverable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  {contract.status === 'draft' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Send for Signature
                    </Button>
                  )}
                  {contract.status === 'pending_signature' && (
                    <Button size="sm" variant="outline">
                      Remind Signer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contract Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Standard Collaboration</h3>
              <p className="text-sm text-gray-500">Basic influencer partnership agreement</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <FileText className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-medium mb-1">Exclusive Partnership</h3>
              <p className="text-sm text-gray-500">Long-term exclusive brand ambassador</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <FileText className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium mb-1">Event Collaboration</h3>
              <p className="text-sm text-gray-500">Event coverage and promotion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contracts;
