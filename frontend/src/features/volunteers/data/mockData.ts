export interface Volunteer {
  id: string;
  name: string;
  role: 'Volunteer' | 'Field Officer' | 'Manager';
  skills: string[];
  status: 'Available' | 'Busy' | 'Offline';
  location: string;
  latitude: number;
  longitude: number;
  tasksAssigned: number;
  tasksCompleted: number;
  rating: number;
  avatar?: string;
  contact: string;
  address: string;
  availability: {
    days: string[];
    hours: string;
  };
  performanceMetrics: {
    successRate: number;
    avgResponseTime: string;
  };
  activityHistory: {
    taskName: string;
    outcome: string;
    date: string;
  }[];
  certifications: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
  location: string;
  latitude: number;
  longitude: number;
  requiredSkills: string[];
  assignedTo?: string;
  dueDate: string;
}

export const mockVolunteers: Volunteer[] = [
  {
    id: 'V001',
    name: 'Sarah Johnson',
    role: 'Field Officer',
    skills: ['Medical', 'Emergency Response'],
    status: 'Available',
    location: 'North District',
    latitude: 40.7589,
    longitude: -73.9851,
    tasksAssigned: 12,
    tasksCompleted: 145,
    rating: 4.8,
    contact: '+1 234-567-8901',
    address: '123 Main St, North District',
    availability: {
      days: ['Mon', 'Wed', 'Fri'],
      hours: '9:00 AM - 5:00 PM'
    },
    performanceMetrics: {
      successRate: 96,
      avgResponseTime: '15 mins'
    },
    activityHistory: [
      { taskName: 'Medical Camp Setup', outcome: 'Completed', date: '2026-04-20' },
      { taskName: 'Emergency Relief Distribution', outcome: 'Completed', date: '2026-04-18' }
    ],
    certifications: ['First Aid', 'Emergency Response']
  },
  {
    id: 'V002',
    name: 'Michael Chen',
    role: 'Volunteer',
    skills: ['Logistics', 'Teaching'],
    status: 'Busy',
    location: 'East District',
    latitude: 40.7489,
    longitude: -73.9681,
    tasksAssigned: 8,
    tasksCompleted: 89,
    rating: 4.6,
    contact: '+1 234-567-8902',
    address: '456 Oak Ave, East District',
    availability: {
      days: ['Tue', 'Thu', 'Sat'],
      hours: '10:00 AM - 6:00 PM'
    },
    performanceMetrics: {
      successRate: 92,
      avgResponseTime: '22 mins'
    },
    activityHistory: [
      { taskName: 'Food Distribution', outcome: 'Completed', date: '2026-04-22' },
      { taskName: 'Education Workshop', outcome: 'In Progress', date: '2026-04-25' }
    ],
    certifications: ['Teaching Certificate']
  },
  {
    id: 'V003',
    name: 'Emily Rodriguez',
    role: 'Manager',
    skills: ['Medical', 'Logistics', 'Emergency Response'],
    status: 'Available',
    location: 'Central District',
    latitude: 40.7589,
    longitude: -73.9751,
    tasksAssigned: 15,
    tasksCompleted: 203,
    rating: 4.9,
    contact: '+1 234-567-8903',
    address: '789 Pine Rd, Central District',
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      hours: '8:00 AM - 7:00 PM'
    },
    performanceMetrics: {
      successRate: 98,
      avgResponseTime: '10 mins'
    },
    activityHistory: [
      { taskName: 'Crisis Management', outcome: 'Completed', date: '2026-04-24' },
      { taskName: 'Team Coordination', outcome: 'Completed', date: '2026-04-23' }
    ],
    certifications: ['Medical License', 'Emergency Response', 'Management']
  },
  {
    id: 'V004',
    name: 'David Kim',
    role: 'Volunteer',
    skills: ['Teaching', 'Emergency Response'],
    status: 'Available',
    location: 'West District',
    latitude: 40.7389,
    longitude: -73.9951,
    tasksAssigned: 5,
    tasksCompleted: 67,
    rating: 4.5,
    contact: '+1 234-567-8904',
    address: '321 Elm St, West District',
    availability: {
      days: ['Wed', 'Sat', 'Sun'],
      hours: '1:00 PM - 8:00 PM'
    },
    performanceMetrics: {
      successRate: 90,
      avgResponseTime: '28 mins'
    },
    activityHistory: [
      { taskName: 'Youth Workshop', outcome: 'Completed', date: '2026-04-21' }
    ],
    certifications: ['Teaching Certificate']
  },
  {
    id: 'V005',
    name: 'Jessica Taylor',
    role: 'Volunteer',
    skills: ['Medical', 'Logistics'],
    status: 'Offline',
    location: 'South District',
    latitude: 40.7289,
    longitude: -73.9851,
    tasksAssigned: 0,
    tasksCompleted: 34,
    rating: 4.3,
    contact: '+1 234-567-8905',
    address: '654 Maple Dr, South District',
    availability: {
      days: ['Mon', 'Fri'],
      hours: '9:00 AM - 3:00 PM'
    },
    performanceMetrics: {
      successRate: 88,
      avgResponseTime: '35 mins'
    },
    activityHistory: [
      { taskName: 'Medical Screening', outcome: 'Completed', date: '2026-04-10' }
    ],
    certifications: ['First Aid']
  },
  {
    id: 'V006',
    name: 'Ryan Patel',
    role: 'Field Officer',
    skills: ['Logistics', 'Emergency Response'],
    status: 'Busy',
    location: 'North District',
    latitude: 40.7689,
    longitude: -73.9781,
    tasksAssigned: 10,
    tasksCompleted: 128,
    rating: 4.7,
    contact: '+1 234-567-8906',
    address: '987 Birch Ln, North District',
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu'],
      hours: '7:00 AM - 4:00 PM'
    },
    performanceMetrics: {
      successRate: 94,
      avgResponseTime: '18 mins'
    },
    activityHistory: [
      { taskName: 'Supply Chain Management', outcome: 'In Progress', date: '2026-04-26' }
    ],
    certifications: ['Logistics', 'Emergency Response']
  },
  {
    id: 'V007',
    name: 'Amanda White',
    role: 'Volunteer',
    skills: ['Teaching'],
    status: 'Available',
    location: 'East District',
    latitude: 40.7489,
    longitude: -73.9581,
    tasksAssigned: 3,
    tasksCompleted: 45,
    rating: 4.4,
    contact: '+1 234-567-8907',
    address: '147 Cedar Ave, East District',
    availability: {
      days: ['Sat', 'Sun'],
      hours: '10:00 AM - 5:00 PM'
    },
    performanceMetrics: {
      successRate: 89,
      avgResponseTime: '32 mins'
    },
    activityHistory: [
      { taskName: 'Adult Literacy Program', outcome: 'Completed', date: '2026-04-19' }
    ],
    certifications: []
  },
  {
    id: 'V008',
    name: 'Chris Martinez',
    role: 'Volunteer',
    skills: ['Medical'],
    status: 'Available',
    location: 'Central District',
    latitude: 40.7489,
    longitude: -73.9751,
    tasksAssigned: 6,
    tasksCompleted: 78,
    rating: 4.6,
    contact: '+1 234-567-8908',
    address: '258 Spruce Ct, Central District',
    availability: {
      days: ['Mon', 'Wed', 'Fri', 'Sat'],
      hours: '8:00 AM - 2:00 PM'
    },
    performanceMetrics: {
      successRate: 93,
      avgResponseTime: '20 mins'
    },
    activityHistory: [
      { taskName: 'Health Checkup Drive', outcome: 'Completed', date: '2026-04-24' }
    ],
    certifications: ['First Aid', 'CPR']
  }
];

