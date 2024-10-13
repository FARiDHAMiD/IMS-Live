import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import AxiosInstance from "../../Components/AxiosInstance";
import Spinner from "../../Components/Spinner";
import dayjs from "dayjs";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";

const CashCollectRequestDetails = () => {
  let { user } = useContext(AuthContext);
  let [cashCollectRequest, setCashCollectRequest] = useState([]);
  let { id } = useParams();
  let { theme } = useTheme();
  let [loading, setLoading] = useState(true);
  let [profile, setProfile] = useState([]);
  let [treasury, setTreasury] = useState([]);

  // passed from previous request to get user profile id
  const location = useLocation();
  let profile_id = location.state.profile["profile"];

  let navigate = useNavigate();

  let get_cashRequestDetails = async () => {
    let response = await AxiosInstance.get(`cash-collect/${id}/`);
    setCashCollectRequest(response.data);
    setLoading(false);
  };

  let get_profile = async () => {
    let response = await AxiosInstance.get(`profile/${profile_id}/`);
    setProfile(response.data);
  };

  // total accounts credit
  let get_treasury = async () => {
    let response = await AxiosInstance.get("treasury/");
    setTreasury(response.data[0].balance);
  };

  useEffect(() => {
    get_cashRequestDetails();
    get_profile();
    get_treasury();
  }, []);

  // accept user request
  let accept = () => {
    // check توريد / تحصيل
    let newProfileCredit =
      cashCollectRequest.request_type == 1
        ? parseInt(profile.credit) -
          parseInt(cashCollectRequest.credit_collected)
        : parseInt(profile.credit) +
          parseInt(cashCollectRequest.credit_collected);
    let newBalance =
      cashCollectRequest.request_type == 1
        ? parseInt(treasury) + parseInt(cashCollectRequest.credit_collected)
        : parseInt(treasury) - parseInt(cashCollectRequest.credit_collected);
    AxiosInstance.put(`profile/${profile_id}/`, {
      credit: newProfileCredit,
    })
      .then((res) => {
        AxiosInstance.put(`cash-collect/${id}/`, {
          approved: true,
          pending: false,
          approved_by: user.username,
          approved_time: dayjs().format(),
        });
        AxiosInstance.put(`treasury/1/`, {
          balance: newBalance,
          updated_by: user.user_id,
          approved_time: dayjs().format(),
          notes: "",
        });
        if (res.status === 200) {
          toast.success(`تم قبول الطلب بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالطلب`);
        }
      })
      .catch((e) => {
        toast.error(`خطأ بالطلب`, e.message);
      });
  };

  // reject user request
  let reject = () => {
    AxiosInstance.put(`cash-collect/${id}/`, {
      approved: false,
      pending: false,
      approved_by: user.username,
      approved_time: dayjs().format(),
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم رفض الطلب بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالطلب`);
        }
      })
      .catch(() => {
        toast.error(`خطأ بالطلب`);
      });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="container">
            <div className="text-center my-1">
              <h3>
                طلب {cashCollectRequest.request_type == 1 ? "توريد" : "تحصيل"}{" "}
                مبلغ EGP{" "}
                <span className={theme == "dark" ? "text-green" : "text-navy"}>
                  {cashCollectRequest.credit_collected.toLocaleString()}
                </span>{" "}
                المستخدم{" "}
                <span className={theme == "dark" ? "text-green" : "text-navy"}>
                  {cashCollectRequest.from_user}
                </span>
              </h3>
            </div>
            <div className="row">
              <div className="col-md-4 my-4">
                <div
                  className={`form-control form-control-lg text-center rounded-3 mt-1`}
                >
                  <span className={theme == "dark" ? "text-info" : "text-navy"}>
                    رصيد المستخدم قبل الطلب
                  </span>
                  <br />
                  EGP {profile.credit && profile.credit.toLocaleString()}
                </div>
                <Link
                  to={`/userInvoices/${cashCollectRequest.user[0].id}`}
                  className={`form-control form-control-lg text-center rounded-3 mt-1`}
                  style={{ textDecoration: "none" }}
                >
                  فواتير المستخدم
                </Link>
                <Link
                  className={`form-control form-control-lg text-center  rounded-3 mt-1`}
                  style={{ textDecoration: "none" }}
                  to={`/control/cash-collect-user/${profile_id}`}
                >
                  جميع طلبات التوريد للمستخدم
                </Link>
              </div>
              <div className="col-md-8 my-2">
                {/* Cash collect Request Item Card */}

                <div className="modal-dialog my-2" role="document">
                  <div className="modal-content rounded-4 shadow">
                    <div className="p-3 border-bottom-0 text-center">
                      <h1 className="fw-bold mb-0 fs-2"></h1>
                      <div className="row">
                        <div className="col-md-4 col-4">
                          <div className="">
                            <label
                              className={
                                theme == "dark" ? "text-info" : "text-navy"
                              }
                            >
                              توقيت الطلب
                            </label>
                          </div>
                          {dayjs(cashCollectRequest.request_time).format(
                            "YYYY/MM/DD hh:mma"
                          )}
                        </div>
                        <div className="col-md-4 col-4">
                          <div className="">
                            <label
                              className={
                                theme == "dark" ? "text-info" : "text-navy"
                              }
                            >
                              طلب مراجعة
                            </label>
                          </div>
                          {cashCollectRequest.approved_user}@
                        </div>
                        <div className="col-md-4 col-4">
                          <div className="">
                            <label
                              className={
                                theme == "dark" ? "text-info" : "text-navy"
                              }
                            >
                              ملاحظات
                            </label>
                          </div>
                          {cashCollectRequest.notes}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {cashCollectRequest.pending == true ? (
                  <>
                    <div className=" d-flex justify-content-center">
                      <button
                        onClick={accept}
                        className="btn btn-success p-1 shadow rounded-5 col-3 m-1 "
                      >
                        قبول
                      </button>
                      <button
                        onClick={reject}
                        className="btn btn-warning p-1 shadow rounded-5 col-3 m-1 "
                      >
                        رفض
                      </button>
                      <button
                        className="btn btn-secondary p-1 shadow rounded-5 col-3 m-1 "
                        onClick={() => navigate(-1)}
                      >
                        إلغاء
                      </button>
                    </div>

                    <div className="d-flex justify-content-center">
                      <p className="text-muted">
                        ملحوظة: لا يمكن للمستخدم إجراء طلب آخر قبل الإنتهاء من
                        الرد على هذا الطلب
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="row text-center">
                    <div className="col-8">
                      <h5>
                        تم الرد على هذا الطلب
                        {cashCollectRequest.approved == true ? (
                          <span className="text-success"> بالقبول </span>
                        ) : (
                          <span className="text-danger"> بالرفض </span>
                        )}
                        من {cashCollectRequest.approved_by}@
                      </h5>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <button
                        className={
                          theme == "dark"
                            ? "btn btn-sm btn-outline-light"
                            : "btn btn-sm btn-outline-dark"
                        }
                        onClick={() => navigate(-1)}
                      >
                        عودة{" "}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CashCollectRequestDetails;
