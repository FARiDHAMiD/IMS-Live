import { useState, useEffect } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import UseDebounce from "../../hooks/UseDebounce";
import SearchBox from "../../Components/SearchBox";
import Spinner from "../../Components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";

const StocksArchive = () => {
  let [input, setInput] = useState([]);
  let { theme } = useTheme();
  let [stocks, setStocks] = useState([]);
  let [loading, setLoading] = useState(true);
  const debounce = UseDebounce(input, 800);
  let navigate = useNavigate();

  let getArchivedStock = async () => {
    let response = await AxiosInstance.get(`stockArchive?name=${input}`);
    setStocks(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getArchivedStock();
  }, [debounce]);

  let editStock = (id) => {
    navigate(`/control/stock/${id}`);
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-md-8">
          <SearchBox searchTxt={input} setSearchTxt={setInput} />
        </div>
        <div className="col-md-4">
          <Link
            to="/control/archive"
            className="btn btn-outline-light mt-2"
            style={{ float: "left" }}
          >
            عودة للأرشيف
          </Link>
        </div>
      </div>
      <h4 className="text-center mb-2">إضغط على المخزن للمعلومات</h4>
      {loading ? (
        <Spinner />
      ) : (
        <table className="table table-hover ">
          <thead>
            <tr>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                #
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                إسم المخزن
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                المسئول عن المخزن
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                تاريخ التعطيل
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                تعطيل بواسطة
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr onClick={() => editStock(stock.id)} key={stock.id}>
                <td scope="row">{index + 1}</td>
                <td className="text-nowrap">{stock.name}</td>
                <td className="text-nowrap">{stock.keeper}</td>
                <td>{stock.archived_at}</td>
                <td>{stock.updated_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StocksArchive;
