
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface ContractDialogProps {
  trigger: React.ReactNode;
  creatorName: string;
  campaignName: string;
  onContractGenerated: (contractData: any) => void;
}

const ContractDialog = ({ trigger, creatorName, campaignName, onContractGenerated }: ContractDialogProps) => {
  const [open, setOpen] = useState(false);
  const [contractData, setContractData] = useState({
    campaignName: campaignName,
    creatorName: creatorName,
    agreedBudget: "$5,000",
    deliverables: "2 Instagram posts, 3 Instagram stories",
    timeline: "Content delivery within 2 weeks",
    additionalTerms: "Brand approval required before posting"
  });

  const handleSave = () => {
    onContractGenerated(contractData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Contract</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={contractData.campaignName}
                onChange={(e) => setContractData({...contractData, campaignName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="creatorName">Creator Name</Label>
              <Input
                id="creatorName"
                value={contractData.creatorName}
                onChange={(e) => setContractData({...contractData, creatorName: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="agreedBudget">Agreed Budget</Label>
            <Input
              id="agreedBudget"
              value={contractData.agreedBudget}
              onChange={(e) => setContractData({...contractData, agreedBudget: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="deliverables">Deliverables</Label>
            <Textarea
              id="deliverables"
              value={contractData.deliverables}
              onChange={(e) => setContractData({...contractData, deliverables: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              value={contractData.timeline}
              onChange={(e) => setContractData({...contractData, timeline: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="additionalTerms">Additional Terms</Label>
            <Textarea
              id="additionalTerms"
              value={contractData.additionalTerms}
              onChange={(e) => setContractData({...contractData, additionalTerms: e.target.value})}
              rows={3}
            />
          </div>

          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Contract Preview</h4>
              <div className="text-sm space-y-2">
                <p><strong>Campaign:</strong> {contractData.campaignName}</p>
                <p><strong>Creator:</strong> {contractData.creatorName}</p>
                <p><strong>Budget:</strong> {contractData.agreedBudget}</p>
                <p><strong>Deliverables:</strong> {contractData.deliverables}</p>
                <p><strong>Timeline:</strong> {contractData.timeline}</p>
                <p><strong>Terms:</strong> {contractData.additionalTerms}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Contract
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
