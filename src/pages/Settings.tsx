import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Key, CreditCard } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Settings
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Manage your account and platform preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5" /> Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Your Company" />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive email updates about your campaigns
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Creator Responses</p>
                    <p className="text-sm text-gray-500">
                      Get notified when creators respond to outreach
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Contract Updates</p>
                    <p className="text-sm text-gray-500">
                      Alerts for contract signings and updates
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Confirmations</p>
                    <p className="text-sm text-gray-500">
                      Notifications for payment processing
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* API Settings */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Key className="w-5 h-5" /> API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <div>
                  <Label htmlFor="groqApiKey">Groq API Key</Label>
                  <Input
                    id="groqApiKey"
                    type="password"
                    placeholder="gsk_..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For AI-powered email generation
                  </p>
                </div>
                <div>
                  <Label htmlFor="sendgridApiKey">SendGrid API Key</Label>
                  <Input
                    id="sendgridApiKey"
                    type="password"
                    placeholder="SG..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For automated email outreach
                  </p>
                </div>
                <div>
                  <Label htmlFor="elevenLabsApiKey">ElevenLabs API Key</Label>
                  <Input
                    id="elevenLabsApiKey"
                    type="password"
                    placeholder="sk-..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For AI voice negotiations
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Account Status */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-8 pt-0">
                <div className="flex justify-between">
                  <span className="text-sm">Plan</span>
                  <span className="font-medium">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Budget</span>
                  <span className="font-medium">$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Campaigns</span>
                  <span className="font-medium">12 / 25</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            {/* Billing */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-8 pt-0">
                <div className="flex justify-between">
                  <span className="text-sm">Next Payment</span>
                  <span className="font-medium">$99/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Due Date</span>
                  <span className="font-medium">Feb 15, 2024</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl h-12 text-base font-semibold border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
                >
                  Manage Billing
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-8 pt-0">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl h-12 text-base font-semibold border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
                >
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl h-12 text-base font-semibold border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
                >
                  Download Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl h-12 text-base font-semibold border-2 border-gray-200 bg-white/80 hover:bg-orange-50 text-red-600 hover:text-red-700"
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
