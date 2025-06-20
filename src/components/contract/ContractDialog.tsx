/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/services/api";
import { Loader2, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Contract } from "@/services/campaignCreatorApi";

/**
 * Type definition for contract form data
 */
interface ContractData {
  campaignName: string;
  creatorName: string;
  agreedBudget: string;
  deliverables: string;
  timeline: string;
  additionalTerms: string;
}

/**
 * Type definition for DocuSeal submission response
 */
interface DocuSealSubmitter {
  id: number;
  slug: string;
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  completed_at: string | null;
  declined_at: string | null;
  external_id: string | null;
  submission_id: number;
  metadata: any;
  opened_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  application_key: string | null;
  values: any[];
  preferences: {
    send_email: boolean;
    send_sms: boolean;
  };
  role: string;
  embed_src: string;
}

interface DocuSealSubmission {
  id: number;
  submitters: DocuSealSubmitter[];
  expire_at: string | null;
  created_at: string;
}

// API response interface
interface ContractApiResponse {
  data: Contract;
}

interface ContractDialogProps {
  trigger: React.ReactNode;
  creatorName: string;
  campaignName: string;
  mappingId: string;
  onContractGenerated: (contractData: ContractData) => void;
  onContractSent?: (contract: Contract) => void; // Callback when contract is sent
  deliverables: string;
}

const ContractDialog = ({
  trigger,
  creatorName,
  campaignName,
  mappingId,
  onContractGenerated,
  onContractSent,
  deliverables,
}: ContractDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] =
    useState<DocuSealSubmission | null>(null);
  const [contractData, setContractData] = useState({
    campaignName: campaignName,
    creatorName: creatorName,
    agreedBudget: "₹1,000",
    deliverables: deliverables,
    timeline: "Content delivery within 2 weeks",
    additionalTerms: "Brand approval required before posting",
  });
  const [contractDetails, setContractDetails] = useState<Contract | null>(null);

  /**
   * Handles the submission of contract data to the API
   */
  const handleSave = async () => {
    if (!mappingId) {
      toast.error("Missing mapping ID", {
        description: "Cannot send contract without mapping information",
      });
      return;
    }

    // Notify parent component about contract generation
    onContractGenerated(contractData);

    try {
      setIsSubmitting(true);

      // Call the API to send the contract via DocuSeal
      const response = await apiService.post<ContractApiResponse>(
        `/campaign-creator/${mappingId}/send-contract`
      );

      // Store both the submission and contract data
      if (response.data) {
        console.log("Contract sent successfully:", response.data);
        const submissionData = response.data.meta.docusealSubmission;
        const contractData = response.data;

        setSubmissionData(submissionData as any);
        setContractDetails(contractData);

        // Call the onContractSent callback with the contract data if provided
        if (onContractSent && contractData) onContractSent(contractData);
        
        // Stay in the same dialog instead of closing and opening a new one
        setSubmissionData(submissionData as any);
      }

      toast.success("Contract sent successfully", {
        description: "The contract has been sent to all parties for signing.",
      });
    } catch (error) {
      console.error("Error sending contract:", error);
      toast.error("Error sending contract", {
        description: "Could not send the contract. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // If showing submission results, go back to contract form
    if (submissionData) {
      setSubmissionData(null);
    } else {
      // Otherwise, just close the dialog
      setOpen(false);
    }
  };

  /**
   * Formats the date to a human-readable format
   */
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  /**
   * Copies the URL to clipboard
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
        toast.error("Failed to copy link");
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            {!submissionData && <DialogTitle>Generate Contract</DialogTitle>}
          </DialogHeader>
          {submissionData ? (
            <>
              <div className="flex justify-between mb-4 items-center">
                <DialogTitle className="text-xl font-bold">Contract Details</DialogTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmissionData(null)}
                >
                  Back to Details
                </Button>
              </div>
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium">
                    Contract Sent Successfully
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    The contract has been sent to all parties for signing.
                  </p>
                </div>
                
                {contractDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <p className="text-gray-500">Contract ID</p>
                        <p className="font-medium">{contractDetails.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium">{contractDetails.status || "Contract Created"}</p>
                      </div>
                      
                      <div className="col-span-2 mt-2">
                        <h4 className="font-medium mb-2">Recipients</h4>
                        {submissionData.submitters?.map((submitter, index) => (
                          <div key={submitter.id} className="mb-4 p-3 bg-white rounded border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="font-medium">{submitter.name}</p>
                                <p className="text-sm text-gray-500">{submitter.email}</p>
                              </div>
                              <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                                {submitter.role?.toUpperCase() || "RECIPIENT"}
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Signing Link:</p>
                              <div className="flex items-center mt-1">
                                <a 
                                  href={submitter.embed_src}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-sm truncate flex-1"
                                >
                                  {submitter.embed_src}
                                  <ExternalLink className="inline-block ml-1 w-3 h-3" />
                                </a>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(submitter.embed_src)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={contractData.campaignName}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="creatorName">Creator Name</Label>
                  <Input
                    id="creatorName"
                    value={contractData.creatorName}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="agreedBudget">Campaigned Assigned Budget</Label>
                <Input
                  id="agreedBudget"
                  value={contractData.agreedBudget}
                  onChange={(e) =>
                    setContractData({
                      ...contractData,
                      agreedBudget: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="deliverables">Deliverables</Label>
                <Textarea
                  disabled
                  id="deliverables"
                  value={contractData.deliverables}
                  onChange={(e) =>
                    setContractData({
                      ...contractData,
                      deliverables: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={contractData.timeline}
                  onChange={(e) =>
                    setContractData({
                      ...contractData,
                      timeline: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Contract"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractDialog;
