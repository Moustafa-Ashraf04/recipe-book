import { AuthService } from './../auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http
      .put(
        'https://ng-recipe-book-e86f9-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://ng-recipe-book-e86f9-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  // fetching and adding token without interceptor
  // fetchRecipes() {
  //   return this.authService.user.pipe(
  //     take(1),
  //     exhaustMap((user) => {
  //       return this.http.get<Recipe[]>(
  //         'https://ng-recipe-book-e86f9-default-rtdb.firebaseio.com/recipes.json',
  //         {
  //           params: new HttpParams().set('auth', user.token),
  //         }
  //       );
  //     }),
  //     map((recipes) => {
  //       return recipes.map((recipe) => {
  //         return {
  //           ...recipe,
  //           ingredients: recipe.ingredients ? recipe.ingredients : [],
  //         };
  //       });
  //     }),
  //     tap((recipes) => {
  //       this.recipeService.setRecipes(recipes);
  //     })
  //   );
  // }
}
