import React from "react";
import { toast } from "sonner";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Contract, Submitter } from "@/services/campaignCreatorApi";

interface ContractViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}

const ContractViewDialog: React.FC<ContractViewDialogProps> = ({
  isOpen,
  onClose,
  contract,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying text:", error);
        toast.error("Failed to copy link");
      });
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contract Details</DialogTitle>
        </DialogHeader>
        {contract ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium">
                Contract {contract.status === "sent" ? "Sent" : contract.status}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Sent on{" "}
                {formatDate(
                  contract.sent_at instanceof Date
                    ? contract.sent_at.toString()
                    : String(contract.sent_at)
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Contract Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Contract ID</p>
                    <p className="font-medium">{contract.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium capitalize">{contract.status}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Recipients</h4>
                <div className="divide-y">
                  {contract.meta?.docusealSubmission?.submitters?.map(
                    (submitter: Submitter, index: number) => (
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
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>No contract data available.</p>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractViewDialog;
