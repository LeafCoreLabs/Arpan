// ─── Types ─────────────────────────────────────────────────
export type SeverityType = 'critical' | 'high' | 'medium' | 'resolved';
export type VolunteerStatus = 'available' | 'busy' | 'offline';
export type TaskStatus = 'completed' | 'in-progress' | 'delayed';
export type NeedStatus = 'unassigned' | 'assigned' | 'in-progress' | 'resolved';
export type IssueType = 'food' | 'water' | 'medical' | 'shelter' | 'education' | 'sanitation' | 'security';

export interface CommunityNeed {
  id: string;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  severity: SeverityType;
  peopleAffected: number;
  timeReported: string;
  status: NeedStatus;
  issueType: IssueType;
  assignedVolunteerId?: string;
  priority: number; // 1-5
}

export interface Volunteer {
  id: string;
  name: string;
  initials: string;
  lat: number;
  lng: number;
  status: VolunteerStatus;
  skills: string[];
  assignedTaskIds: string[];
  completedTasks: number;
  rating: number;
  phone: string;
  joinedDate: string;
  region: string;
  responseTime: string;
}

export interface Task {
  id: string;
  title: string;
  needId: string;
  volunteerId: string;
  status: TaskStatus;
  startTime: string;
  estimatedCompletion: string;
  notes: string;
  progress: number; // 0-100
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  location: string;
  time: string;
  needId?: string;
}

export interface AISuggestion {
  id: string;
  type: 'assignment' | 'prediction' | 'cluster' | 'underserved';
  message: string;
  confidence: number;
  action: string;
  needId?: string;
  volunteerId?: string;
}

