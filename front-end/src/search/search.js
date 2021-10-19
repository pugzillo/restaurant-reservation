import React from "react";

function Search() {
  return (
    <div className="search">
      <h1>Search</h1>

      <form>
        <div class="form-group">
          <input
            type="text"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            class="form-control"
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Find
        </button>
      </form>
    </div>
  );
}

export default Search;
