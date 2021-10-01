import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickstartComponent } from './quickstart/quickstart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'quickstart', component: QuickstartComponent },
  { path: '', redirectTo: '/quickstart', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
