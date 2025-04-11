
import React, { useState, useRef } from 'react';
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUserProfile, saveUserProfile, UserProfile } from "@/services/chat-service";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, UserCircle, Edit, Save, Plus } from "lucide-react";

const ProfilePage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(getUserProfile());
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleEditProfile = () => {
    setEditedProfile({...userProfile});
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    saveUserProfile(editedProfile);
    setUserProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadProfilePicture = () => {
    profilePictureInputRef.current?.click();
  };
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload this to a server and get a URL back
    // For now, we'll use a local object URL as a placeholder
    const imageUrl = URL.createObjectURL(file);
    
    setEditedProfile(prev => ({
      ...prev,
      avatarUrl: imageUrl
    }));
    
    toast({
      title: "Profile Picture Updated",
      description: "Click 'Save Changes' to apply your new profile picture.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="container max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Account</h1>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-32 h-32 border-2 border-primary/20">
                          <AvatarImage 
                            src={isEditing ? editedProfile.avatarUrl : userProfile.avatarUrl} 
                            alt={userProfile.name} 
                          />
                          <AvatarFallback className="text-3xl">
                            {userProfile.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        {isEditing && (
                          <Button 
                            size="icon"
                            variant="outline" 
                            className="absolute bottom-0 right-0 rounded-full" 
                            onClick={handleUploadProfilePicture}
                          >
                            <Camera size={18} />
                            <span className="sr-only">Upload new picture</span>
                          </Button>
                        )}
                        
                        <input
                          type="file"
                          ref={profilePictureInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                        />
                      </div>
                      
                      {!isEditing ? (
                        <Button onClick={handleEditProfile} className="gap-2">
                          <Edit size={16} />
                          Edit Profile
                        </Button>
                      ) : (
                        <Button onClick={handleSaveProfile} className="gap-2">
                          <Save size={16} />
                          Save Changes
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          {!isEditing ? (
                            <p className="text-lg">{userProfile.name}</p>
                          ) : (
                            <Input
                              id="name"
                              name="name"
                              value={editedProfile.name}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          {!isEditing ? (
                            <p className="text-lg">{userProfile.email}</p>
                          ) : (
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={editedProfile.email}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        {!isEditing ? (
                          <p>{userProfile.bio}</p>
                        ) : (
                          <Textarea
                            id="bio"
                            name="bio"
                            value={editedProfile.bio}
                            onChange={handleChange}
                            rows={4}
                          />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Interests</Label>
                        <div className="flex flex-wrap gap-2">
                          {(isEditing ? editedProfile.interests : userProfile.interests).map((interest, index) => (
                            <div 
                              key={index}
                              className="bg-muted px-3 py-1 rounded-full text-sm"
                            >
                              {interest}
                            </div>
                          ))}
                          
                          {isEditing && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="rounded-full"
                              onClick={() => {
                                const interest = prompt("Enter a new interest:");
                                if (interest?.trim()) {
                                  setEditedProfile(prev => ({
                                    ...prev,
                                    interests: [...prev.interests, interest.trim()]
                                  }));
                                }
                              }}
                            >
                              <Plus size={14} className="mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dashboard" className="mt-6">
              <div className="grid gap-6">
                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2 rounded-full">
                            <MessageSquare size={24} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{userProfile.chatCount || 5}</p>
                            <p className="text-sm text-muted-foreground">Active Chats</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2 rounded-full">
                            <FileText size={24} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{userProfile.journalCount || 3}</p>
                            <p className="text-sm text-muted-foreground">Journals</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2 rounded-full">
                            <GraduationCap size={24} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{userProfile.courseCount || 2}</p>
                            <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                      {/* Placeholder for recent activity */}
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 border-b pb-2">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              {i === 1 ? 
                                <MessageSquare size={16} /> : 
                                i === 2 ? <FileText size={16} /> : <GraduationCap size={16} />
                              }
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {i === 1 ? 
                                  "Started a new chat" : 
                                  i === 2 ? "Updated journal" : "Completed a course module"
                                }
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {`${i} ${i === 1 ? "hour" : "hours"} ago`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

// Import these at the top once it's been defined
import { MessageSquare, GraduationCap, FileText } from "lucide-react";

export default ProfilePage;
