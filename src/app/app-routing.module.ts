import { PuzzleComponent } from './puzzles/puzzle/puzzle.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { ChallengesComponent } from './challenges/challenges.component';
import { AuthGuard } from './auth/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { AnalysisBoardComponent } from './analysisboard/analysisboard.component';
import { CanDeactivateGuard } from './can-deactivate.guard';
import { PuzzlesComponent } from './puzzles/puzzles.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'board', component: BoardComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'analysisboard', component: AnalysisBoardComponent, canActivate: [AuthGuard] },
  { path: 'challenges', component: ChallengesComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  {
    path: 'puzzles', component: PuzzlesComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always',
    children: [
      { path: 'play', component: PuzzleComponent }]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['/login']);
    };
  }
}
