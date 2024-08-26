import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CodeSnippetsComponent } from './components/code-snippets/code-snippets.component';
// import { authGuard } from './auth.guard';
import { ViewSnippetComponent } from './components/view-snippet/view-snippet.component';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path: 'sign-in', component: SignInComponent},
    {path: 'home', component: HomeComponent},
    {path: 'sign-up', component: SignUpComponent},
    {path: 'codeSnippet', component: CodeSnippetsComponent, canActivate: [AuthGuard]},
    {path: 'about', loadComponent: () =>import('./components/about/about.component').then(mod => mod.AboutComponent)},  //lazyloading
    // {path: '', redirectTo: "/login", pathMatch:"full"},
    {path: '', component: HomeComponent},
    {path: 'snippet/:id', component: ViewSnippetComponent},
    {path: '**', component: NotFoundComponent}, //Wildcard route for 404 page it should be in the end
];
