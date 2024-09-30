import { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import AuthContext from "../../context/AuthContext";
import {
  FaCircleArrowLeft,
  FaCircleArrowRight,
  FaMoneyBill1Wave,
  FaRepeat,
} from "react-icons/fa6";
import ConfirmDeleteModal from "../../Components/ConfirmDeleteModal";
import DeleteModal from "../../Components/DeleteModal";
import Invoices from "../Invoices/Invoices";

const EditAccount = () => {
  let { user } = useContext(AuthContext);
  const { id } = useParams();
  let [account, setAccount] = useState([]);
  let [accountType, setAccountType] = useState([]);
  let [company, setCompany] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  // manage controlled and uncontrolled data
  const defaultValues = {
    name: "",
    account_type: "",
    company: "",
    address: "",
    phone1: "",
    phone2: "",
    init_credit: "",
    credit: "",
    notes: "",
  };

  // Use Form hook
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  // get account types for dropdown list
  let getAccountType = async () => {
    let response = await AxiosInstance.get(`accountType`);
    setAccountType(response.data);
  };

  // get companies for dropdown list
  let getCompany = async () => {
    let response = await AxiosInstance.get(`company`);
    setCompany(response.data);
  };

  // retrieve account by id
  let getAccount = async () => {
    let response = await AxiosInstance.get(`account/${id}/`);
    setAccount(response.data);
    setValue("account_type", response.account_type);
    setValue("name", response.data.name);
    setValue("company", response.data.company);
    setValue("address", response.data.address);
    setValue("phone1", response.data.phone1);
    setValue("init_credit", response.data.init_credit);
    setValue("credit", response.data.credit);
    setValue("percent", response.data.percent);
    setValue("notes", response.data.notes);
    setLoading(false);
  };

  useEffect(() => {
    getAccount();
    getAccountType();
    getCompany();
  }, [
    setValue("account_type", account.account_type),
    setValue("company", account.company),
  ]);

  // update on submit
  const update = (data) => {
    AxiosInstance.put(`account/${id}/`, {
      account_type: data.account_type,
      archived_at: null,
      company: data.company,
      name: data.name,
      address: data.address,
      phone1: data.phone1,
      phone2: data.phone2,
      init_credit: data.init_credit,
      credit: data.credit,
      percent: data.percent,
      notes: data.notes,
      updated_by: user.username,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم التعديل بنجاح`);
        } else {
          toast.error(`خطأ بالتعديل`);
        }
        navigate(`/control/account`);
      })
      .catch(() => {
        toast.error(`خطأ أثناء العملية`);
      });
  };

  // Deactivate - Archive Account
  const deactivateAccount = (data) => {
    AxiosInstance.put(`account/${id}/`, {
      isActive: false,
      archived_at: dayjs(),
      account_type: data.account_type,
      company: data.company,
      name: data.name,
      address: data.address,
      phone1: data.phone1,
      phone2: data.phone2,
      init_credit: data.init_credit,
      credit: data.credit,
      percent: data.percent,
      notes: data.notes,
      updated_by: user.username,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تعطيل الحساب بنجاح`);
          navigate(`/control/account`);
        } else {
          toast.error(`خطأ بالعملية`);
        }
      })
      .catch(() => {
        toast.error(`خطأ أثناء العملية`);
      });
  };

  // Activate again ... - إعادة تفعيل الحساب المعطل
  const reactivate = (data) => {
    AxiosInstance.put(`account/${id}/`, {
      isActive: true,
      archived_at: dayjs(),
      account_type: data.account_type,
      company: data.company,
      name: data.name,
      address: data.address,
      phone1: data.phone1,
      phone2: data.phone2,
      init_credit: data.init_credit,
      credit: data.credit,
      percent: data.percent,
      notes: data.notes,
      updated_by: user.username,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تفعيل الحساب بنجاح`);
          navigate(`/control/account`);
        } else {
          toast.error(`خطأ بالعملية`);
        }
      })
      .catch(() => {
        toast.error(`خطأ أثناء العملية`);
      });
  };

  // delete account
  const destroy = async () => {
    if (confirm("تأكيد الحذف")) {
      let res = await AxiosInstance.delete(`account/${id}/`);
      if (res.status == 204) {
        toast.success(`تم حذف الحساب بنجاح`);
      } else {
        toast.error(`خطأ أثناء الحذف`);
      }
      navigate("/control/account");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="container-fluid">
            <div className="row">
              {/* User Info Card  */}
              <div className="col-md-7">
                <div className="modal-dialog" role="document">
                  <div className="modal-content rounded-4 shadow">
                    <div className="p-3 pb-4 border-bottom-0 text-center">
                      <h1 className="fw-bold mb-0 fs-2">
                        {account.name} | {account.credit} £
                      </h1>
                      {account.isActive == false && (
                        <h2 className="text-danger mt-1">حساب معطل</h2>
                      )}
                    </div>

                    <div className="modal-body p-5 pt-0">
                      <form>
                        <div className="row">
                          <div className="form-group col-md-6 mb-2">
                            <label
                              className="text-warning"
                              htmlFor="account_type"
                            >
                              نوع الحساب
                            </label>
                            <select
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.account_type && "is-invalid"
                              }`}
                              id="account_type"
                              name="account_type"
                              disabled={account.isActive == false && true}
                              {...register("account_type", {
                                required: "حقل مطلوب",
                              })}
                            >
                              {errors.account_type && (
                                <div role="alert" className="text-danger">
                                  {errors.account_type.message}
                                </div>
                              )}
                              {accountType.map((type) => (
                                <option key={type.id} defaultValue={type.name}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-6 mb-2">
                            <label className="text-warning" htmlFor="percent">
                              نسبة الخصم (%)
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.percent && "is-invalid"
                              }`}
                              id="percent"
                              name="percent"
                              disabled={account.isActive == false && true}
                              {...register("percent", {
                                max: {
                                  value: 100,
                                  message: "أقصى خصم 100%",
                                },
                              })}
                            />
                            {errors.percent && (
                              <div role="alert" className="text-danger">
                                {errors.percent.message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="form-group mb-2">
                          <label className="text-warning" htmlFor="name">
                            الإسم
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-lg rounded-3 mt-1 ${
                              errors.name && "is-invalid"
                            }`}
                            id="name"
                            name="name"
                            disabled={account.isActive == false && true}
                            {...register("name", {
                              required: "حقل مطلوب",
                              maxLength: {
                                value: 60,
                                message: "أقصى حد 60 حرف",
                              },
                            })}
                          />
                          {errors.name && (
                            <div role="alert" className="text-danger">
                              {errors.name.message}
                            </div>
                          )}
                        </div>
                        <div className="form-group mb-2">
                          <label className="text-warning" htmlFor="company">
                            الشركة
                          </label>
                          <select
                            className="form-control form-control-lg rounded-3 mt-1"
                            id="company"
                            name="company"
                            disabled={account.isActive == false && true}
                            {...register("company")}
                          >
                            <option defaultValue="">---</option>
                            {company.map((item) => (
                              <option key={item.id} defaultValue={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group mb-2">
                          <label className="text-warning" htmlFor="address">
                            العنوان
                          </label>
                          <input
                            type="text"
                            className={`form-control form-control-lg rounded-3 mt-1 ${
                              errors.address && "is-invalid"
                            }`}
                            id="address"
                            name="address"
                            disabled={account.isActive == false && true}
                            {...register("address", {
                              required: "حقل مطلوب",
                              maxLength: {
                                value: 100,
                                message: "أقصى حد 100 حرف",
                              },
                            })}
                          />
                          {errors.address && (
                            <div role="alert" className="text-danger">
                              {errors.address.message}
                            </div>
                          )}
                        </div>
                        <div className="row">
                          <div className="form-group mb-2 col-md-6">
                            <label className="text-warning" htmlFor="phone1">
                              تليفون 1
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.phone1 && "is-invalid"
                              }`}
                              id="phone1"
                              name="phone1"
                              disabled={account.isActive == false && true}
                              {...register("phone1", {
                                required: "حقل مطلوب",
                                maxLength: {
                                  value: 11,
                                  message: "أقصى حد 11 رقم",
                                },
                              })}
                            />
                            {errors.phone1 && (
                              <div role="alert" className="text-danger">
                                {errors.phone1.message}
                              </div>
                            )}
                          </div>
                          <div className="form-group mb-2 col-md-6">
                            <label className="text-warning" htmlFor="phone2">
                              تليفون 2
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3 mt-1"
                              id="phone2"
                              name="phone2"
                              disabled={account.isActive == false && true}
                              {...register("phone2")}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6 mb-2">
                            <label
                              className="text-warning"
                              htmlFor="init_credit"
                            >
                              رصيد أول المدة
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg rounded-3 mt-1"
                              id="init_credit"
                              name="init_credit"
                              disabled={account.isActive == false && true}
                              {...register("init_credit")}
                            />
                          </div>
                          <div className="form-group col-md-6 mb-2">
                            <label className="text-warning" htmlFor="credit">
                              الرصيد الحالى
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                account.credit < 0 && "text-danger"
                              }`}
                              id="credit"
                              name="credit"
                              disabled
                              defaultValue={`${account.credit} £`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-warning" htmlFor="notes">
                            ملاحظات
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg rounded-3 mt-1"
                            id="notes"
                            name="notes"
                            disabled={account.isActive == false && true}
                            {...register("notes")}
                          />
                        </div>
                        <hr className="my-4" />
                        <div className="d-flex justify-content-center">
                          {account.isActive ? (
                            <>
                              <button
                                onClick={handleSubmit(update)}
                                className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-primary"
                                type="submit"
                              >
                                تعديل
                              </button>
                              <button
                                className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-danger"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#confirmDeleteModal"
                              >
                                حذف
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={handleSubmit(reactivate)}
                                className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-success"
                                type="submit"
                              >
                                تفعيل الحساب
                              </button>
                              <button
                                className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-danger"
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#confirmDeleteModal"
                              >
                                حذف نهائياً
                              </button>
                            </>
                          )}
                        </div>
                        <small className="text-muted">
                          هذا الإجراء يتم على مسئولية المستخدم الحالى للنظام .
                        </small>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* account actions log  */}
              <div className="col-md-5">
                <h3 className="text-center mt-2">
                  آخر المعاملات <FaMoneyBill1Wave size={30} />
                </h3>
                <div className="list-group w-auto">
                  <Invoices byAccount accountID={account.id} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm delete account modal */}
      {account.isActive ? (
        <ConfirmDeleteModal
          object={account.name}
          deactivate={handleSubmit(deactivateAccount)}
          destroy={destroy}
          label={"حساب"}
        />
      ) : (
        <DeleteModal object={account.name} destroy={destroy} />
      )}
    </>
  );
};

export default EditAccount;
