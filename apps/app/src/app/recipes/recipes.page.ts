import { Component, OnInit } from '@angular/core';

import { RecipesStore } from '../business/recipes.store';

@Component({
  selector: 'kookaburra-recipes',
  templateUrl: 'recipes.page.html',
  styleUrls: ['recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  constructor(private recieptStore: RecipesStore) {}

  ngOnInit(): void {
    this.recieptStore.loadReceipts();
  }
}
