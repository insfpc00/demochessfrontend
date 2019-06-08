import { DashBoardModule } from './dashboard/dashboard.module';
import { ChessBoardModule } from './chessboard/chessboard.module';
import { SignUpModule } from './signup/signup.module';
import { NavbarModule } from './navbar/navbar.module';
import { AccountModule } from './account/acount.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './core/user.service';
import { TokenInterceptor } from './core/interceptor';
import { stompServiceProvider } from './rx-stomp.service.provider';
import { soundServiceProvider } from './core/sound.service.provider';
import { AppConfig } from './app.config';
import { ChallengesModule } from './challenges/challenges.module';
import { LoginModule } from './login/login.module';
import { PuzzlesModule } from './puzzles/puzzles.module';
import { AnalysisBoardModule } from './analysisboard/analysisboard.module';
import { BoardModule } from './board/board.module';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChallengesModule,
    AccountModule,
    NavbarModule,
    LoginModule,
    SignUpModule,
    PuzzlesModule,
    ChessBoardModule,
    AnalysisBoardModule,
    DashBoardModule,
    BoardModule
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true },
    soundServiceProvider,
    stompServiceProvider,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]

})
export class AppModule {}
