export interface WebinarRegistration {
  fullName: string;
  email: string;
  phone: string;
  careerStage: 'graduate' | 'entry-level' | 'mid-career' | 'career-changer';
  targetIndustry: string;
  biggestObstacle: string;
  registeredAt: string;
}

export interface MasterclassModule {
  id: string;
  number: string;
  title: string;
  duration: string;
  lessonsCount: number;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  previousRole: string;
  avatar: string;
  rating: number;
  quote: string;
  tag: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary?: string;
  status: 'wishlist' | 'applied' | 'screening' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: string;
  followUpDate: string;
  notes: string;
  link?: string;
}
