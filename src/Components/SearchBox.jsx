const SearchBox = (props) => {
  // let [searchTxt, setSearchTxt] = useState("");
  let { searchTxt, setSearchTxt, width } = props;
  return (
    <div className={`mb-2 mt-2 m-2 col-md-${width}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className="form-control"
          type="search"
          placeholder="بحث..."
          value={searchTxt}
          onChange={(e) => setSearchTxt(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchBox;
