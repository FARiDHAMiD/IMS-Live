import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import AxiosInstance from "../../Components/AxiosInstance";
import UseDebounce from "../../hooks/UseDebounce";
import SearchBox from "../../Components/SearchBox";
import Spinner from "../../Components/Spinner";
import { Link, NavLink } from "react-router-dom";
import { FaStore, FaStoreSlash } from "react-icons/fa6";
import AuthContext from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeProvider";

const Stocks = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [stocks, setStocks] = useState([]);
  let [input, setInput] = useState([]);
  let [loading, setLoading] = useState(true);
  const debounce = UseDebounce(input, 800);
  let active_style = "text-muted";

  let getStocks = async () => {
    let response = await AxiosInstance.get(`stock?name=${input}`);
    setStocks(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getStocks();
  }, [debounce]);

  return (
    <>
      {/* search box and add button  */}
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
                to="/control/stock/create"
              >
                +
              </Link>
            )}
          </div>
        </div>
        <hr />
      </div>

      {/* Stock lists  */}
      <div className="container-fluid">
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="row">
            {stocks.map((stock) => (
              <div key={stock.id} className="col-md-4">
                <div className={`card ${!stock.isActive && active_style}`}>
                  <div className="card-header">
                    {stock.isActive ? (
                      <FaStore size={30} />
                    ) : (
                      <FaStoreSlash size={30} />
                    )}
                    <div style={{ float: "left" }}>
                      {!stock.isActive && "مخزن معطل |"}
                      {stock.credit.total &&
                        stock.credit.total.toLocaleString()}{" "}
                      ج.م.
                    </div>
                  </div>
                  <div className="card-body">
                    <h3
                      className={`card-title ${
                        !stock.isActive && "text-muted"
                      }`}
                    >
                      {stock.name}
                    </h3>
                    <p className="card-text">{stock.notes}</p>
                  </div>

                  <div className="card-footer text-muted">
                    {user && user.is_superuser && (
                      <Link
                        to={`/control/stock/${stock.id}`}
                        className={`btn btn-sm ${
                          theme == "dark"
                            ? "btn-outline-info"
                            : "btn-outline-primary"
                        }`}
                        style={{ float: "left" }}
                      >
                        عرض التفاصيل
                      </Link>
                    )}
                    <span className="mt-4 mb-0"></span>
                    آخر معاملة: {dayjs(stock.updated_at).fromNow()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Stocks;
