import { ChatSpace, ChatMessage, Canvas, Journal } from "../models/chat";
import { sendMessageToBackend } from "./api"; 
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust the import based on your project structure

// Local storage keys
const SPACES_KEY = 'chat-spaces';
const CANVASES_KEY = 'canvases';
const JOURNALS_KEY = 'journals';

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);


// Load data from localStorage
const loadSpaces = (): ChatSpace[] => {
  const spacesJson = localStorage.getItem(SPACES_KEY);
  if (!spacesJson) return [];
  
  try {
    const spaces = JSON.parse(spacesJson);
    // Convert string dates back to Date objects
    return spaces.map((space: any) => ({
      ...space,
      createdAt: new Date(space.createdAt),
      updatedAt: new Date(space.updatedAt),
      messages: space.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (e) {
    console.error('Error parsing spaces from localStorage', e);
    return [];
  }
};

const loadCanvases = (): Canvas[] => {
  const canvasesJson = localStorage.getItem(CANVASES_KEY);
  if (!canvasesJson) return [];
  
  try {
    const canvases = JSON.parse(canvasesJson);
    return canvases.map((canvas: any) => ({
      ...canvas,
      createdAt: new Date(canvas.createdAt),
      updatedAt: new Date(canvas.updatedAt)
    }));
  } catch (e) {
    console.error('Error parsing canvases from localStorage', e);
    return [];
  }
};

const loadJournals = (): Journal[] => {
  const journalsJson = localStorage.getItem(JOURNALS_KEY);
  if (!journalsJson) return [];
  
  try {
    const journals = JSON.parse(journalsJson);
    return journals.map((journal: any) => ({
      id: journal.id,
      title: journal.title,
      content: journal.content || '',
      createdAt: new Date(journal.createdAt),
      updatedAt: new Date(journal.updatedAt)
    }))
    .filter((journal: Journal) => journal.title && journal.id) // Filter out invalid journals
    .sort((a: Journal, b: Journal) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Sort by latest first
  } catch (error) {
    console.error('Error loading journals:', error);
    return [];
  }
};

// Save data to localStorage
const saveSpaces = (spaces: ChatSpace[]) => {
  localStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
};

const saveCanvases = (canvases: Canvas[]) => {
  localStorage.setItem(CANVASES_KEY, JSON.stringify(canvases));
};

const saveJournals = (journals: Journal[]) => {
  try {
    const journalsToSave = journals.map(journal => ({
      ...journal,
      createdAt: journal.createdAt.toISOString(),
      updatedAt: journal.updatedAt.toISOString()
    }));
    localStorage.setItem(JOURNALS_KEY, JSON.stringify(journalsToSave));
  } catch (error) {
    console.error('Error saving journals to localStorage:', error);
    throw new Error('Failed to save journals to localStorage');
  }
};
/////////////////////////////////////////////
// Chat space operations
export const createSpace = (name: string = 'New Space'): ChatSpace => {
  const spaces = loadSpaces();
  const newSpace: ChatSpace = {
    id: generateId(),
    name,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  spaces.push(newSpace);
  saveSpaces(spaces);
  return newSpace;
};
// export async function createSpace(name: string) {
//   const docRef = await addDoc(collection(db, "spaces"), {
//     name,
//     createdAt: Date.now(),
//   });
//   return { id: docRef.id, name };
// }

export const getSpaces = (): ChatSpace[] => {
  return loadSpaces();
};
// export async function getSpaces(): Promise<{ id: string; name: string }[]> {
//   const snapshot = await getDocs(collection(db, "spaces"));
//   const spaces = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[];
//   localStorage.setItem(SPACES_KEY, JSON.stringify(spaces));
//   return spaces;
// }
// export function getCachedSpaces(): { id: string; name: string }[] {
//   const data = localStorage.getItem(SPACES_KEY);
//   return data ? JSON.parse(data) : [];
// }
// export function setSelectedSpaceId(spaceId: string) {
//   localStorage.setItem(SELECTED_SPACE_ID, spaceId);
// }

// export function getSelectedSpaceId(): string | null {
//   return localStorage.getItem(SELECTED_SPACE_ID);
// }

// /////////////////////////////////////

export const getSpace = (id: string): ChatSpace | undefined => {
  const spaces = loadSpaces();
  return spaces.find(space => space.id === id);
};

export const addMessageToSpace = (spaceId: string, content: string, isAi: boolean): ChatMessage | null => {
  const spaces = loadSpaces();
  const spaceIndex = spaces.findIndex(space => space.id === spaceId);
  
  if (spaceIndex === -1) return null;
  
  const message: ChatMessage = {
    id: generateId(),
    content,
    isAi,
    timestamp: new Date()
  };
  
  spaces[spaceIndex].messages.push(message);
  spaces[spaceIndex].updatedAt = new Date();
  
  saveSpaces(spaces);
  return message;
};

export const deleteSpace = (id: string): boolean => {
  const spaces = loadSpaces();
  const newSpaces = spaces.filter(space => space.id !== id);
  
  if (newSpaces.length === spaces.length) return false;
  
  saveSpaces(newSpaces);
  return true;
};

// Canvas operations
export const saveCanvas = (name: string, imageData: string, spaceId?: string): Canvas => {
  const canvases = loadCanvases();
  const newCanvas: Canvas = {
    id: generateId(),
    name,
    imageData,
    spaceId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  canvases.push(newCanvas);
  saveCanvases(canvases);
  return newCanvas;
};

export const getCanvases = (spaceId?: string): Canvas[] => {
  const canvases = loadCanvases();
  if (spaceId) {
    return canvases.filter(canvas => canvas.spaceId === spaceId);
  }
  return canvases;
};

export const deleteCanvas = (id: string): boolean => {
  const canvases = loadCanvases();
  const newCanvases = canvases.filter(canvas => canvas.id !== id);
  
  if (newCanvases.length === canvases.length) return false;
  
  saveCanvases(newCanvases);
  return true;
};

// Journal operations
export const saveJournal = (title: string, content: string, id?: string): Journal => {
  try {
    const journals = loadJournals() || [];
    const now = new Date();
    let savedJournal: Journal;
    
    if (id) {
      // Update existing journal
      const index = journals.findIndex(j => j.id === id);
      if (index >= 0) {
        savedJournal = {
          id,
          title: title.trim(),
          content,
          createdAt: journals[index].createdAt,
          updatedAt: now
        };
        journals[index] = savedJournal;
      } else {
        throw new Error('Journal not found');
      }
    } else {
      // Create new journal
      savedJournal = {
        id: generateId(),
        title: title.trim(),
        content: content || '',  // Ensure content is never undefined
        createdAt: now,
        updatedAt: now
      };
      journals.unshift(savedJournal);
    }
    
    try {
      const journalsToSave = journals.map(journal => ({
        ...journal,
        createdAt: journal.createdAt.toISOString(),
        updatedAt: journal.updatedAt.toISOString()
      }));
      localStorage.setItem(JOURNALS_KEY, JSON.stringify(journalsToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save journal to localStorage');
    }
    
    return savedJournal;
  } catch (error) {
    console.error('Error in saveJournal:', error);
    throw new Error(`Failed to save journal: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getJournals = (): Journal[] => {
  try {
    const journals = loadJournals();
    // Sort by updatedAt in descending order (newest first)
    return journals
      .filter(journal => journal.title && journal.id) // Ensure valid journals
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error('Error getting journals:', error);
    return [];
  }
};

export const deleteJournal = (id: string): boolean => {
  try {
    const journals = loadJournals();
    if (!journals || !Array.isArray(journals)) {
      console.error('Invalid journals data');
      return false;
    }

    const newJournals = journals.filter(journal => journal.id !== id);
    if (newJournals.length === journals.length) {
      console.error('Journal not found:', id);
      return false;
    }
    
    saveJournals(newJournals);
    return true;
  } catch (error) {
    console.error('Error deleting journal:', error);
    return false;
  }
};

export const getJournal = (id: string): Journal | undefined => {
  const journals = loadJournals();
  return journals.find(journal => journal.id === id);
};

// Simulate AI response (in a real app, this would call an API)
export const getAiResponse = async (userId: string, message: string): Promise<string> => {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        message: message,
      }),
    });

    const data = await response.json();
    return data.response; // assuming FastAPI returns: { response: "..." }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error from AI: " + (error as Error).message;
  }

///////////// this is just an example 
  // In a real application, you would replace this with an actual API call
  // to your AI backend. For example:
  // const response = await fetch("https://api.example.com/ai-response", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ message }),
  // });
  // const data = await response.json();
  // return data.response;
/////////////////////////////

  // return await sendMessageToBackend(message);
  
  // const responses = [
  //   "That's an interesting point. Let me think about it...",
  //   "I understand your question. Based on my knowledge, I believe...",
  //   "Thanks for sharing. Here's what I can tell you...",
  //   "That's a great question! The answer depends on several factors...",
  //   "I've analyzed your request and here's what I found...",
  // ];
  
  // return responses[Math.floor(Math.random() * responses.length)] + 
  //   " (This is a simulated AI response to: " + message + ")";  
};

export const handleChatInteraction = async (spaceId: string, userId: string, userMessage: string): Promise<ChatMessage[]> => {
  const userMsg = addMessageToSpace(spaceId, userMessage, false);
  const aiText = await getAiResponse(userId, userMessage);
  const aiMsg = addMessageToSpace(spaceId, aiText, true);

  return [userMsg!, aiMsg];
};
















// User profile data handling
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  interests: string[];
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  chatCount?: number;
  journalCount?: number;
  courseCount?: number;
}

const USER_PROFILE_KEY = 'user-profile';

export const getDefaultUserProfile = (): UserProfile => {
  const spaces = loadSpaces();
  const journals = loadJournals();
  const userCourses = getUserCourses('default-user');
  
  return {
    id: generateId(),
    name: 'ProxyYt',
    email: 'proxy@example.com',
    bio: 'AI enthusiast and continuous learner',
    interests: ['AI', 'Machine Learning', 'Web Development'],
    avatarUrl: 'https://avatars.githubusercontent.com/u/12345678',
    createdAt: new Date(),
    updatedAt: new Date(),
    chatCount: spaces.length,
    journalCount: journals.length,
    courseCount: userCourses.length
  };
};

export const getUserProfile = (): UserProfile => {
  const profileJson = localStorage.getItem(USER_PROFILE_KEY);
  if (!profileJson) {
    const defaultProfile = getDefaultUserProfile();
    saveUserProfile(defaultProfile);
    return defaultProfile;
  }
  
  try {
    const profile = JSON.parse(profileJson);
    const spaces = loadSpaces();
    const journals = loadJournals();
    const userCourses = getUserCourses('default-user');
    
    return {
      ...profile,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
      chatCount: spaces.length,
      journalCount: journals.length,
      courseCount: userCourses.length
    };
  } catch (e) {
    console.error('Error parsing user profile from localStorage', e);
    return getDefaultUserProfile();
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  profile.updatedAt = new Date();
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

// Task management
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TASKS_KEY = 'user-tasks';

export const getTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(TASKS_KEY);
  if (!tasksJson) return [];
  
  try {
    const tasks = JSON.parse(tasksJson);
    return tasks.map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt)
    }));
  } catch (e) {
    console.error('Error parsing tasks from localStorage', e);
    return [];
  }
};

export const saveTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const updateTask = (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): boolean => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return false;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date()
  };
  
  saveTasks(tasks);
  return true;
};

export const deleteTask = (id: string): boolean => {
  const tasks = getTasks();
  const newTasks = tasks.filter(task => task.id !== id);
  
  if (newTasks.length === tasks.length) return false;
  
  saveTasks(newTasks);
  return true;
};

const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// Course management
export interface Course {
  id: string;
  title: string;
  description: string;
  domain: string;
  imageUrl: string;
  modules: CourseModule[];
  duration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
}

export interface UserCourse {
  courseId: string;
  userId: string;
  progress: number; // percentage
  enrolledAt: Date;
  lastAccessedAt: Date;
  completedModules: string[]; // array of module ids
}

const COURSES_KEY = 'available-courses';
const USER_COURSES_KEY = 'user-courses';

// Sample courses data
const getInitialCourses = (): Course[] => [
  {
    id: generateId(),
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning algorithms and applications.',
    domain: 'Data Science',
    imageUrl: 'https://source.unsplash.com/random/300x200/?ai',
    modules: [
      {
        id: generateId(),
        title: 'What is Machine Learning?',
        description: 'Understanding the basics of ML',
        duration: 30,
        completed: false
      },
      {
        id: generateId(),
        title: 'Supervised Learning',
        description: 'Exploring classification and regression',
        duration: 45,
        completed: false
      }
    ],
    duration: 180,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: 'Web Development Fundamentals',
    description: 'Build responsive websites with HTML, CSS, and JavaScript.',
    domain: 'Web Development',
    imageUrl: 'https://source.unsplash.com/random/300x200/?code',
    modules: [
      {
        id: generateId(),
        title: 'HTML Basics',
        description: 'Learning structure of web pages',
        duration: 25,
        completed: false
      },
      {
        id: generateId(),
        title: 'CSS Styling',
        description: 'Making websites beautiful',
        duration: 35,
        completed: false
      }
    ],
    duration: 240,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: 'Mobile App Development with React Native',
    description: 'Create cross-platform mobile applications.',
    domain: 'Mobile Development',
    imageUrl: 'https://source.unsplash.com/random/300x200/?mobile',
    modules: [
      {
        id: generateId(),
        title: 'React Fundamentals',
        description: 'Understanding React concepts',
        duration: 40,
        completed: false
      },
      {
        id: generateId(),
        title: 'Native Components',
        description: 'Working with device features',
        duration: 50,
        completed: false
      }
    ],
    duration: 300,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getCourses = (): Course[] => {
  const coursesJson = localStorage.getItem(COURSES_KEY);
  if (!coursesJson) {
    const initialCourses = getInitialCourses();
    localStorage.setItem(COURSES_KEY, JSON.stringify(initialCourses));
    return initialCourses;
  }
  
  try {
    const courses = JSON.parse(coursesJson);
    return courses.map((course: any) => ({
      ...course,
      createdAt: new Date(course.createdAt),
      updatedAt: new Date(course.updatedAt)
    }));
  } catch (e) {
    console.error('Error parsing courses from localStorage', e);
    return getInitialCourses();
  }
};

export const getCourse = (id: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(course => course.id === id);
};

export const getUserCourses = (userId: string): UserCourse[] => {
  const userCoursesJson = localStorage.getItem(USER_COURSES_KEY);
  if (!userCoursesJson) return [];
  
  try {
    const userCourses = JSON.parse(userCoursesJson);
    return userCourses
      .filter((uc: any) => uc.userId === userId)
      .map((uc: any) => ({
        ...uc,
        enrolledAt: new Date(uc.enrolledAt),
        lastAccessedAt: new Date(uc.lastAccessedAt)
      }));
  } catch (e) {
    console.error('Error parsing user courses from localStorage', e);
    return [];
  }
};

export const enrollInCourse = (courseId: string, userId: string): UserCourse => {
  const userCourses = getAllUserCourses();
  
  // Check if already enrolled
  const existingEnrollment = userCourses.find(uc => 
    uc.courseId === courseId && uc.userId === userId
  );
  
  if (existingEnrollment) {
    return existingEnrollment;
  }
  
  const newUserCourse: UserCourse = {
    courseId,
    userId,
    progress: 0,
    enrolledAt: new Date(),
    lastAccessedAt: new Date(),
    completedModules: []
  };
  
  userCourses.push(newUserCourse);
  localStorage.setItem(USER_COURSES_KEY, JSON.stringify(userCourses));
  return newUserCourse;
};

export const updateCourseProgress = (
  courseId: string,
  userId: string,
  moduleId: string,
  completed: boolean
): boolean => {
  const userCourses = getAllUserCourses();
  const userCourseIndex = userCourses.findIndex(uc => 
    uc.courseId === courseId && uc.userId === userId
  );
  
  if (userCourseIndex === -1) return false;
  
  const course = getCourse(courseId);
  if (!course) return false;
  
  const userCourse = userCourses[userCourseIndex];
  
  // Update completed modules
  if (completed && !userCourse.completedModules.includes(moduleId)) {
    userCourse.completedModules.push(moduleId);
  } else if (!completed) {
    userCourse.completedModules = userCourse.completedModules.filter(id => id !== moduleId);
  }
  
  // Calculate progress percentage
  userCourse.progress = Math.round((userCourse.completedModules.length / course.modules.length) * 100);
  userCourse.lastAccessedAt = new Date();
  
  localStorage.setItem(USER_COURSES_KEY, JSON.stringify(userCourses));
  return true;
};

const getAllUserCourses = (): UserCourse[] => {
  const userCoursesJson = localStorage.getItem(USER_COURSES_KEY);
  if (!userCoursesJson) return [];
  
  try {
    const userCourses = JSON.parse(userCoursesJson);
    return userCourses.map((uc: any) => ({
      ...uc,
      enrolledAt: new Date(uc.enrolledAt),
      lastAccessedAt: new Date(uc.lastAccessedAt)
    }));
  } catch (e) {
    console.error('Error parsing all user courses from localStorage', e);
    return [];
  }
};

export type {Journal , Canvas, ChatSpace, ChatMessage};