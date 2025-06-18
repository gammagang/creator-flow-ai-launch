import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract, Submitter } from "@/services/campaignCreatorApi";
import { CheckCircle, Clock, ExternalLink, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

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
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="max-w-2xl w-full rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] p-0 relative">
        {/* X Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center bg-white border-2 border-gray-200 shadow-[2px_2px_0px_0px_#000] rounded-full hover:bg-orange-50 hover:shadow-[3px_3px_0px_0px_#000] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <CardHeader className="p-8 pb-4">
          <div className="mb-2">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-1">
              Contract Details
            </CardTitle>
            {contract && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 capitalize`}
                >
                  {contract.status}
                </span>
                <span className="flex items-center text-xs text-gray-500 ml-2">
                  <Clock className="w-3 h-3 mr-1" />
                  Sent{" "}
                  {formatDate(
                    contract.sent_at instanceof Date
                      ? contract.sent_at.toString()
                      : String(contract.sent_at)
                  )}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0 max-h-[60vh] overflow-y-auto">
          {contract ? (
            <div className="space-y-8">
              {/* Contract Details Grid */}
              <div className="bg-gray-50 p-6 rounded-2xl mb-2">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">
                      Contract ID
                    </p>
                    <p className="font-semibold text-lg text-gray-800">
                      {contract.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 capitalize`}
                    >
                      {contract.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recipients List */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="font-semibold mb-4 text-gray-700 text-base">
                  Recipients
                </h4>
                <div className="divide-y">
                  {contract.meta?.docusealSubmission?.submitters?.map(
                    (submitter: Submitter, index: number) => (
                      <div
                        key={index}
                        className="py-4 text-sm flex flex-col gap-2"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-800 text-base">
                              {submitter.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {submitter.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 md:mt-0">
                            <span className="text-xs font-semibold uppercase px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-200">
                              {submitter.role}
                            </span>
                            {submitter.completed_at ? (
                              <span className="flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full border border-green-200 ml-2">
                                <CheckCircle className="w-3 h-3 mr-1" /> Signed
                              </span>
                            ) : (
                              <span className="flex items-center text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full border border-amber-200 ml-2">
                                <Clock className="w-3 h-3 mr-1" />{" "}
                                {submitter.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1 mt-2">
                            Signing Link:
                          </p>
                          <div className="flex items-center gap-2">
                            <a
                              href={submitter.embed_src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 break-all text-sm flex items-center flex-1"
                            >
                              {submitter.embed_src}
                              <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                            </a>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 h-7 px-2 rounded-xl border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
                              onClick={() =>
                                copyToClipboard(submitter.embed_src)
                              }
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-lg">
                No contract data available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractViewDialog;
