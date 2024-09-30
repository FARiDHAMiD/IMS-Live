import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import Spinner from "../../Components/Spinner";
import UseDebounce from "../../hooks/UseDebounce";
import ItemCard from "../../Components/ItemCard";
import AxiosInstance from "../../Components/AxiosInstance";
import SearchBox from "../../Components/SearchBox";
import { Link } from "react-router-dom";
import ItemsLog from "../../Components/Logs/ItemsLog";

const Items = () => {
  let { user } = useContext(AuthContext);
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
          <div className="col-md-8 d-flex justify-content-right">
            <SearchBox searchTxt={input} setSearchTxt={setInput} width={12} />
          </div>
          <div className="col-md-4">
            {(user.is_superuser || user.is_staff) && (
              <Link
                className="btn btn-lg btn-outline-light rounded-pill mt-2"
                style={{ float: "left", fontWeight: "bolder" }}
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
              <ItemsLog limited={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Items;
