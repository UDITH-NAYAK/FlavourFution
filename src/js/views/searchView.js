class SearchView {
  _parentEL = document.querySelector('.search');
  _clearInput() {
    this._parentEL.querySelector('.search__field').value = '';
  }
  getQuery() {
    const query = this._parentEL.querySelector('.search__field').value;

    this._clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentEL.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }
}
export default new SearchView();
