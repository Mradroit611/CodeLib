import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CodeSnippetsComponent } from './components/code-snippets/code-snippets.component';
// import { authGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { CommunityComponent } from './components/community/community.component';
import { ViewSnippetComponent } from './components/view-snippet/view-snippet.component';
import { DiscussionComponent } from './components/discussion/discussion.component';

export const routes: Routes = [
    {path: 'sign-in', component: SignInComponent},
    // {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    // { path: 'update-profile', component: UpdateProfileComponent },
    {path: 'home', component: HomeComponent},
    {path: 'sign-up', component: SignUpComponent},
    {path: 'codeSnippet', component: CodeSnippetsComponent, },
    {path: 'snippet/:id', component: ViewSnippetComponent},
    // {path: 'community', component: CommunityComponent},
    {path: 'discussion', component: DiscussionComponent, canActivate: [AuthGuard]},
    {path: 'about', loadComponent: () =>import('./components/about/about.component').then(mod => mod.AboutComponent)},  //lazyloading
    // {path: '', redirectTo: "/login", pathMatch:"full"},
    {path: '', component: HomeComponent},
    {path: '**', component: NotFoundComponent}, //Wildcard route for 404 page it should be in the end
];
