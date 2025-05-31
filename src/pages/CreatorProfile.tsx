
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MessageCircle, ExternalLink, Mail } from "lucide-react";

const CreatorProfile = () => {
  const { id } = useParams();

  // TODO: Fetch creator data based on ID
  const creator = {
    id: 1,
    username: "@fashionista_jane",
    displayName: "Jane Fashion", 
    bio: "Fashion enthusiast sharing daily outfit inspiration ✨ Sustainable fashion advocate 🌱 NYC based 📍",
    followers: "125K",
    following: "892",
    posts: "1,234",
    engagement: "4.2%",
    niche: ["Fashion", "Lifestyle", "Sustainability"],
    avatar: "/placeholder.svg",
    verified: true,
    email: "jane@example.com",
    location: "New York, NY",
    avgLikes: "5.2K",
    avgComments: "234",
    recentPosts: [
      { id: 1, image: "/placeholder.svg", likes: "6.2K", comments: "89" },
      { id: 2, image: "/placeholder.svg", likes: "4.8K", comments: "156" },
      { id: 3, image: "/placeholder.svg", likes: "5.9K", comments: "201" },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <img 
              src={creator.avatar} 
              alt={creator.displayName}
              className="w-32 h-32 rounded-full bg-gray-200 mx-auto lg:mx-0"
            />
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <h1 className="text-3xl font-bold">{creator.displayName}</h1>
                {creator.verified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-2">{creator.username}</p>
              <p className="text-gray-700 mb-4">{creator.bio}</p>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                {creator.niche.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              <div className="flex gap-6 justify-center lg:justify-start text-center">
                <div>
                  <div className="font-bold text-lg">{creator.posts}</div>
                  <div className="text-gray-500 text-sm">Posts</div>
                </div>
                <div>
                  <div className="font-bold text-lg">{creator.followers}</div>
                  <div className="text-gray-500 text-sm">Followers</div>
                </div>
                <div>
                  <div className="font-bold text-lg">{creator.following}</div>
                  <div className="text-gray-500 text-sm">Following</div>
                </div>
                <div>
                  <div className="font-bold text-lg">{creator.engagement}</div>
                  <div className="text-gray-500 text-sm">Engagement</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                Send AI Outreach
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Instagram
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audience Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Female</span>
                <span className="text-sm">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Age 25-34</span>
                <span className="text-sm">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">US Based</span>
                <span className="text-sm">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">Avg Likes</span>
              </div>
              <span className="font-medium">{creator.avgLikes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Avg Comments</span>
              </div>
              <span className="font-medium">{creator.avgComments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Engagement Rate</span>
              </div>
              <span className="font-medium">{creator.engagement}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="font-medium">{creator.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Location</span>
              <p className="font-medium">{creator.location}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Response Rate</span>
              <p className="font-medium">85%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {creator.recentPosts.map((post) => (
              <div key={post.id} className="aspect-square relative group cursor-pointer">
                <img 
                  src={post.image} 
                  alt="Post"
                  className="w-full h-full object-cover rounded-lg bg-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 text-white text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <Heart className="w-3 h-3" />
                      <span className="text-xs">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-xs">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorProfile;
