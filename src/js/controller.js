import recipeView from "./viewrecipe.js";
import { MODEL_CLOSE_SEC } from "./config.js";
import searchView from "./searchResults.js";
import { async, mark } from "regenerator-runtime";
import ResultsView from "./renderSearchResults.js";
import bookmarkView from "./bookmarkView.js";
import paginationView from "./paginationview.js";
import addRecipeView from "./addrecipeview.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import searchResults from "./searchResults.js";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    // update bookmarks
    bookmarkView.update(model.state.bookmarks);
    // 1. loading recipe
    recipeView.renderSpinner();

    //update results view to mark selected search results
    ResultsView.update(model.getSearchResultPage());
    await model.loadRecipe(id);
    const { recipe } = model.state;

    recipeView.render(model.state.recipe);
    // const recipeView = new recipeView(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

controlRecipes();

// window.addEventListener("hashchange", showRecipe);
// window.addEventListener("load", showRecipe);

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!searchView) return;

    await model.searchResults(query);
    // ResultsView.render(model.state.search.results);
    ResultsView.render(model.getSearchResultPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlPagination = function () {
  console.log("page controller");
};

const controlServings = function (newServing) {
  //update the recipe servings (in state)
  model.updateServings(newServing);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add /  remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // change ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // window.history.back()

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerrender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addhandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
