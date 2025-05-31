
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Phone, PhoneOff, Clock, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

const VoiceNegotiation = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [negotiationStatus, setNegotiationStatus] = useState<'waiting' | 'active' | 'completed' | 'failed'>('waiting');

  // TODO: Replace with actual creator data from URL params
  const creatorData = {
    name: "Sarah Fashion",
    handle: "@sarahfashion",
    followers: "125K",
    engagement: "4.2%"
  };

  const negotiationTerms = {
    budget: "$1,500 - $2,500",
    deliverables: "2 Instagram posts, 3 stories",
    timeline: "2 weeks",
    paymentStructure: "50% upfront, 50% on completion"
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    setIsCallActive(true);
    setNegotiationStatus('active');
    // TODO: Initialize ElevenLabs voice API
  };

  const endCall = () => {
    setIsCallActive(false);
    setNegotiationStatus('completed');
    // TODO: Save negotiation outcome
  };

  const requestManualCall = () => {
    // TODO: Implement manual call request
    console.log("Requesting manual call");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Negotiation</h1>
        <p className="text-gray-600">AI-powered deal negotiation with {creatorData.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Call Status</span>
                <Badge variant={negotiationStatus === 'active' ? 'default' : 'secondary'}>
                  {negotiationStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                {!isCallActive ? (
                  <div className="space-y-4">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Phone className="w-12 h-12 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ready to Start Negotiation</h3>
                      <p className="text-gray-600 mb-4">
                        Our AI agent will conduct the negotiation on your behalf based on your campaign requirements.
                      </p>
                      <Button onClick={startCall} size="lg" className="bg-green-600 hover:bg-green-700">
                        <Phone className="w-5 h-5 mr-2" />
                        Start Voice Call
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Mic className={`w-12 h-12 ${isMuted ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Call in Progress</h3>
                      <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(callDuration)}</span>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setIsMuted(!isMuted)}
                          className={isMuted ? 'bg-red-50 border-red-200' : ''}
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button onClick={endCall} variant="destructive">
                          <PhoneOff className="w-4 h-4 mr-2" />
                          End Call
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {callDuration > 300 && isCallActive && (
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 mb-3">
                      Call has been running for over 5 minutes. Would you like to request a manual call?
                    </p>
                    <Button onClick={requestManualCall} variant="outline" size="sm">
                      Request Manual Call
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {negotiationStatus === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Negotiation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Final Budget:</span>
                    <span>$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Deliverables:</span>
                    <span>2 posts, 3 stories, 1 reel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Timeline:</span>
                    <span>10 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment:</span>
                    <span>60% upfront, 40% completion</span>
                  </div>
                </div>
                <Button className="w-full mt-4">Generate Contract</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creator Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">{creatorData.name}</h4>
                  <p className="text-gray-600">{creatorData.handle}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="block text-gray-500">Followers</span>
                    <span className="font-medium">{creatorData.followers}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Engagement</span>
                    <span className="font-medium">{creatorData.engagement}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Negotiation Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">Budget Range</span>
                  <span className="font-medium">{negotiationTerms.budget}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Deliverables</span>
                  <span className="font-medium">{negotiationTerms.deliverables}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Timeline</span>
                  <span className="font-medium">{negotiationTerms.timeline}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">Payment</span>
                  <span className="font-medium">{negotiationTerms.paymentStructure}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceNegotiation;
