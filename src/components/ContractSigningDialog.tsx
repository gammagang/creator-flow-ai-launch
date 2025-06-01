
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ContractSigningDialogProps {
  trigger: React.ReactNode;
  contractData: any;
  onContractSigned: () => void;
}

const ContractSigningDialog = ({ trigger, contractData, onContractSigned }: ContractSigningDialogProps) => {
  const [open, setOpen] = useState(false);
  const [brandSigned, setBrandSigned] = useState(false);

  const handleBrandSign = () => {
    setBrandSigned(true);
  };

  const handleComplete = () => {
    if (brandSigned) {
      onContractSigned();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contract Signing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Contract Details</h4>
              <div className="text-sm space-y-2">
                <p><strong>Campaign:</strong> {contractData?.campaignName}</p>
                <p><strong>Creator:</strong> {contractData?.creatorName}</p>
                <p><strong>Budget:</strong> {contractData?.agreedBudget}</p>
                <p><strong>Deliverables:</strong> {contractData?.deliverables}</p>
                <p><strong>Timeline:</strong> {contractData?.timeline}</p>
                <p><strong>Terms:</strong> {contractData?.additionalTerms}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Brand Signature</h4>
                <p className="text-sm text-gray-600">Brand representative signature required</p>
              </div>
              <div className="flex items-center gap-2">
                {brandSigned ? (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Signed
                  </Badge>
                ) : (
                  <Button onClick={handleBrandSign} size="sm">
                    Sign as Brand
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={!brandSigned}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Contract
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractSigningDialog;
