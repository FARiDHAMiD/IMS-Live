import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import Spinner from "../../Components/Spinner";
import UseDebounce from "../../hooks/UseDebounce";
import ItemCard from "../../Components/ItemCard";
import AxiosInstance from "../../Components/AxiosInstance";
import SearchBox from "../../Components/SearchBox";
import { Link } from "react-router-dom";
import ItemsLog from "../../Components/Logs/ItemsLog";
import { useTheme } from "../../context/ThemeProvider";

const Items = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [items, setItems] = useState([]);
  let [input, setInput] = useState([]);
  let [loading, setLoading] = useState(true);
  const debounce = UseDebounce(input, 800);

  let getItems = async () => {
    let response = await AxiosInstance.get(`item?name=${input}`);
    setItems(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getItems();
  }, [debounce]);

  return (
    <>
      {/* Search box and add button */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-8">
            <SearchBox searchTxt={input} setSearchTxt={setInput} width={10} />
          </div>
          <div className="col-md-4 col-4 mt-2 d-flex justify-content-end">
            {user.is_superuser && (
              <Link
                className={`btn btn-lg ${
                  theme == "dark" ? "btn-outline-light" : "btn-outline-dark"
                } rounded-pill`}
                style={{ fontWeight: "bolder" }}
                to="/control/item/create"
              >
                +
              </Link>
            )}
          </div>
        </div>
        <hr />
      </div>

      {/* Items List  */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              {items.map((item) => (
                <div key={item.id} className="mb-2">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
            <div className="col-md-4">
              <ItemsLog limited={true} item={input} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Items;
