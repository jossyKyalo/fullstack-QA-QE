import { Routes } from '@angular/router';
import { ControlFlowComponent } from './control-flow/control-flow.component';
import { DataBindingComponent } from './data-binding/data-binding.component';
import { NgClassComponent } from './ng-class/ng-class.component';
import { NgStyleComponent } from './ng-style/ng-style.component';
import { SignalComponent } from './signal/signal.component';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { TemplateFormComponent } from './template-form/template-form.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';

export const routes: Routes = [
    //default route
    {
        path:'',
        redirectTo:'dataBinding',
        pathMatch:'full'
    },
    {
        path:'dataBinding',
        component: DataBindingComponent
    },
    {
        path:'ng-class',
        component:  NgClassComponent
    },
    {
        path: 'ng-style',
        component: NgStyleComponent
    },
    {
        path: 'control-flow',
        component: ControlFlowComponent
    },
    {
        path:'signal',
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
        path:'reactive-forms',
        component: ReactiveFormComponent
    }

];
