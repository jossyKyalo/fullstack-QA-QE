
export interface User {
    user_id: number;
    email: string;
    full_name: string;
    user_type: 'job_seeker' | 'recruiter' | 'admin';
    created_at: Date;
    updated_at: Date;
    last_login: Date;
  }
  
  export interface Recruiter {
    recruiter_id: number;
    user_id: number;
    company_id: number;
    position: string;
    user?: User;
    company?: Company;
  }
  
  export interface Company {
    company_id: number;
    company_name: string;
    location: string;
    industry: string;
    description: string;
    logo?: Buffer;
  }
  
  export interface Job {
    job_id: number;
    company_id: number;
    recruiter_id: number;
    title: string;
    description: string;
    location: string;
    remote_option: boolean;
    employment_type: 'full-time' | 'contract' | 'part-time' | 'internship';
    created_at: Date;
    status: 'active' | 'filled' | 'closed';
    company?: Company;
    applicantCount?: number;
  }
  
  export interface JobSeeker {
    jobseeker_id: number;
    user_id: number;
    headline: string;
    current_company: string;
    years_experience: number;
    remote_preference: boolean;
    profile_picture?: Buffer;
    user?: User;
  }
  
  export interface Candidate extends JobSeeker {
    name: string;
    position: string;
    location: string;
    matchScore?: number;
  }
  
  export interface Metric {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
  }