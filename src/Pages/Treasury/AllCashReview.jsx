import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import {
  FaArrowLeft,
  FaBusinessTime,
  FaCheck,
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";
import dayjs from "dayjs";
import AxiosInstance from "../../Components/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner";
import SearchBox from "../../Components/SearchBox";
import UseDebounce from "../../hooks/UseDebounce";

const AllCashReview = () => {
  const { theme } = useTheme();
  const [cashReview, setCashReview] = useState([]);
  const [treasury, setTreasury] = useState(0);
  const [input, setInput] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const debounce = UseDebounce(input, 300);

  // pending cash collect requests table
  let get_cashReview = async () => {
    let response = await AxiosInstance.get(`cash-collect`);
    setCashReview(response.data.slice(0, page * itemsPerPage));
    setLoading(false);
  };

  useEffect(() => {
    get_cashReview();
  }, [page, debounce]);

  return (
    <div className="container">
      <h3 className="text-center mt-2">
        حركات الخزنة <FaBusinessTime size={40} />
      </h3>
      <div className="row">
        <div className="col-8">
          <SearchBox searchTxt={input} setSearchTxt={setInput} />
        </div>
        <div className="col-4 text-end">
          <Link className="btn" to={-1}>
            <FaArrowLeft />
          </Link>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    #
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    طلب من
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    توقيت الطلب
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    نوع الطلب
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    المبلغ
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    طلب مراجعة
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    ملاحظات
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {cashReview.map((cash, index) => (
                  <tr
                    key={cash.id}
                    onClick={() =>
                      navigate(`/control/cash-collect/${cash.id}`, {
                        state: { profile: cash.user[0] },
                      })
                    }
                  >
                    <td>{index + 1}</td>
                    <td>{cash.from_user}</td>
                    <td>{dayjs(cash.request_time).format("M/D h:mma")}</td>
                    <td>{cash.request_type == 1 ? "توريد" : "تحصيل"}</td>
                    <td>{cash.credit_collected}</td>
                    <td>{cash.approved_user}</td>
                    <td>{cash.notes}</td>
                    <td>
                      {cash.pending == false ? (
                        cash.approved == true ? (
                          <FaCheck size={25} className="text-success" />
                        ) : (
                          <FaXmark size={25} className="text-danger" />
                        )
                      ) : (
                        <Link
                          className={`btn btn-sm ${
                            theme == "dark"
                              ? "btn-outline-light"
                              : "btn-outline-dark"
                          }`}
                          to={`/control/cash-collect/${cash.id}`}
                          state={{ profile: cash.user[0] }}
                        >
                          <FaMagnifyingGlass />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="my-1 text-center">
            <div className="">
              <button
                className={
                  theme == "dark"
                    ? "btn btn-outline-light"
                    : "btn btn-outline-dark"
                }
                onClick={() => setPage(page + 1)}
              >
                المزيد ...
              </button>
              <div className="text-end">
                <Link className="btn" to={-1}>
                  <FaArrowLeft />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllCashReview;
