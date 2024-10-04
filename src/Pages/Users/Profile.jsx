import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import "../Users/profile.css";
import { Link, useParams } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";
import {
  FaFileInvoice,
  FaMoneyBillTransfer,
  FaMoneyBillTrendUp,
  FaStore,
} from "react-icons/fa6";
import UserInvoices from "./UserInvoices";
import { useTheme } from "../../context/ThemeProvider";

const Profile = () => {
  let { user, logoutUser } = useContext(AuthContext);
  let { theme } = useTheme();
  let { id } = useParams();
  let [profile, setProfile] = useState([]);
  let [userStocks, setUserStocks] = useState([]);

  let getProfile = async () => {
    let response = await AxiosInstance.get(`profile/${user.profile}/`);
    setProfile(response.data);
  };

  let getUserStocks = async () => {
    let response = await AxiosInstance.get(`user-stock/${user.profile}/`);
    setUserStocks(response.data);
  };

  useEffect(() => {
    getProfile();
    getUserStocks();
  }, []);

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row gutters">
          {/* Profile Card Info  */}
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile">
                    <div className="user-avatar">
                      <img
                        src={`https://ims-backend.up.railway.app${profile.image}`}
                        alt="Profile Pic"
                      />
                    </div>
                    <h5 className="user-name">{profile.full_name}</h5>
                    <h6 className="user-name">{user.username}@</h6>
                    <h6 className={theme == `dark` ? "text-info" : "text-navy"}>
                      {profile.credit && profile.credit.toLocaleString()} EGP
                    </h6>
                    <h6 className="user-name">{profile.phone}</h6>
                  </div>
                  <div className="about">
                    <p>{profile.notes}</p>
                  </div>
                  <div className="text-center">
                    <div className="row d-flex justify-content-center">
                      {user.is_superuser ? (
                        <div className="col-12 my-2">
                          <Link
                            className={`btn ${
                              theme == "dark"
                                ? `btn-outline-light`
                                : `btn-outline-dark`
                            } w-100`}
                            onClick={`logoutUser`}
                          >
                            توريد الرصيد للخزنة الرئيسية
                          </Link>
                        </div>
                      ) : (
                        <div className="col-12 my-2">
                          <button
                            className={`btn ${
                              theme == "dark"
                                ? `btn-outline-light`
                                : `btn-outline-dark`
                            } w-100`}
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#creditOutRequestModal"
                          >
                            طلب توريد الرصيد للخزنة الرئيسية
                          </button>
                        </div>
                      )}
                      <div className="col-6">
                        <Link
                          className={`btn ${
                            theme == "dark"
                              ? `btn-outline-info`
                              : `btn-outline-primary`
                          } w-100`}
                          to={`/profile/${user.profile}/edit`}
                        >
                          الملف الشخصى
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link
                          className={`btn ${
                            theme == "dark"
                              ? `btn-outline-light`
                              : `btn-outline-dark`
                          } w-100`}
                          onClick={logoutUser}
                        >
                          تسجيل خروج
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Profile Actions  */}
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                {/* user stocks  */}
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h5
                      className={`mb-3 ${
                        theme == `dark` ? `text-info` : `text-navy`
                      } text-center`}
                    >
                      المخازن <FaStore size={25} />
                    </h5>
                  </div>
                  {userStocks.length ? (
                    <div className="card">
                      <div className="modal-footer flex-nowrap p-0">
                        <div
                          type="button"
                          className="btn btn-sm btn-link fs-6 text-decoration-none col-3 m-0 rounded-0"
                        >
                          <strong>المخزن</strong>
                        </div>
                        <div
                          type="button"
                          className="btn btn-sm btn-link fs-6 text-decoration-none col-6 m-0 rounded-0 border-end"
                        >
                          <strong>المكان</strong>
                        </div>
                        <div
                          type="button"
                          className="btn btn-sm btn-link fs-6 text-decoration-none col-3 m-0 rounded-0"
                        >
                          الرصيد
                        </div>
                      </div>
                      <hr className="mb-0" />
                      {userStocks.map((stock, index) => (
                        <Link
                          key={index}
                          className="modal-footer flex-nowrap p-0"
                          to={`/control/stock/${stock.id}`}
                          style={{ textDecoration: "none" }}
                          target="_blank"
                        >
                          <div
                            type="button"
                            className="btn btn-sm fs-6 text-decoration-none col-3 m-0 rounded-0"
                          >
                            <strong>{stock.name}</strong>
                          </div>
                          <div
                            type="button"
                            className="btn btn-sm fs-6 text-decoration-none col-6 m-0 rounded-0 border-end"
                          >
                            <strong>{stock.location}</strong>
                          </div>
                          <div
                            type="button"
                            className="btn btn-sm  fs-6 text-decoration-none col-3 m-0 rounded-0"
                          >
                            <strong>
                              {stock.credit.total &&
                                stock.credit.total.toLocaleString()}{" "}
                              EGP
                            </strong>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="my-2 text-center">
                      هذا المستخدم غير مسئول عن أي مخزن ...
                    </p>
                  )}
                </div>
                <hr />

                {/* user invoices */}
                <UserInvoices userID={user.user_id} limited />
                <div className="d-flex justify-content-center">
                  <Link
                    to={`/userInvoices/${user.user_id}`}
                    className={`btn btn-sm ${
                      theme == `dark` ? `btn-outline-info` : `btn-outline-dark`
                    } text-center`}
                  >
                    المزيد ...
                  </Link>
                </div>
                <hr />

                {/* user credit changes */}
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h5
                      className={`mb-3 ${
                        theme == `dark` ? `text-info` : `text-navy`
                      } text-center`}
                    >
                      حركات الرصيد <FaMoneyBillTransfer size={25} />
                    </h5>
                  </div>
                  <div className=" d-flex justify-content-center">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className={
                              theme == `dark`
                                ? `text-warning`
                                : `text-light bg-primary`
                            }
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == `dark`
                                ? `text-warning`
                                : `text-light bg-primary`
                            }
                          >
                            الرصيد
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == `dark`
                                ? `text-warning`
                                : `text-light bg-primary`
                            }
                          >
                            تاريخ
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == `dark`
                                ? `text-warning`
                                : `text-light bg-primary`
                            }
                          >
                            قبل التغيير
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == `dark`
                                ? `text-warning`
                                : `text-light bg-primary`
                            }
                          >
                            لحساب
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className=" d-flex justify-content-center">
                    <h4 className="mb-2">...Working on it</h4>
                  </div>
                  <div className="d-flex justify-content-center my-1">
                    <button
                      className={`btn btn-sm ${
                        theme == `dark`
                          ? `btn-outline-info`
                          : `btn-outline-dark`
                      } text-center`}
                    >
                      المزيد ...
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Credit Out Request Modal - طلب توريد الرصيد للخزينة الرئيسية */}
          <div
            className="modal fade modal-lg"
            id="creditOutRequestModal"
            tabIndex="-1"
            aria-labelledby="creditOutRequestModalLabel"
          >
            <div className="modal-dialog rounded-3 shadow">
              <div className="modal-content">
                <div className="modal-title p-3 text-center">
                  <div className="row">
                    <div className="col-md-10">
                      <h4>
                        طلب توريد رصيد المستخدم{" "}
                        <span
                          className={
                            theme == "dark" ? "text-warning" : "text-navy"
                          }
                        >
                          {user.username}@
                        </span>{" "}
                        للخزينة الرئيسية
                      </h4>
                    </div>
                    <div className="col-md-2">
                      <FaMoneyBillTrendUp
                        size={40}
                        className={theme == "dark" ? "" : "text-navy"}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="container">
                  <p className="text-center">
                    يتم هذا الطلب نهاية كل يوم بعد مراجعة الفواتير والعهدة
                    المستلمة من المستخدم ومراجعة أرصدة العملاء وكميات الأصناف
                    بالمخازن المستلم منها العهدة
                  </p>
                  <p
                    className={
                      theme == "dark"
                        ? "text-center text-info"
                        : "text-center text-navy"
                    }
                  >
                    فى حال عدم توريد رصيد المستخدم نهاية كل يوم سيم ترحيل المبلغ
                    تلقائياً لليوم التالى
                  </p>
                  <div>
                    <div className="row col-6"></div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 col-6 mb-2">
                      <label>طلب من مستخدم</label>
                      <select className="form-select" name="" id="">
                        <option value="">---</option>
                      </select>
                    </div>
                    <div className="col-md-4 col-6 mb-2">
                      <label>توريد مبلغ</label>
                      <input
                        type="number"
                        name=""
                        id=""
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-4 col-12 mb-2">
                      <label>ملاحظات</label>
                      <input
                        type="text"
                        name=""
                        id=""
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer flex-nowrap p-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-link fs-6 text-decoration-none text-light bg-success col-6 m-0 rounded-0 border-end"
                    data-bs-dismiss="modal"
                    onClick={`destroy`}
                  >
                    <strong>تأكيد الطلب</strong>
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm btn-link fs-6 text-decoration-none ${
                      theme == "dark" ? "text-light" : "text-dark"
                    } col-6 m-0 rounded-0`}
                    data-bs-dismiss="modal"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
