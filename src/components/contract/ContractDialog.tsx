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

interface ContractDialogProps {
  trigger: React.ReactNode;
  creatorName: string;
  campaignName: string;
  mappingId: string;
  onContractGenerated: (contractData: ContractData) => void;
}

const ContractDialog = ({
  trigger,
  creatorName,
  campaignName,
  mappingId,
  onContractGenerated,
}: ContractDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] =
    useState<DocuSealSubmission | null>(null);

  const [contractData, setContractData] = useState({
    campaignName: campaignName,
    creatorName: creatorName,
    agreedBudget: "$5,000",
    deliverables: "2 Instagram posts, 3 Instagram stories",
    timeline: "Content delivery within 2 weeks",
    additionalTerms: "Brand approval required before posting",
  });

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
      const response = await apiService.post<{ data: DocuSealSubmission }>(
        `/campaign-creator/${mappingId}/send-contract`
      );

      // Store the submission data for displaying results
      setSubmissionData(response.data);

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

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Contract Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Contract ID</p>
                      <p className="font-medium">{submissionData.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">
                        {formatDate(submissionData.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Recipients</h4>
                  <div className="divide-y">
                    {submissionData.submitters.map((submitter, index) => (
                      <div key={index} className="py-3 text-sm">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{submitter.name}</p>
                              <p className="text-gray-500">{submitter.email}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs font-medium uppercase px-2 py-1 rounded bg-gray-100">
                                {submitter.role}
                              </span>
                              {submitter.completed_at ? (
                                <span className="ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                  Signed
                                </span>
                              ) : (
                                <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                  {submitter.status}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">
                              Signing Link:
                            </p>
                            <div className="flex items-center">
                              <a
                                href={submitter.embed_src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 break-all text-sm flex items-center mr-2 flex-1"
                              >
                                {submitter.embed_src}
                                <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                              </a>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-shrink-0 h-7 px-2"
                                onClick={() =>
                                  copyToClipboard(submitter.embed_src)
                                }
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  setContractData({ ...contractData, timeline: e.target.value })
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
  );
};

export default ContractDialog;
