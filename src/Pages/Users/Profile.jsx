import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import "../Users/profile.css";
import { Link, useParams } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";
import { FaFileInvoice, FaMoneyBillTransfer, FaStore } from "react-icons/fa6";
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
                    <div className="row">
                      <div className="col-6">
                        <Link
                          className={`btn ${
                            theme == "dark"
                              ? `btn-outline-info`
                              : `btn-outline-primary`
                          } w-100`}
                          to={`/profile/${user.profile}/edit`}
                        >
                          تعديل
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
                          خروج
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
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className={
                            theme == `dark` ? `text-warning` : `text-primary`
                          }
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          className={
                            theme == `dark` ? `text-warning` : `text-primary`
                          }
                        >
                          الرصيد
                        </th>
                        <th
                          scope="col"
                          className={
                            theme == `dark` ? `text-warning` : `text-primary`
                          }
                        >
                          تاريخ
                        </th>
                        <th
                          scope="col"
                          className={
                            theme == `dark` ? `text-warning` : `text-primary`
                          }
                        >
                          قبل التغيير
                        </th>
                        <th
                          scope="col"
                          className={
                            theme == `dark` ? `text-warning` : `text-primary`
                          }
                        >
                          لحساب
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td className="text-nowrap">بيع</td>
                        <td className="text-nowrap">22 / 07 / 2024</td>
                        <td className="">5600 EGP</td>
                        <td className="text-nowrap">محمد احمد محمود</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td className="text-nowrap">شراء</td>
                        <td className="text-nowrap">21 / 07 / 2024</td>
                        <td className="">4200 EGP</td>
                        <td className="text-nowrap">إسلام مصطفى محمد</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-center">
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
        </div>
      </div>
    </>
  );
};

export default Profile;
