import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JobSeekerDashboardComponent } from './components/job-seeker-dashboard/job-seeker-dashboard.component';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SecurityManagementComponent } from './components/security-management/security-management.component';
import { AIAccuracyComponent } from './components/ai-accuracy/ai-accuracy.component';
import { SystemPerformanceComponent } from './components/system-performance/system-performance.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';

export const routes: Routes = [
    {
    path:'',
    component: LandingPageComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path:'onboarding',
        component: OnboardingComponent
    },
    {
        path:'jobSeeker',
        component: JobSeekerDashboardComponent
    },
    {
        path: 'recruiter',
        component:RecruiterDashboardComponent
    },
    {
        path: 'users',
        component: AdminDashboardComponent
    },
    {
        path:'security',
        component: SecurityManagementComponent
    },
    {
        path:'ai-accuracy',
        component: AIAccuracyComponent
    },
    {
        path: 'systemPerformance',
        component: SystemPerformanceComponent
    }

];
