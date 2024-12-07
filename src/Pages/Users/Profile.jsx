import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "react-toastify";
import CashCollectRequestUser from "../Treasury/CashCollectRequestUser";

const Profile = () => {
  let { user, logoutUser } = useContext(AuthContext);
  let { theme } = useTheme();
  let { id } = useParams();
  let [profile, setProfile] = useState([]);
  let [userStocks, setUserStocks] = useState([]);
  let [superusers, SetSuperusers] = useState([]);
  let [lastCashStatus, SetlastCashStatus] = useState(false);

  let getProfile = async () => {
    let response = await AxiosInstance.get(`profile/${user.profile}/`);
    setProfile(response.data);
  };

  let get_superusers = async () => {
    let response = await AxiosInstance.get(`get_superusers/`);
    SetSuperusers(response.data);
  };

  let userLastCashStatus = async () => {
    if (!user.is_superuser) {
      let response = await AxiosInstance.get(
        `userLastCashStatus/${user.profile}`
      );
      SetlastCashStatus(response.data.pending);
    }
  };

  let getUserStocks = async () => {
    let response = await AxiosInstance.get(`user-stock/${user.profile}/`);
    setUserStocks(response.data);
  };

  useEffect(() => {
    get_superusers();
    getProfile();
    userLastCashStatus();
    getUserStocks();
  }, []);

  const defaultValues = {
    from_user: user.user_id,
    approved_user: "",
    credit_collected: "",
  };

  // Use Form hook
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  let cashCollect = (data) => {
    AxiosInstance.post(`cash-collect/`, {
      from_user: user.username,
      request_type: profile.credit > 0 ? 1 : 2, // توريد أو تحصيل على حسب الرصيد
      approved_by: null, // when update only
      approved_user: data.approved_user,
      credit_collected: data.credit_collected,
      current_credit: profile.credit,
      notes: data.notes,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم طلب مراجعة الرصيد`);
          window.location.reload();
        } else {
          toast.error(`خطأ بالطلب`);
        }
        reset();
      })
      .catch(() => {
        toast.error(`خطأ بالطلب`);
      });
  };

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
                          <button
                            className={`btn ${
                              theme == "dark"
                                ? `btn-outline-light`
                                : `btn-outline-dark`
                            } w-100`}
                            onClick={cashCollect}
                          >
                            توريد الرصيد للخزنة الرئيسية
                          </button>
                        </div>
                      ) : (
                        <div className="col-12 my-2">
                          {lastCashStatus ? (
                            <h6
                              className={
                                theme == "dark" ? "text-warning" : "text-danger"
                              }
                            >
                              تم طلب مراجعة توريد رصيد للخزنة
                            </h6>
                          ) : (
                            profile.credit != 0 && (
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
                                {profile.credit > 0
                                  ? "توريد الرصيد إلى الخزنة"
                                  : profile.credit < 0
                                  ? "تحصيل الرصيد من الخزنة"
                                  : ""}
                              </button>
                            )
                          )}
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
                      حركات الرصيد للخزنة <FaMoneyBillTransfer size={25} />
                    </h5>
                  </div>
                  <div className=" d-flex justify-content-center">
                    <CashCollectRequestUser profile_view limited />
                  </div>
                  <div className="d-flex justify-content-center my-1">
                    <Link
                      className={`btn btn-sm ${
                        theme == `dark`
                          ? `btn-outline-info`
                          : `btn-outline-dark`
                      } text-center`}
                      to={`/cash-collect-user/${profile.id}`}
                    >
                      المزيد ...
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Out Request Modal - طلب توريد / تحصيل الرصيد للخزينة الرئيسية */}
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
                        طلب {profile.credit > 0 ? "توريد" : "تحصيل"} رصيد
                        المستخدم{" "}
                        <span
                          className={
                            theme == "dark" ? "text-warning" : "text-navy"
                          }
                        >
                          {user.username}@
                        </span>{" "}
                        {profile.credit > 0 ? "إلى" : "من"} الخزنة الرئيسية
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
                      <label>مراجعة المستخدم</label>
                      <select
                        className={`form-select ${
                          errors.approved_user && "is-invalid"
                        }`}
                        name="approved_user"
                        {...register("approved_user", {
                          required: true,
                        })}
                      >
                        <option value="">---</option>
                        {superusers.map((suser) => (
                          <option key={suser.id} value={suser.username}>
                            {suser.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 col-6 mb-2">
                      <label>
                        {profile.credit > 0 ? "توريد" : "تحصيل"} مبلغ
                      </label>
                      <input
                        type="number"
                        name="credit_collected"
                        defaultValue={profile.credit}
                        className={`form-control ${
                          errors.credit_collected && "is-invalid"
                        }`}
                        {...register("credit_collected", {
                          required: true,
                          max: {
                            value:
                              profile.credit > 0
                                ? profile.credit
                                : -profile.credit,
                            message: "خطأ بالمبلغ المطلوب",
                          },
                          min: {
                            value: 1,
                            message: "خطأ بالمبلغ المطلوب",
                          },
                        })}
                      />
                      {errors.credit_collected && (
                        <div role="alert" className="text-danger">
                          {errors.credit_collected.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 col-12 mb-2">
                      <label>ملاحظات</label>
                      <input
                        type="text"
                        name="notes"
                        className="form-control"
                        {...register("notes")}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer flex-nowrap p-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-link fs-6 text-decoration-none text-light bg-success col-6 m-0 rounded-0 border-end"
                    id="requestCashCollectButton"
                    onClick={handleSubmit(cashCollect)}
                  >
                    <strong>تأكيد الطلب</strong>
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm btn-link fs-6 text-decoration-none 
                      text-light bg-secondary
                     col-6 m-0 rounded-0`}
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
