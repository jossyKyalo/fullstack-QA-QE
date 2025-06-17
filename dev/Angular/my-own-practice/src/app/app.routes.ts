import { Routes } from '@angular/router';
import { ControlFlowComponent } from './control-flow/control-flow.component';
import { DataBindingComponent } from './data-binding/data-binding.component';
import { NgClassComponent } from './ng-class/ng-class.component';
import { NgStyleComponent } from './ng-style/ng-style.component';
import { SignalComponent } from './signal/signal.component';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { TemplateFormComponent } from './template-form/template-form.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { GetApiComponent } from './get-api/get-api.component';
import { PostApiComponent } from './post-api/post-api.component';
import { ResourceApiComponent } from './resource-api/resource-api.component';
import { CustomerComponent } from './customer/customer.component';
import { LifeCycleComponent } from './life-cycle/life-cycle.component';
import { NgForComponent } from './ng-for/ng-for.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { NgTempNgContainerComponent } from './ng-temp-ng-container/ng-temp-ng-container.component';

export const routes: Routes = [
    //default route
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent
    },
    {
        path: 'dataBinding',
        component: DataBindingComponent,
        children: [
            {
                path: 'ng-class',
                component: NgClassComponent
            },
            {
                path: 'ng-style',
                component: NgStyleComponent
            },
            {
                path: 'ng-for',
                component: NgForComponent
            },
            {
                path: 'control-flow',
                component: ControlFlowComponent
            },
            {
                path: 'signal',
                component: SignalComponent
            },
            {
                path: 'linked-signal',
                component: LinkedSignalComponent
            },
            {
                path: 'template-forms',
                component: TemplateFormComponent
            },
            {
                path: 'reactive-forms',
                component: ReactiveFormComponent
            },
            {
                path: 'get-api',
                component: GetApiComponent
            },
            {
                path: 'post-api',
                component: PostApiComponent
            },
            {
                path: 'resource-api',
                component: ResourceApiComponent
            },
            {
                path: 'customer',
                component: CustomerComponent
            },
            {
                path: 'life-cycle',
                component: LifeCycleComponent
            },
            {
                path: 'ng-temp-container',
                component: NgTempNgContainerComponent
            }

        ]
    },

];
