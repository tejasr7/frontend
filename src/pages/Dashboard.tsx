// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  MessageCircle, ClipboardCheck, Brain,
  Award, PlusCircle, Clock, Target
} from 'lucide-react';
import axios from 'axios';
import { SidebarShadcn } from '@/components/SidebarShadcn';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [progressData, setProgressData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = { full_name: "Student", user_type: "student" };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const progressResponse = await axios.get('/api/progress', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProgressData(progressResponse.data);

        const leaderboardResponse = await axios.get('/api/leaderboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLeaderboard(leaderboardResponse.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const demoProgressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Score',
        data: [65, 68, 70, 72, 75, 78, 80],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Time Spent (mins)',
        data: [45, 60, 35, 50, 55, 40, 65],
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Progress' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const demoLeaderboard = [
    { name: 'Rahul S.', elo: 1560, avatar: '👨‍🎓' },
    { name: 'Priya M.', elo: 1520, avatar: '👩‍🔬' },
    { name: 'Arjun K.', elo: 1480, avatar: '🧑‍💻' },
    { name: 'Sneha T.', elo: 1450, avatar: '👩‍🎓' },
    { name: 'Dev P.', elo: 1420, avatar: '👨‍🔬' },
  ];

  const chartData = progressData || demoProgressData;
  const topUsers = Array.isArray(leaderboard) && leaderboard.length > 0 ? leaderboard : demoLeaderboard;

  const getDaysRemaining = (examType) => {
    const examDates = {
      'JEE Main': new Date('2025-08-30'),
      'NEET': new Date('2025-07-15'),
      'UPSC': new Date('2025-06-05'),
    };

    const today = new Date();
    const examDate = examDates[examType];
    const diffTime = Math.abs(examDate - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const QuickActionButton = ({ icon, label, color, href }) => (
    <Button
      variant="outline"
      className={`flex items-center gap-2 h-14 w-full ${color}`}
      onClick={() => window.location.href = href}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarShadcn />

      {/* Main Content */}
      <div className="flex-1 p-6"> {/* Offset by sidebar width */}
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.full_name || 'Student'}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <Card className="col-span-1 md:col-span-1">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line options={chartOptions} data={chartData} />
              </div>
            </CardContent>
          </Card>
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  <span>Goal Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: 'Algebra', value: 80 },
                  { subject: 'Calculus', value: 60 },
                  { subject: 'Physics Mechanics', value: 45 },
                ].map((goal) => (
                  <div key={goal.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.subject}</span>
                      <span>{goal.value}%</span>
                    </div>
                    <Progress value={goal.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>




          

          {/* Quick Actions */}
          <Card className="col-span-1 md:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <QuickActionButton
                icon={<MessageCircle size={20} />}
                label="AI Tutor"
                color="text-blue-600 hover:text-blue-800 hover:border-blue-600"
                href="/tutor"
              />
              <QuickActionButton
                icon={<ClipboardCheck size={20} />}
                label="Take a Test"
                color="text-purple-600 hover:text-purple-800 hover:border-purple-600"
                href="/tests"
              />
              <QuickActionButton
                icon={<Brain size={20} />}
                label="Daily Practice"
                color="text-green-600 hover:text-green-800 hover:border-green-600"
                href="/practice"
              />
              <QuickActionButton
                icon={<PlusCircle size={20} />}
                label="Create Notes"
                color="text-orange-600 hover:text-orange-800 hover:border-orange-600"
                href="/notes"
              />
            </CardContent>
          </Card>

          {/* Leaderboard and Countdown */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
          {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  <span>Goal Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: 'Algebra', value: 80 },
                  { subject: 'Calculus', value: 60 },
                  { subject: 'Physics Mechanics', value: 45 },
                ].map((goal) => (
                  <div key={goal.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.subject}</span>
                      <span>{goal.value}%</span>
                    </div>
                    <Progress value={goal.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award size={20} />
                  <span>Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{user.avatar}</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <span className="font-bold">{user.elo} ELO</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {user?.user_type === 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={20} />
                    <span>Exam Countdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['JEE Main', 'NEET'].map((exam) => (
                    <div key={exam} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{exam}</span>
                        <span className={`font-bold ${exam === 'JEE Main' ? 'text-orange-600' : 'text-green-600'}`}>
                          {getDaysRemaining(exam)} days left
                        </span>
                      </div>
                      <Progress value={exam === 'JEE Main' ? 65 : 80} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Goal Tracker */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  <span>Goal Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: 'Algebra', value: 80 },
                  { subject: 'Calculus', value: 60 },
                  { subject: 'Physics Mechanics', value: 45 },
                ].map((goal) => (
                  <div key={goal.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.subject}</span>
                      <span>{goal.value}%</span>
                    </div>
                    <Progress value={goal.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



// // src/pages/Dashboard.jsx
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import {
//   MessageCircle, ClipboardCheck, Brain,
//   Award, PlusCircle, Clock, Target
// } from 'lucide-react';
// import axios from 'axios';
// import { SidebarShadcn } from '@/components/SidebarShadcn';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Dashboard = () => {
//   const [progressData, setProgressData] = useState(null);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = { full_name: "Student", user_type: "student" };

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const progressResponse = await axios.get('/api/progress', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setProgressData(progressResponse.data);

//         const leaderboardResponse = await axios.get('/api/leaderboard', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setLeaderboard(leaderboardResponse.data.slice(0, 5));
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const demoProgressData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: 'Score',
//         data: [65, 68, 70, 72, 75, 78, 80],
//         borderColor: 'rgb(99, 102, 241)',
//         backgroundColor: 'rgba(99, 102, 241, 0.5)',
//         tension: 0.3,
//       },
//       {
//         label: 'Time Spent (mins)',
//         data: [45, 60, 35, 50, 55, 40, 65],
//         borderColor: 'rgb(234, 88, 12)',
//         backgroundColor: 'rgba(234, 88, 12, 0.5)',
//         tension: 0.3,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Weekly Progress' },
//     },
//     scales: {
//       y: { beginAtZero: true },
//     },
//   };

//   const demoLeaderboard = [
//     { name: 'Rahul S.', elo: 1560, avatar: '👨‍🎓' },
//     { name: 'Priya M.', elo: 1520, avatar: '👩‍🔬' },
//     { name: 'Arjun K.', elo: 1480, avatar: '🧑‍💻' },
//     { name: 'Sneha T.', elo: 1450, avatar: '👩‍🎓' },
//     { name: 'Dev P.', elo: 1420, avatar: '👨‍🔬' },
//   ];

//   const chartData = progressData || demoProgressData;
//   const topUsers = Array.isArray(leaderboard) && leaderboard.length > 0 ? leaderboard : demoLeaderboard;

//   const getDaysRemaining = (examType) => {
//     const examDates = {
//       'JEE Main': new Date('2025-08-30'),
//       'NEET': new Date('2025-07-15'),
//       'UPSC': new Date('2025-06-05'),
//     };

//     const today = new Date();
//     const examDate = examDates[examType];
//     const diffTime = Math.abs(examDate - today);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const QuickActionButton = ({ icon, label, color, href }) => (
//     <Button
//       variant="outline"
//       className={`flex items-center gap-2 h-14 w-full ${color}`}
//       onClick={() => window.location.href = href}
//     >
//       {icon}
//       <span>{label}</span>
//     </Button>
//   );

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <SidebarShadcn />

//       {/* Main Content */}
//       <div className="flex-1 p-6 ml-64"> {/* Offset by sidebar width */}
//         <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.full_name || 'Student'}!</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Progress Chart */}
//           <Card className="col-span-1 md:col-span-1">
//             <CardHeader>
//               <CardTitle>Your Progress</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 <Line options={chartOptions} data={chartData} />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Card className="col-span-1 md:col-span-1">
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col gap-3">
//               <QuickActionButton
//                 icon={<MessageCircle size={20} />}
//                 label="AI Tutor"
//                 color="text-blue-600 hover:text-blue-800 hover:border-blue-600"
//                 href="/tutor"
//               />
//               <QuickActionButton
//                 icon={<ClipboardCheck size={20} />}
//                 label="Take a Test"
//                 color="text-purple-600 hover:text-purple-800 hover:border-purple-600"
//                 href="/tests"
//               />
//               <QuickActionButton
//                 icon={<Brain size={20} />}
//                 label="Daily Practice"
//                 color="text-green-600 hover:text-green-800 hover:border-green-600"
//                 href="/practice"
//               />
//               <QuickActionButton
//                 icon={<PlusCircle size={20} />}
//                 label="Create Notes"
//                 color="text-orange-600 hover:text-orange-800 hover:border-orange-600"
//                 href="/notes"
//               />
//             </CardContent>
//           </Card>

//           {/* Leaderboard and Countdown */}
//           <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Award size={20} />
//                   <span>Leaderboard</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {topUsers.map((user, index) => (
//                     <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
//                       <div className="flex items-center gap-2">
//                         <span className="text-xl">{user.avatar}</span>
//                         <span className="font-medium">{user.name}</span>
//                       </div>
//                       <span className="font-bold">{user.elo} ELO</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {user?.user_type === 'student' && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Clock size={20} />
//                     <span>Exam Countdown</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {['JEE Main', 'NEET'].map((exam) => (
//                     <div key={exam} className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium">{exam}</span>
//                         <span className={`font-bold ${exam === 'JEE Main' ? 'text-orange-600' : 'text-green-600'}`}>
//                           {getDaysRemaining(exam)} days left
//                         </span>
//                       </div>
//                       <Progress value={exam === 'JEE Main' ? 65 : 80} className="h-2" />
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Goal Tracker */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Target size={20} />
//                   <span>Goal Tracker</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {[
//                   { subject: 'Algebra', value: 80 },
//                   { subject: 'Calculus', value: 60 },
//                   { subject: 'Physics Mechanics', value: 45 },
//                 ].map((goal) => (
//                   <div key={goal.subject} className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium">{goal.subject}</span>
//                       <span>{goal.value}%</span>
//                     </div>
//                     <Progress value={goal.value} className="h-2" />
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
