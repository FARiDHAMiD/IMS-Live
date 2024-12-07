import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import AxiosInstance from "../../Components/AxiosInstance";
import { useEffect, useState } from "react";
import {
  FaBusinessTime,
  FaCoins,
  FaFilterCircleDollar,
  FaMagnifyingGlass,
  FaMoneyBillWave,
  FaPeopleGroup,
  FaUsers,
} from "react-icons/fa6";
import dayjs from "dayjs";

const Treasury = () => {
  let { theme } = useTheme();
  let [cashCollectPending, setCashCollectPending] = useState([]);
  let [accountsCredit, setAccountsCredit] = useState(0);
  let [profilesCredit, setProfilesCredit] = useState(0);
  let [treasury, setTreasury] = useState(0);

  const totalBalance =
    parseInt(treasury) + parseInt(accountsCredit) + parseInt(profilesCredit);

  // pending cash collect requests table
  let get_cashCollectPending = async () => {
    let response = await AxiosInstance.get("cashCollectPending/");
    setCashCollectPending(response.data);
  };

  // total accounts credit
  let get_treasury = async () => {
    let response = await AxiosInstance.get("treasury/1/");
    setTreasury(response.data.balance);
  };

  // total accounts credit
  let get_accountsCredit = async () => {
    let response = await AxiosInstance.get("sumAccountsCredit/");
    setAccountsCredit(response.data);
  };

  // total accounts credit
  let get_profilesCredit = async () => {
    let response = await AxiosInstance.get("sumProfilesCredit/");
    setProfilesCredit(response.data);
  };

  useEffect(() => {
    get_cashCollectPending();
    get_accountsCredit();
    get_profilesCredit();
    get_treasury();
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
                  <h3 className="mt-2">إجمالى الرصيد</h3>
                  <br />
                  <h3 className={totalBalance < 0 ? "text-warning" : ""}>
                    {totalBalance.toLocaleString()} جنيه
                  </h3>
                </div>
              </Link>
            </div>
            <div className="col-md-9 text-center text-center col-9 mt-2">
              <Link
                to="/control/allCashReview"
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`card p-3 text-light  ${
                    theme == "dark" ? "bg-secondary" : "bg-success"
                  }`}
                  style={{ alignItems: "center" }}
                >
                  <FaMoneyBillWave
                    size={45}
                    style={{ alignContent: "center" }}
                  />
                  <h4 className="mt-2">أوراق نقدية (كاش)</h4>
                  <br />
                  <h3>{treasury.toLocaleString()} جنيه</h3>
                </div>
              </Link>
            </div>
            <div className="col-md-9 text-center col-9 mt-2">
              <Link to="" style={{ textDecoration: "none" }}>
                <div
                  className={`card p-3 text-light  ${
                    theme == "dark" ? "bg-secondary" : "bg-success"
                  }`}
                  style={{ alignItems: "center" }}
                >
                  <FaPeopleGroup size={45} style={{ alignContent: "center" }} />
                  <h4 className="mt-2">مستخدمين النظام</h4>
                  <br />
                  <h3>
                    {profilesCredit.toLocaleString()}{" "}
                    {profilesCredit > 0
                      ? `دائن`
                      : profilesCredit < 0
                      ? `مدين`
                      : ``}
                  </h3>
                </div>
              </Link>
            </div>
            <div className="col-md-9 text-center col-9 mt-2">
              <Link to="" style={{ textDecoration: "none" }}>
                <div
                  className={`card p-3 text-light  ${
                    theme == "dark" ? "bg-secondary" : "bg-success"
                  }`}
                  style={{ alignItems: "center" }}
                >
                  <FaUsers size={45} style={{ alignContent: "center" }} />
                  <h3 className="mt-2">الأرصدة الخارجية</h3>
                  <br />
                  <h3>
                    {accountsCredit.toLocaleString()}{" "}
                    {accountsCredit > 0
                      ? `دائن`
                      : accountsCredit < 0
                      ? `مدين`
                      : ``}
                  </h3>
                </div>
              </Link>
            </div>
            <div className="col-md-9 text-center col-9 mt-2">
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
          <h4 className="text-center mt-2">
            طلبات توريد/تحصيل الرصيد للخزنة <FaBusinessTime size={30} />
          </h4>
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
                    <td>{item.request_type == 1 ? "توريد" : "تحصيل"}</td>
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
          <div className="text-center my-2">
            <Link
              to="/control/allCashReview"
              className={`${
                theme == "dark"
                  ? "btn btn-outline-info"
                  : "btn btn-outline-dark"
              }`}
            >
              جميع الطلبات السابقة ...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
