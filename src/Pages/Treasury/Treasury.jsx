import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import AxiosInstance from "../../Components/AxiosInstance";
import { useEffect, useState } from "react";
import {
  FaBusinessTime,
  FaCoins,
  FaFilterCircleDollar,
  FaMagnifyingGlass,
  FaSitemap,
  FaUsers,
} from "react-icons/fa6";
import dayjs from "dayjs";

const Treasury = () => {
  let { theme } = useTheme();
  let [cashCollectPending, setCashCollectPending] = useState([]);

  let get_cashCollectPending = async () => {
    let response = await AxiosInstance.get("cashCollectPending/");
    setCashCollectPending(response.data);
  };

  useEffect(() => {
    get_cashCollectPending();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-5 mt-3">
          <div className="row d-flex justify-content-center">
            <div className="col-md-10 mt-2">
              <Link to="" style={{ textDecoration: "none" }}>
                <div
                  className={`card p-3 text-light  ${
                    theme == "dark" ? "bg-secondary" : "bg-success"
                  }`}
                  style={{ alignItems: "center" }}
                >
                  <FaCoins size={45} style={{ alignContent: "center" }} />
                  <h3 className="mt-2">إجمالى رصيد الخزنة</h3>
                  <br />
                  <h3>{`...Working on it`}</h3>
                </div>
              </Link>
            </div>
            <div className="col-md-10 mt-2">
              <Link to="" style={{ textDecoration: "none" }}>
                <div
                  className={`card p-3 text-light  ${
                    theme == "dark" ? "bg-secondary" : "bg-success"
                  }`}
                  style={{ alignItems: "center" }}
                >
                  <FaUsers size={45} style={{ alignContent: "center" }} />
                  <h3 className="mt-2">إجمالى أرصدة العملاء</h3>
                  <br />
                  <h3>{`...Working on it`}</h3>
                </div>
              </Link>
            </div>
            <div className="col-md-10 mt-2">
              <Link to="" style={{ textDecoration: "none" }}>
                <div
                  className={`card p-3 text-light  ${
                    theme == "dark" ? "bg-secondary" : "bg-success"
                  }`}
                  style={{ alignItems: "center" }}
                >
                  <FaSitemap size={45} style={{ alignContent: "center" }} />
                  <h3 className="mt-2">إجمالى أرصدة المستخدمين</h3>
                  <br />
                  <h3>{`...Working on it`}</h3>
                </div>
              </Link>
            </div>
            <div className="col-md-10 mt-2">
              <Link to="" style={{ textDecoration: "none" }}>
                <div
                  className={`card p-3 text-light  ${
                    theme == "dark" ? "bg-secondary" : "bg-success"
                  }`}
                  style={{ alignItems: "center" }}
                >
                  <FaFilterCircleDollar
                    size={45}
                    style={{ alignContent: "center" }}
                  />
                  <h3 className="mt-2">جميع تقارير الخزنة</h3>
                  <h3>{`...Working on it`}</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-7 mt-3">
          <h3 className="text-center mt-2">
            طلبات توريد الرصيد للخزنة <FaBusinessTime size={40} />
          </h3>
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
                    المستخدم
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
                    إجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {cashCollectPending.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.from_user}</td>
                    <td>{dayjs(item.request_time).format("M/D h:mma")}</td>
                    <td>{item.credit_collected}</td>
                    <td>{item.approved_user}</td>
                    <td>
                      <Link
                        className={`btn btn-sm ${
                          theme == "dark"
                            ? "btn-outline-light"
                            : "btn-outline-dark"
                        }`}
                        to={`/control/cash-collect/${item.id}`}
                        state={{ profile: item.user[0] }}
                      >
                        <FaMagnifyingGlass />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