export const mockTasks: Task[] = [
  {
    id: 'T001',
    title: 'Medical Camp Setup',
    description: 'Set up medical camp for community health screening',
    priority: 'High',
    status: 'Pending',
    location: 'North District',
    latitude: 40.7589,
    longitude: -73.9851,
    requiredSkills: ['Medical', 'Logistics'],
    dueDate: '2026-04-28'
  },
  {
    id: 'T002',
    title: 'Food Distribution',
    description: 'Distribute food packages to affected families',
    priority: 'High',
    status: 'Assigned',
    location: 'East District',
    latitude: 40.7489,
    longitude: -73.9681,
    requiredSkills: ['Logistics'],
    assignedTo: 'V002',
    dueDate: '2026-04-27'
  },
  {
    id: 'T003',
    title: 'Education Workshop',
    description: 'Conduct educational workshop for children',
    priority: 'Medium',
    status: 'In Progress',
    location: 'Central District',
    latitude: 40.7589,
    longitude: -73.9751,
    requiredSkills: ['Teaching'],
    assignedTo: 'V002',
    dueDate: '2026-04-26'
  },
  {
    id: 'T004',
    title: 'Emergency Response Drill',
    description: 'Train volunteers on emergency response protocols',
    priority: 'Medium',
    status: 'Pending',
    location: 'West District',
    latitude: 40.7389,
    longitude: -73.9951,
    requiredSkills: ['Emergency Response'],
    dueDate: '2026-04-29'
  }
];

export const performanceData = [
  { name: 'Sarah J.', tasks: 145 },
  { name: 'Emily R.', tasks: 203 },
  { name: 'Ryan P.', tasks: 128 },
  { name: 'Michael C.', tasks: 89 },
  { name: 'Chris M.', tasks: 78 },
  { name: 'David K.', tasks: 67 },
];
