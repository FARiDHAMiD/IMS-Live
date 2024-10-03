import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import { FaPencil } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeProvider";

const CreateAccount = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
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
    percent: 0,
    init_credit: 0,
    credit: 0,
    notes: "",
  };

  // Use Form hook
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  let getAccountType = async () => {
    let response = await AxiosInstance.get(`accountType`);
    setAccountType(response.data);
    console.log(response.data);
  };

  let getCompany = async () => {
    let response = await AxiosInstance.get(`company`);
    setCompany(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getAccountType();
    getCompany();
  }, []);

  const create = (data) => {
    AxiosInstance.post(`account/`, {
      account_type: data.account_type,
      company: data.company,
      name: data.name,
      address: data.address,
      phone1: data.phone1,
      phone2: data.phone2,
      init_credit: data.init_credit,
      credit: 0,
      percent: data.percent,
      notes: data.notes,
      archived_at: null,
      updated_by: null,
      created_by: user.user_id,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تسجيل حساب جديد بنجاح`);
        } else {
          toast.error(`خطأ بالتسجيل`);
        }
        navigate(`/control/account`);
      })
      .catch(() => {
        toast.error(`خطأ بالتسجيل`);
      });
  };

  return (
    <div className="container">
      <div className="modal-dialog" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="p-3 pb-4 border-bottom-0 text-center">
            <h1
              className={`fw-bold mb-0 fs-2 ${
                theme == "dark" ? "text-green" : "text-navy"
              }`}
            >
              تسجيل حساب لأول مرة <FaPencil size={30} />
            </h1>
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="modal-body p-5 pt-0">
              <form>
                <div className="row">
                  <div className="form-group mb-2 col-md-5">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="name"
                    >
                      الإسم <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.name && "is-invalid"
                      }`}
                      id="name"
                      name="name"
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

                  <div className="form-group mb-2 col-md-7">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="address"
                    >
                      العنوان <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.address && "is-invalid"
                      }`}
                      id="address"
                      name="address"
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

                  <div className="form-group mb-2 col-md-4">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="company"
                    >
                      الشركة
                    </label>
                    <select
                      className="form-control form-control-lg rounded-3 mt-1"
                      id="company"
                      name="company"
                      {...register("company")}
                    >
                      <option value="">---</option>
                      {company.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-2 col-md-4">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="phone1"
                    >
                      تليفون 1 <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.phone1 && "is-invalid"
                      }`}
                      id="phone1"
                      name="phone1"
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
                  <div className="form-group mb-2 col-md-4">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="phone2"
                    >
                      تليفون 2
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 mt-1"
                      id="phone2"
                      name="phone2"
                      {...register("phone2", {
                        maxLength: {
                          value: 11,
                          message: "أقصى حد 11 رقم",
                        },
                      })}
                    />
                  </div>

                  <div className="form-group col-md-4 mb-2">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="account_type"
                    >
                      نوع الحساب <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.account_type && "is-invalid"
                      }`}
                      id="account_type"
                      name="account_type"
                      {...register("account_type", {
                        required: "حقل مطلوب",
                      })}
                    >
                      <option value="">---</option>
                      {accountType.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errors.account_type && (
                      <div role="alert" className="text-danger">
                        {errors.account_type.message}
                      </div>
                    )}
                  </div>
                  <div className="form-group col-md-4 mb-2">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="percent"
                    >
                      نسبة الخصم (%)
                    </label>
                    <input
                      type="number"
                      className={`form-control form-control-lg rounded-3 mt-1 ${
                        errors.percent && "is-invalid"
                      }`}
                      id="percent"
                      name="percent"
                      {...register("percent", {
                        max: {
                          value: 100,
                          message: "أقصى حد للخصم 100%",
                        },
                      })}
                    />
                    {errors.percent && (
                      <div role="alert" className="text-danger">
                        {errors.percent.message}
                      </div>
                    )}
                  </div>
                  <div className="form-group col-md-4 mb-2">
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="init_credit"
                    >
                      رصيد أول المدة (بالجنيه)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 mt-1"
                      id="init_credit"
                      name="init_credit"
                      {...register("init_credit")}
                    />
                  </div>
                  <div>
                    <label
                      className={theme == "dark" ? "text-warning" : "text-navy"}
                      htmlFor="notes"
                    >
                      ملاحظات
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 mt-1"
                      id="notes"
                      name="notes"
                      {...register("notes", {
                        maxLength: {
                          value: 100,
                          message: "أقصى حد 100 حرف",
                        },
                      })}
                    />
                  </div>
                </div>

                <hr className="my-4" />
                <div className="d-flex justify-content-center">
                  <button
                    onClick={handleSubmit(create)}
                    className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-primary"
                    type="submit"
                  >
                    حفظ
                  </button>
                  <button
                    className="col-5 m-2 mb-2 btn btn-lg rounded-3 btn-secondary"
                    type="reset"
                  >
                    إعادة
                  </button>
                </div>
                <small className="text-muted">
                  هذا الإجراء يتم على مسئولية المستخدم الحالى للنظام .
                </small>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
