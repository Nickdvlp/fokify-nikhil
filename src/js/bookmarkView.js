import View from "./view.js";
import icons from "url:../img/icons.svg";
import previewView from "./previewView.js";

class bookmarkView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it !";
  _messsage = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generaterMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new bookmarkView();
