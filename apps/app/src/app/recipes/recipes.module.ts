import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesPage } from './recipes.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: RecipesPage }]),
    RecipesRoutingModule,
  ],
  declarations: [RecipesPage],
})
export class RecipesPageModule {}
