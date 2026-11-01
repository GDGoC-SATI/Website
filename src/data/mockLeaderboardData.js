/**
 * Google Cloud Study Jams 2026 - Participant Leaderboard Dataset
 * 
 * Each participant has:
 * - id: unique participant id
 * - name: Full Name
 * - avatar: Profile avatar image URL (displayed right in front of the name)
 * - profileUrl: Google Cloud Skills Boost Public Profile URL
 * - department: Branch/Department (e.g., Computer Science, IT, AI & Data Science)
 * - year: Academic Year
 * - completedBadges: Array of completed badge names/templates strictly checked against the 10-course syllabus
 * - lastActive: timestamp of latest completed lab
 */

export const INITIAL_LEADERBOARD_PARTICIPANTS = [
  {
    id: 'p-1',
    name: 'Aarav Sharma',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav&backgroundColor=b6e3f4,c0aede,d1d4f9',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/847291a1-9481-4b2a-8c9d-1a2b3c4d5e6f',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Analyze Images with the Cloud Vision API',
      'Build a Website on Google Cloud',
      'Create Your First Gemini Enterprise Application',
      'Store, Process, and Manage Data on Google Cloud - Console',
      'Using the Google Cloud Speech API',
      'Explore Generative AI in Agent Platform',
    ],
    lastActive: '2026-10-31T18:30:00Z',
  },
  {
    id: 'p-2',
    name: 'Priya Verma',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya&backgroundColor=ffd5dc,ffdfbf,d1d4f9',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/593821b2-1049-4f3a-9b8c-2b3c4d5e6f7a',
    department: 'Artificial Intelligence & Data Science',
    year: '3rd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Analyze Images with the Cloud Vision API',
      'Build a Website on Google Cloud',
      'Create Your First Gemini Enterprise Application',
      'Store, Process, and Manage Data on Google Cloud - Console',
      'Using the Google Cloud Speech API',
      'Explore Generative AI in Agent Platform',
    ],
    lastActive: '2026-11-01T09:15:00Z',
  },
  {
    id: 'p-3',
    name: 'Rohan Gupta',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rohan&backgroundColor=c0aede,d1d4f9,b6e3f4',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/482910c3-2940-4e2b-8a7d-3c4d5e6f7a8b',
    department: 'Information Technology',
    year: '2nd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Analyze Images with the Cloud Vision API',
      'Build a Website on Google Cloud',
      'Create Your First Gemini Enterprise Application',
      'Store, Process, and Manage Data on Google Cloud - Console',
      'Using the Google Cloud Speech API',
    ],
    lastActive: '2026-10-30T14:20:00Z',
  },
  {
    id: 'p-4',
    name: 'Ananya Mishra',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ananya&backgroundColor=ffd5dc,c0aede,b6e3f4',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/194820d4-3829-4d1c-9b6e-4d5e6f7a8b9c',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Analyze Images with the Cloud Vision API',
      'Build a Website on Google Cloud',
      'Create Your First Gemini Enterprise Application',
      'Store, Process, and Manage Data on Google Cloud - Console',
    ],
    lastActive: '2026-10-29T16:45:00Z',
  },
  {
    id: 'p-5',
    name: 'Devansh Saxena',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Devansh&backgroundColor=b6e3f4,ffdfbf,d1d4f9',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/671049e5-4718-4c0d-8a5f-5e6f7a8b9c0d',
    department: 'Electronics & Communication',
    year: '3rd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Analyze Images with the Cloud Vision API',
      'Build a Website on Google Cloud',
      'Create Your First Gemini Enterprise Application',
    ],
    lastActive: '2026-10-28T11:10:00Z',
  },
  {
    id: 'p-6',
    name: 'Sneha Patel',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha&backgroundColor=ffd5dc,d1d4f9,c0aede',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/839201f6-5829-4b9e-9c4a-6f7a8b9c0d1e',
    department: 'Information Technology',
    year: '2nd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Analyze Images with the Cloud Vision API',
      'Build a Website on Google Cloud',
    ],
    lastActive: '2026-10-27T19:00:00Z',
  },
  {
    id: 'p-7',
    name: 'Aditya Singh',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aditya&backgroundColor=b6e3f4,c0aede,ffd5dc',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/301948a7-6930-4a8f-8d3b-7a8b9c0d1e2f',
    department: 'Artificial Intelligence & Data Science',
    year: '2nd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Create Your First Gemini Enterprise Application',
    ],
    lastActive: '2026-10-26T15:30:00Z',
  },
  {
    id: 'p-8',
    name: 'Ishita Jain',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ishita&backgroundColor=ffd5dc,ffdfbf,b6e3f4',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/920381b8-7041-497a-9e2c-8b9c0d1e2f3a',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Develop AI-Powered Prototypes in Google AI Studio',
      'Create Your First Gemini Enterprise Application',
    ],
    lastActive: '2026-10-25T17:15:00Z',
  },
  {
    id: 'p-9',
    name: 'Yashwardhan Joshi',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Yash&backgroundColor=c0aede,d1d4f9,ffdfbf',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/419283c9-8152-486b-8f1d-9c0d1e2f3a4b',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
      'Implement Speech and Language Solutions with Pre-trained APIs',
    ],
    lastActive: '2026-10-24T12:00:00Z',
  },
  {
    id: 'p-10',
    name: 'Kavya Sen',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kavya&backgroundColor=ffd5dc,b6e3f4,c0aede',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/582039d0-9263-475c-9a0e-0d1e2f3a4b5c',
    department: 'Information Technology',
    year: '2nd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Develop AI-Powered Prototypes in Google AI Studio',
    ],
    lastActive: '2026-10-23T14:40:00Z',
  },
  {
    id: 'p-11',
    name: 'Manish Chouhan',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Manish&backgroundColor=b6e3f4,ffd5dc,d1d4f9',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/740192e1-0374-464d-8b9f-1e2f3a4b5c6d',
    department: 'Civil Engineering',
    year: '2nd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
    ],
    lastActive: '2026-10-22T10:20:00Z',
  },
  {
    id: 'p-12',
    name: 'Ritu Rajawat',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ritu&backgroundColor=ffd5dc,ffdfbf,c0aede',
    profileUrl: 'https://www.cloudskillsboost.google/public_profiles/859203f2-1485-453e-9c8a-2f3a4b5c6d7e',
    department: 'Mechanical Engineering',
    year: '3rd Year',
    completedBadges: [
      'The Basics of Google Cloud Compute',
      'Configure Service Accounts and IAM Roles for Google Cloud',
    ],
    lastActive: '2026-10-21T18:05:00Z',
  },
];

const LOCAL_STORAGE_KEY = 'gdg_study_jam_leaderboard_data';

export const getSavedLeaderboardData = () => {
  if (typeof window === 'undefined') return INITIAL_LEADERBOARD_PARTICIPANTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read cached leaderboard data:', err);
  }
  return INITIAL_LEADERBOARD_PARTICIPANTS;
};

export const saveLeaderboardData = (data) => {
  if (typeof window === 'undefined' || !Array.isArray(data)) return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save leaderboard data to localStorage:', err);
  }
};
