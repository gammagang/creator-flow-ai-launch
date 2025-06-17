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
import ContractViewDialog from "./ContractViewDialog";
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
  metadata: Record<string, unknown>;
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
  data: {
    data: {
      submission: DocuSealSubmission;
      contract: Contract;
    };
  };
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
  const [showContractView, setShowContractView] = useState(false);

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
      if (response.data && response.data.data) {
        const submissionData = response.data.data.submission;
        const contractData = response.data.data.contract;

        setSubmissionData(submissionData);
        setContractDetails(contractData);

        // Call the onContractSent callback with the contract data if provided
        if (onContractSent && contractData) {
          onContractSent(contractData);
        }

        // Close the dialog after a short delay to allow the user to see the success message
        setTimeout(() => {
          setOpen(false);
        }, 2000);
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
            <DialogTitle>Generate Contract</DialogTitle>
          </DialogHeader>
          {submissionData ? (
            <>
              <div className="flex justify-start mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmissionData(null)}
                >
                  Back to Details
                </Button>
              </div>
              <div className="space-y-6">
                <div className="text-center">
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

                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowContractView(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Contract Details
                  </Button>
                </div>
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
                <Label htmlFor="agreedBudget">Agreed Budget</Label>
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

      {/* Contract view dialog */}
      <ContractViewDialog
        isOpen={showContractView}
        onClose={() => setShowContractView(false)}
        contract={contractDetails}
      />
    </>
  );
};

export default ContractDialog;