// ─── Community Needs Data ───────────────────────────────────
export const communityNeeds: CommunityNeed[] = [
  {
    id: 'n1', title: 'Emergency Food Shortage',
    description: 'Severe food shortage affecting families in Kibera North. Multiple households with children under 5 at critical malnutrition risk. Emergency food parcels and nutritional supplements needed urgently.',
    location: 'Kibera, Nairobi', lat: -1.3136, lng: 36.7888,
    severity: 'critical', peopleAffected: 342, timeReported: '2 hrs ago',
    status: 'unassigned', issueType: 'food', priority: 5,
  },
  {
    id: 'n2', title: 'Contaminated Water Supply',
    description: 'Primary water source contaminated following recent flooding. Residents forced to use unsafe borehole water. E. coli detected in recent tests.',
    location: 'Mathare, Nairobi', lat: -1.2613, lng: 36.8614,
    severity: 'critical', peopleAffected: 580, timeReported: '4 hrs ago',
    status: 'assigned', issueType: 'water', priority: 5, assignedVolunteerId: 'v1',
  },
  {
    id: 'n3', title: 'Cholera Outbreak - Medical Response',
    description: 'Suspected cholera outbreak reported with 14 confirmed cases. Emergency medical response with ORS and IV fluids needed. Local clinic overwhelmed.',
    location: 'Huruma, Nairobi', lat: -1.2658, lng: 36.8461,
    severity: 'critical', peopleAffected: 210, timeReported: '6 hrs ago',
    status: 'in-progress', issueType: 'medical', priority: 5, assignedVolunteerId: 'v3',
  },
  {
    id: 'n4', title: 'School Collapse - Shelter Needed',
    description: 'School building partially collapsed due to heavy rains. 450 students and 18 teachers displaced. Temporary structures needed immediately.',
    location: 'Dagoretti, Nairobi', lat: -1.3024, lng: 36.7524,
    severity: 'high', peopleAffected: 450, timeReported: '8 hrs ago',
    status: 'assigned', issueType: 'shelter', priority: 4, assignedVolunteerId: 'v2',
  },
  {
    id: 'n5', title: 'Sewage Overflow Crisis',
    description: 'Blocked sewage lines causing overflow into residential areas. Flooding of 3 streets. Immediate health risk with 3 confirmed infections.',
    location: 'Embakasi, Nairobi', lat: -1.3232, lng: 36.8974,
    severity: 'high', peopleAffected: 320, timeReported: '10 hrs ago',
    status: 'unassigned', issueType: 'sanitation', priority: 4,
  },
  {
    id: 'n6', title: 'Education Materials Shortage',
    description: 'Primary school lacking textbooks and learning materials. Over 220 students affected. National exams approaching in 6 weeks.',
    location: 'Kasarani, Nairobi', lat: -1.2208, lng: 36.8977,
    severity: 'medium', peopleAffected: 220, timeReported: '1 day ago',
    status: 'unassigned', issueType: 'education', priority: 3,
  },
  {
    id: 'n7', title: 'Displaced Families - Food Aid',
    description: 'Families affected by recent evictions camping in the open. Urgent need for food parcels, blankets, and basic hygiene kits.',
    location: 'Langata, Nairobi', lat: -1.3501, lng: 36.7481,
    severity: 'high', peopleAffected: 180, timeReported: '12 hrs ago',
    status: 'in-progress', issueType: 'food', priority: 4, assignedVolunteerId: 'v4',
  },
  {
    id: 'n8', title: 'Community Security Alert',
    description: 'Increased insecurity and theft in the area. Community protection measures and police liaison needed. Three incidents in past 48 hours.',
    location: 'Industrial Area, Nairobi', lat: -1.3042, lng: 36.8392,
    severity: 'medium', peopleAffected: 500, timeReported: '2 days ago',
    status: 'assigned', issueType: 'security', priority: 3, assignedVolunteerId: 'v5',
  },
  {
    id: 'n9', title: 'Flood Relief - Temporary Housing',
    description: 'Families displaced by flooding in low-lying areas. 25 households need temporary shelter and emergency supplies.',
    location: 'Ruiru, Nairobi', lat: -1.1476, lng: 36.9607,
    severity: 'medium', peopleAffected: 95, timeReported: '3 days ago',
    status: 'in-progress', issueType: 'shelter', priority: 3, assignedVolunteerId: 'v6',
  },
  {
    id: 'n10', title: 'Healthcare Supplies Depleted',
    description: 'Community clinic running critically low on essential medicines, dressings, and diagnostic supplies. Serving over 1,200 patients weekly.',
    location: 'Westlands, Nairobi', lat: -1.2657, lng: 36.8013,
    severity: 'high', peopleAffected: 1200, timeReported: '5 hrs ago',
    status: 'unassigned', issueType: 'medical', priority: 4,
  },
  {
    id: 'n11', title: 'Water Borehole Restored ✓',
    description: 'Community water borehole successfully repaired and operational. Water quality tested and cleared. Ongoing monthly monitoring schedule set.',
    location: 'Githurai, Nairobi', lat: -1.1912, lng: 36.9214,
    severity: 'resolved', peopleAffected: 800, timeReported: '5 days ago',
    status: 'resolved', issueType: 'water', priority: 1,
  },
  {
    id: 'n12', title: 'Food Distribution Complete ✓',
    description: 'Monthly food distribution programme successfully completed. 300 families received essential food parcels. Follow-up distribution scheduled.',
    location: 'Karen, Nairobi', lat: -1.3183, lng: 36.7132,
    severity: 'resolved', peopleAffected: 300, timeReported: '3 days ago',
    status: 'resolved', issueType: 'food', priority: 1,
  },
  {
    id: 'n13', title: 'Child Nutrition Programme',
    description: 'Children under 5 require nutrition supplements and bi-weekly health monitoring. Underweight cases identified at last screening.',
    location: 'Parklands, Nairobi', lat: -1.2554, lng: 36.8129,
    severity: 'high', peopleAffected: 165, timeReported: '1 day ago',
    status: 'unassigned', issueType: 'medical', priority: 4,
  },
  {
    id: 'n14', title: 'Mass Eviction - Shelter Crisis',
    description: '250 families evicted from informal settlement with no prior notice. Women and children sleeping in the open. Urgent shelter and legal aid needed.',
    location: 'Eastlands, Nairobi', lat: -1.2815, lng: 36.8718,
    severity: 'critical', peopleAffected: 250, timeReported: '7 hrs ago',
    status: 'unassigned', issueType: 'shelter', priority: 5,
  },
  {
    id: 'n15', title: 'Hygiene Training Complete ✓',
    description: 'Community hygiene and sanitation training programme successfully completed with 200+ participants. Follow-up sessions scheduled quarterly.',
    location: 'CBD, Nairobi', lat: -1.2864, lng: 36.8172,
    severity: 'resolved', peopleAffected: 200, timeReported: '7 days ago',
    status: 'resolved', issueType: 'sanitation', priority: 1,
  },
];

