import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Calendar, User, Plus } from "lucide-react";

const Payments = () => {
  // TODO: Replace with real payment data
  const payments = [
    {
      id: 1,
      creator: "@fashionista_jane",
      campaign: "Summer Launch 2024",
      amount: "$875",
      type: "milestone",
      status: "completed",
      date: "2024-01-16",
      method: "Bank Transfer",
    },
    {
      id: 2,
      creator: "@fitness_guru_mike",
      campaign: "Wellness Campaign",
      amount: "$600",
      type: "upfront",
      status: "pending",
      date: "2024-01-15",
      method: "PayPal",
    },
    {
      id: 3,
      creator: "@food_blogger_sarah",
      campaign: "Food Content Series",
      amount: "$400",
      type: "completion",
      status: "scheduled",
      date: "2024-01-20",
      method: "Stripe",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "upfront":
        return "bg-purple-100 text-purple-800";
      case "milestone":
        return "bg-orange-100 text-orange-800";
      case "completion":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">
            Manage creator payments and billing
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Process Payment
        </Button>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,580</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,420</div>
            <p className="text-xs text-muted-foreground">5 payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,800</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Creators
            </CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Being paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{payment.creator}</h3>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getTypeColor(payment.type)}
                      >
                        {payment.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{payment.campaign}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{payment.method}</span>
                      <span>•</span>
                      <span>{payment.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold">{payment.amount}</div>
                  <div className="flex gap-2 mt-2">
                    {payment.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Process Now
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <CreditCard className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Stripe</h3>
              <p className="text-sm text-gray-500">
                Credit cards, bank transfers
              </p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-medium mb-1">PayPal</h3>
              <p className="text-sm text-gray-500">PayPal accounts</p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <CreditCard className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium mb-1">Bank Transfer</h3>
              <p className="text-sm text-gray-500">Direct bank transfers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
