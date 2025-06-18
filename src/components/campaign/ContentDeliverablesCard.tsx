import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { campaignCreatorAPI } from "@/services/campaignCreatorApi";
import { useMutation } from "@tanstack/react-query";
import { FileText, Save } from "lucide-react";
import { useEffect, useState } from "react";
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
    <Card className="mb-6 rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          Content Deliverables
        </CardTitle>
        <p className="text-base text-gray-500 mt-1">
          Define what the creator will deliver as part of this campaign
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={contentDeliverables}
            onChange={(e) => setContentDeliverables(e.target.value)}
            className="min-h-[48px] w-full font-mono text-base rounded-xl border-2 border-gray-200 bg-white/80"
            placeholder="Enter content deliverables (e.g., 2 Instagram posts, 3 Stories, 1 Reel)"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSaveDeliverables}
              disabled={isSavingDeliverables}
              className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-6 py-2 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
            >
              {isSavingDeliverables ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : (
                <>Save Deliverables</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentDeliverablesCard;