// ─── Volunteers Data ────────────────────────────────────────
export const volunteers: Volunteer[] = [
  {
    id: 'v1', name: 'Amara Osei', initials: 'AO',
    lat: -1.2580, lng: 36.8580, status: 'busy',
    skills: ['Medical Aid', 'Water Sanitation', 'Community Health'],
    assignedTaskIds: ['t1'], completedTasks: 28, rating: 4.9,
    phone: '+254 712 345 678', joinedDate: 'Mar 2022',
    region: 'Mathare / Huruma', responseTime: '18 min avg',
  },
  {
    id: 'v2', name: 'Fatima Al-Rashid', initials: 'FA',
    lat: -1.2980, lng: 36.7580, status: 'busy',
    skills: ['Construction', 'Shelter Management', 'Logistics'],
    assignedTaskIds: ['t2'], completedTasks: 35, rating: 4.7,
    phone: '+254 723 456 789', joinedDate: 'Aug 2021',
    region: 'Dagoretti / Langata', responseTime: '22 min avg',
  },
  {
    id: 'v3', name: 'James Kariuki', initials: 'JK',
    lat: -1.2680, lng: 36.8420, status: 'busy',
    skills: ['Emergency Medical', 'First Aid', 'Cholera Response'],
    assignedTaskIds: ['t3'], completedTasks: 42, rating: 4.8,
    phone: '+254 734 567 890', joinedDate: 'Nov 2020',
    region: 'Huruma / Mathare', responseTime: '15 min avg',
  },
  {
    id: 'v4', name: 'Aisha Mwangi', initials: 'AM',
    lat: -1.3420, lng: 36.7520, status: 'busy',
    skills: ['Food Distribution', 'Community Outreach', 'Child Care'],
    assignedTaskIds: ['t4'], completedTasks: 19, rating: 4.6,
    phone: '+254 745 678 901', joinedDate: 'Jan 2023',
    region: 'Langata / Karen', responseTime: '25 min avg',
  },
  {
    id: 'v5', name: 'Daniel Ngugi', initials: 'DN',
    lat: -1.3020, lng: 36.8360, status: 'busy',
    skills: ['Security', 'Community Protection', 'Conflict Resolution'],
    assignedTaskIds: ['t5'], completedTasks: 15, rating: 4.5,
    phone: '+254 756 789 012', joinedDate: 'Apr 2023',
    region: 'Industrial / Eastlands', responseTime: '30 min avg',
  },
  {
    id: 'v6', name: 'Grace Wanjiku', initials: 'GW',
    lat: -1.1520, lng: 36.9560, status: 'busy',
    skills: ['Shelter Management', 'Social Work', 'Counseling'],
    assignedTaskIds: ['t6'], completedTasks: 31, rating: 4.9,
    phone: '+254 767 890 123', joinedDate: 'Jun 2022',
    region: 'Ruiru / Thika', responseTime: '20 min avg',
  },
  {
    id: 'v7', name: 'Samuel Otieno', initials: 'SO',
    lat: -1.2640, lng: 36.8100, status: 'available',
    skills: ['Medical Aid', 'Nutrition', 'Community Health'],
    assignedTaskIds: [], completedTasks: 22, rating: 4.7,
    phone: '+254 778 901 234', joinedDate: 'Sep 2022',
    region: 'Westlands / Parklands', responseTime: '12 min avg',
  },
  {
    id: 'v8', name: 'Priya Sharma', initials: 'PS',
    lat: -1.2950, lng: 36.8200, status: 'available',
    skills: ['Education', 'Training', 'Youth Programs'],
    assignedTaskIds: [], completedTasks: 18, rating: 4.4,
    phone: '+254 789 012 345', joinedDate: 'Feb 2023',
    region: 'CBD / Westlands', responseTime: '28 min avg',
  },
  {
    id: 'v9', name: 'Emmanuel Adeyemi', initials: 'EA',
    lat: -1.2180, lng: 36.9080, status: 'available',
    skills: ['Water Sanitation', 'Engineering', 'Infrastructure'],
    assignedTaskIds: [], completedTasks: 27, rating: 4.8,
    phone: '+254 790 123 456', joinedDate: 'Dec 2021',
    region: 'Kasarani / Githurai', responseTime: '16 min avg',
  },
  {
    id: 'v10', name: 'Lin Chen', initials: 'LC',
    lat: -1.3240, lng: 36.8060, status: 'offline',
    skills: ['Logistics', 'Supply Chain', 'Database Management'],
    assignedTaskIds: [], completedTasks: 14, rating: 4.3,
    phone: '+254 701 234 567', joinedDate: 'Jul 2023',
    region: 'South Nairobi', responseTime: '45 min avg',
  },
];

