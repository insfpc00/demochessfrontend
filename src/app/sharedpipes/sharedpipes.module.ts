import { ReversePipe } from './reverse.pipe';
import { MatchuserPipe } from './matchuser.pipe';
import { NgModule } from '@angular/core';
import { SplitarrayPipe } from './splitarray.pipe';
import { MatchResultPipe } from './matchresult.pipe';

@NgModule({
  declarations: [MatchuserPipe, ReversePipe, SplitarrayPipe, MatchResultPipe],
  imports: [
  ],
  exports: [
    MatchuserPipe, ReversePipe, SplitarrayPipe, MatchResultPipe
  ]
})
export class SharedPipesModule { }
