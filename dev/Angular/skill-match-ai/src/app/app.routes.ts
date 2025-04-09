import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JobSeekerDashboardComponent } from './job-seeker-dashboard/job-seeker-dashboard.component';
import { RecruiterDashboardComponent } from './recruiter-dashboard/recruiter-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SecurityManagementComponent } from './security-management/security-management.component';
import { AIAccuracyComponent } from './ai-accuracy/ai-accuracy.component';
import { SystemPerformanceComponent } from './system-performance/system-performance.component';

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
        path:'jobSeeker',
        component: JobSeekerDashboardComponent
    },
    {
        path: 'recruiter',
        component:RecruiterDashboardComponent
    },
    {
        path: 'admin',
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
