import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { campaignCreatorAPI } from "@/services/campaignCreatorApi";
import { toast } from "sonner";

interface ContentDeliverablesCardProps {
  mappingId: string | undefined;
  initialContentDeliverables: string;
  onDeliverablesUpdated?: () => void;
}

const ContentDeliverablesCard = ({
  mappingId,
  initialContentDeliverables,
  onDeliverablesUpdated,
}: ContentDeliverablesCardProps) => {
  const [contentDeliverables, setContentDeliverables] = useState(
    initialContentDeliverables
  );
  const [isSavingDeliverables, setIsSavingDeliverables] = useState(false);

  // Update state when initialContentDeliverables prop changes
  useEffect(() => {
    setContentDeliverables(initialContentDeliverables);
  }, [initialContentDeliverables]);

  const updateDeliverablessMutation = useMutation({
    mutationFn: async () => {
      if (!mappingId) throw new Error("Mapping ID is required");
      return await campaignCreatorAPI.updateCampaignCreatorLink(mappingId, {
        contentDeliverables,
      });
    },
    onSuccess: () => {
      toast.success("Content deliverables updated successfully!");

      // Call the callback to notify parent instead of full page reload
      if (onDeliverablesUpdated) {
        onDeliverablesUpdated();
      }
    },
    onError: (error: unknown) => {
      toast.error("Failed to update content deliverables. Please try again.");
      console.error("Error updating deliverables:", error);
    },
    onSettled: () => {
      setIsSavingDeliverables(false);
    },
  });

  const handleSaveDeliverables = () => {
    setIsSavingDeliverables(true);
    updateDeliverablessMutation.mutate();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          Content Deliverables
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Define what the creator will deliver as part of this campaign
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={contentDeliverables}
            onChange={(e) => setContentDeliverables(e.target.value)}
            className="min-h-[120px] w-full font-mono text-sm"
            placeholder="Enter content deliverables (e.g., 2 Instagram posts, 3 Stories, 1 Reel)"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSaveDeliverables}
              disabled={isSavingDeliverables}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSavingDeliverables ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Deliverables
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentDeliverablesCard;