// ─── Tasks Data ─────────────────────────────────────────────
export const tasks: Task[] = [
  {
    id: 't1', title: 'Water Decontamination - Mathare',
    needId: 'n2', volunteerId: 'v1', status: 'in-progress',
    startTime: 'Today 08:00', estimatedCompletion: 'Today 16:00',
    notes: 'Water testing kits deployed. Treatment process started. 3 of 5 tap points cleared.', progress: 60,
  },
  {
    id: 't2', title: 'Emergency Shelter - Dagoretti School',
    needId: 'n4', volunteerId: 'v2', status: 'in-progress',
    startTime: 'Today 09:00', estimatedCompletion: 'Today 17:00',
    notes: 'Structural assessment complete. Temporary tents erected for 200 students.', progress: 45,
  },
  {
    id: 't3', title: 'Cholera Medical Response - Huruma',
    needId: 'n3', volunteerId: 'v3', status: 'delayed',
    startTime: 'Today 07:00', estimatedCompletion: 'Today 15:00',
    notes: 'Supply delivery delayed 2hrs. ORS and antibiotics en route. 14 patients stabilized.', progress: 30,
  },
  {
    id: 't4', title: 'Emergency Food Distribution - Langata',
    needId: 'n7', volunteerId: 'v4', status: 'in-progress',
    startTime: 'Today 10:00', estimatedCompletion: 'Today 14:00',
    notes: '120 of 180 family parcels distributed. Final batch loading.', progress: 67,
  },
  {
    id: 't5', title: 'Security Coordination - Industrial Area',
    needId: 'n8', volunteerId: 'v5', status: 'completed',
    startTime: 'Yesterday 18:00', estimatedCompletion: 'Today 06:00',
    notes: 'Night patrol completed successfully. Police liaison established. Community wardens trained.', progress: 100,
  },
  {
    id: 't6', title: 'Flood Relief Housing - Ruiru',
    needId: 'n9', volunteerId: 'v6', status: 'in-progress',
    startTime: 'Today 06:00', estimatedCompletion: 'Tomorrow 12:00',
    notes: 'Temporary shelter erected for 15 of 25 families. Building materials for remainder expected tonight.', progress: 55,
  },
  {
    id: 't7', title: 'Borehole Repair - Githurai',
    needId: 'n11', volunteerId: 'v9', status: 'completed',
    startTime: '3 days ago', estimatedCompletion: '3 days ago',
    notes: 'Pump motor replaced. Water quality tested and approved. Community trained on maintenance.', progress: 100,
  },
  {
    id: 't8', title: 'Monthly Food Distribution - Karen',
    needId: 'n12', volunteerId: 'v7', status: 'completed',
    startTime: '2 days ago', estimatedCompletion: '2 days ago',
    notes: '300 food parcels successfully distributed. Next scheduled for 30 days.', progress: 100,
  },
];

// ─── Alerts Data ────────────────────────────────────────────
export const alerts: Alert[] = [
  {
    id: 'a1', type: 'critical',
    message: 'Critical need unattended — no volunteer within 5km',
    location: 'Kibera, Nairobi', time: '2 min ago', needId: 'n1',
  },
  {
    id: 'a2', type: 'critical',
    message: 'Mass eviction (250 families) — no response assigned',
    location: 'Eastlands, Nairobi', time: '7 min ago', needId: 'n14',
  },
  {
    id: 'a3', type: 'warning',
    message: 'Task delayed — Medical response in Huruma past ETA',
    location: 'Huruma, Nairobi', time: '15 min ago', needId: 'n3',
  },
  {
    id: 'a4', type: 'info',
    message: 'New critical need reported: Healthcare supplies depleted',
    location: 'Westlands, Nairobi', time: '5 hrs ago', needId: 'n10',
  },
];

// ─── AI Suggestions ─────────────────────────────────────────
export const aiSuggestions: AISuggestion[] = [
  {
    id: 'ai1', type: 'assignment',
    message: 'Samuel Otieno (3.2km away, Medical Aid skills) is optimal for Kibera food crisis',
    confidence: 94, action: 'Auto-assign Samuel',
    needId: 'n1', volunteerId: 'v7',
  },
  {
    id: 'ai2', type: 'prediction',
    message: 'Kibera predicted to face escalating food demand in next 36–48 hours based on 90-day pattern',
    confidence: 78, action: 'Pre-position resources',
  },
  {
    id: 'ai3', type: 'underserved',
    message: '5 critical needs in South Nairobi quadrant — only 1 available volunteer nearby',
    confidence: 91, action: 'Reallocate volunteers',
  },
  {
    id: 'ai4', type: 'cluster',
    message: 'Mathare & Huruma cluster suggests need for a dedicated regional response team',
    confidence: 87, action: 'Create response team',
  },
];
