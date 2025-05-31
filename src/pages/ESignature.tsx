
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, PenTool, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const ESignature = () => {
  const [signatureStatus, setSignatureStatus] = useState<'pending' | 'signed' | 'completed'>('pending');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // TODO: Get contract details from URL params or API
  const contractDetails = {
    id: "CTR-2024-001",
    title: "Influencer Marketing Agreement - Sarah Fashion",
    creator: "Sarah Fashion (@sarahfashion)",
    brand: "TechFlow Solutions",
    amount: "$2,000",
    date: "2024-01-15"
  };

  const handleSign = () => {
    setSignatureStatus('signed');
    // TODO: Process signature and send to backend
    setTimeout(() => {
      setSignatureStatus('completed');
    }, 2000);
  };

  const downloadContract = () => {
    // TODO: Generate and download PDF
    console.log("Downloading contract");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Signature</h1>
        <p className="text-gray-600">Review and sign your influencer marketing agreement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contract Document
                </span>
                <Badge variant={signatureStatus === 'completed' ? 'default' : 'secondary'}>
                  {signatureStatus === 'completed' ? 'Fully Executed' : 'Awaiting Signatures'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center mb-6">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{contractDetails.title}</h3>
                <p className="text-gray-600 mb-4">Contract ID: {contractDetails.id}</p>
                <Button variant="outline" onClick={downloadContract}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {signatureStatus === 'pending' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Digital Signature</h4>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-32 flex items-center justify-center">
                    {!hasDrawnSignature ? (
                      <div className="text-center text-gray-500">
                        <PenTool className="w-8 h-8 mx-auto mb-2" />
                        <p>Draw your signature here</p>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => setHasDrawnSignature(true)}
                          className="mt-2"
                        >
                          Simulate Signature
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl font-script text-blue-600 mb-2">
                          John Smith
                        </div>
                        <p className="text-sm text-gray-500">Your signature</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setHasDrawnSignature(false)}
                      disabled={!hasDrawnSignature}
                    >
                      Clear
                    </Button>
                    <Button 
                      onClick={handleSign}
                      disabled={!hasDrawnSignature}
                      className="flex-1"
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      Sign Contract
                    </Button>
                  </div>
                </div>
              )}

              {signatureStatus === 'signed' && (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Processing Signature...</h3>
                  <p className="text-gray-600">Please wait while we finalize the contract</p>
                </div>
              )}

              {signatureStatus === 'completed' && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Contract Fully Executed!</h3>
                  <p className="text-gray-600 mb-4">
                    All parties have signed the contract. You can now proceed with the campaign.
                  </p>
                  <Button>View Campaign Dashboard</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">Creator</span>
                  <span className="font-medium">{contractDetails.creator}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Brand</span>
                  <span className="font-medium">{contractDetails.brand}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Contract Value</span>
                  <span className="font-medium">{contractDetails.amount}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Date</span>
                  <span className="font-medium">{contractDetails.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signature Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Brand Representative</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Creator</span>
                  {signatureStatus === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">
                By signing this contract, you agree to all terms and conditions outlined in the agreement. 
                This constitutes a legally binding contract between the parties.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ESignature;
