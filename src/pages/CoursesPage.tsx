import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getCourses, getUserCourses, enrollInCourse, getUserProfile } from "@/services/chat-service";
import type { Course, UserCourse } from "@/services/chat-service";
import { Search, BookOpen, Clock } from "lucide-react";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Array<UserCourse & {course: Course}>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const userProfile = getUserProfile();
  
  useEffect(() => {
    loadCourses();
    loadEnrolledCourses();
  }, []);
  
  const loadCourses = () => {
    const allCourses = getCourses();
    setCourses(allCourses);
  };
  
  const loadEnrolledCourses = () => {
    const userEnrollments = getUserCourses(userProfile.id);
    const enrichedCourses = userEnrollments
      .map(enrollment => {
        const course = getCourses().find(c => c.id === enrollment.courseId);
        return course ? { ...enrollment, course } : null;
      })
      .filter(Boolean) as Array<UserCourse & {course: Course}>;
    
    setEnrolledCourses(enrichedCourses);
  };
  
  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId, userProfile.id);
    toast({
      title: "Enrolled Successfully",
      description: "You have been enrolled in this course.",
    });
    loadEnrolledCourses();
  };
  
  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(ec => ec.courseId === courseId);
  };
  
  // Get all unique domains from courses
  const domains = ['all', ...new Set(courses.map(course => course.domain))];
  
  // Filter courses based on search query and active domain
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = activeDomain === 'all' || course.domain === activeDomain;
    
    return matchesSearch && matchesDomain;
  });

  // Handle switching to browse tab
  const handleSwitchToBrowse = () => {
    const browseTab = document.querySelector('[data-state="inactive"][value="browse"]') as HTMLElement;
    if (browseTab) {
      browseTab.click();
    }
  };

  const handleContinueLearning = (course: Course) => {
    setSelectedCourse(course);

    // Dynamically set video IDs based on the selected course
    const courseVideoMap: Record<string, string[]> = {


      "AI": ["MqffbpjhriQ"],
      "Data Science": ["ua-CiDNNj30"],
      "Cyber Security": ["8S69EkL39zc"],
      "Machine Learning": ["LvC68w9JS4Y"], // Already in the UI
      "Data Analyst": ["ZMMxaMOuMfY"],
      "Web Development": ["R6RX2Zx96fE"],
    };

    setVideoIds(courseVideoMap[course.id] || []); // Default to an empty array if no videos are found
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Courses</h1>

          {selectedCourse ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">{selectedCourse.title} - Learning Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-0 gap-6">
                {videoIds.map((videoId, index) => (
                  <div key={index} className="aspect-video w-full overflow-hidden">
                    <iframe
                      width="1000"  // Increased width
                      height="600"  // Increased height
                      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                      title={`YouTube video player ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
              <Button className="mt-6" onClick={() => setSelectedCourse(null)}>
                Back to My Courses
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid grid-cols-2 md:w-[400px]">
                <TabsTrigger value="browse">Browse Courses</TabsTrigger>
                <TabsTrigger value="my-courses">My Courses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="mt-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {domains.map((domain) => (
                      <Button
                        key={domain}
                        variant={activeDomain === domain ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveDomain(domain)}
                      >
                        {domain.charAt(0).toUpperCase() + domain.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <Card key={course.id} className="overflow-hidden flex flex-col">
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={course.imageUrl} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{course.title}</CardTitle>
                              <CardDescription className="mt-1">{course.domain}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <BookOpen className="mr-1 h-4 w-4" />
                              <span>{course.modules.length} modules</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{course.duration} mins</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="mt-auto">
                          {isEnrolled(course.id) ? (
                            <Button className="w-full" variant="secondary">
                              Already Enrolled
                            </Button>
                          ) : (
                            <Button 
                              className="w-full" 
                              onClick={() => handleEnroll(course.id)}
                            >
                              Enroll Now
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No courses found matching your criteria.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="my-courses" className="mt-6">
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-6">
                    {enrolledCourses.map(({ course, progress }) => (
                      <Card key={course.id} className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] h-full">
                          <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                            <img 
                              src={course.imageUrl} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{course.domain}</p>
                            <p className="text-sm mt-4">{course.description}</p>
                            
                            <div className="mt-6">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                            
                            <div className="flex gap-4 mt-6">
                              <Button className="flex-1" onClick={() => handleContinueLearning(course)}>
                                Continue Learning
                              </Button>
                              <Button variant="outline" className="flex-1">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <h3 className="text-lg font-medium mb-2">You haven't enrolled in any courses yet</h3>
                    <p className="text-muted-foreground mb-6">Explore our catalog and start your learning journey</p>
                    <Button onClick={handleSwitchToBrowse}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;