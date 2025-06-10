import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";

const ContractDetails = () => {
  const { id } = useParams();

  // TODO: Fetch contract data based on ID
  const contract = {
    id: 1,
    creator: "@fashionista_jane",
    campaign: "Summer Launch 2024",
    amount: "$1,750",
    status: "signed",
    createdDate: "2024-01-15",
    signedDate: "2024-01-16",
    deliverables: ["2 Posts", "4 Stories"],
    timeline: "2 weeks from signing",
    paymentTerms: "50% upfront, 50% on completion",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Details</h1>
          <p className="text-gray-600 mt-1">
            {contract.creator} - {contract.campaign}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Reminder
          </Button>
        </div>
      </div>

      {/* Status and Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  Influencer Collaboration Agreement
                </h2>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  Fully Executed
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{contract.amount}</p>
              <p className="text-sm text-gray-500">Total Value</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Timeline</span>
              </div>
              <p className="text-gray-700">{contract.timeline}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Payment Terms</span>
              </div>
              <p className="text-gray-700">{contract.paymentTerms}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <p className="text-green-600 font-medium">
                Signed by both parties
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contract.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{deliverable}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Usage Rights</span>
              <p className="font-medium">1 year perpetual license</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Exclusivity</span>
              <p className="font-medium">Non-exclusive</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Approval Required</span>
              <p className="font-medium">Yes, within 48 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract History */}
      <Card>
        <CardHeader>
          <CardTitle>Contract History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                Contract signed by {contract.creator} - {contract.signedDate}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">
                Contract sent for signature - {contract.createdDate}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm">
                Contract generated from negotiation - {contract.createdDate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractDetails;
