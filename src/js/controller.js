import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//this is parcel code to prevent the page state
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //spinner while loading
    recipeView.renderSpinner();

    // updating book marks view
    bookmarkView.update(model.state.bookmarks);

    //UPDATE RESULTS VIEW TO Mmark selected search result)
    resultView.update(model.getSearchResultsPage());

    //1)loading recipe
    await model.loadRecipe(id);

    //2)Rendering recipie
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function (e) {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultView.renderSpinner();
    //2)Load search result
    await model.loadSearchResults(query);

    //3)Render result

    resultView.render(model.getSearchResultsPage());

    //4)Render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};
const controlPagination = function (goToPage) {
  resultView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  // //update the recipe serving(in state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1)ADD/Remove the bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //@)update recipe view
  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);

    //Sucess message
    addRecipeView.renderSucessMessage();

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //Change is in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (error) {
    console.log('🤔', error);
    addRecipeView.renderError(error);
  }
};
const newFeature = function () {
  console.log('Welcome to the application');
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
init();
