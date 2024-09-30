import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import { FaStore } from "react-icons/fa6";

const CreateStock = () => {
  let { user } = useContext(AuthContext);
  let [users, setUsers] = useState([]);
  const [checked, setChecked] = useState(true);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  let getUsers = async () => {
    let response = await AxiosInstance.get(`user`);
    setUsers(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  // manage controlled and uncontrolled data
  const defaultValues = {
    name: "",
    keeper: "",
    location: "",
    credit: "",
    notes: "",
    isActive: "",
    created_by: user.username,
    archived_at: "",
  };

  // Use Form hook
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  // checkbox handleChange true, false
  const handleActiveChange = (e) => {
    e.persist();
    setChecked((prevState) => !prevState);
  };

  const create = (data) => {
    AxiosInstance.post(`stock/`, {
      name: data.name,
      location: data.location,
      keeper: data.keeper,
      credit: data.credit,
      notes: data.notes,
      isActive: data.isActive,
      created_by: user.user_id,
      updated_by: null,
      archived_at: null,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تسجيل مخزن جديد بنجاح`);
        } else {
          toast.error(`خطأ بالتسجيل`);
        }
        navigate(`/control/stock`);
      })
      .catch(() => {
        toast.error(`خطأ بالتسجيل`);
      });
  };

  return (
    <>
      <div className="container">
        <div className="modal-dialog" role="document">
          <div className="modal-content rounded-4 shadow">
            <div className="p-3 pb-4 border-bottom-0 text-center">
              <h1 className="fw-bold mb-0 fs-2 text-green">
                تسجيل مخزن لأول مرة <FaStore size={30} />
              </h1>
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <div className="modal-body p-5 pt-0">
                <form>
                  <div className="row">
                    <div className="form-group mb-2 col-md-4">
                      <label className="text-warning" htmlFor="name">
                        إسم المخزن *
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
                    <div className="form-group mb-2 col-md-5">
                      <label className="text-warning" htmlFor="location">
                        مكان المخزن (العنوان) *
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg rounded-3 mt-1 ${
                          errors.location && "is-invalid"
                        }`}
                        id="location"
                        name="location"
                        {...register("location", {
                          required: "حقل مطلوب",
                          maxLength: {
                            value: 60,
                            message: "أقصى حد 60 حرف",
                          },
                        })}
                      />
                      {errors.location && (
                        <div role="alert" className="text-danger">
                          {errors.location.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-2 col-md-3">
                      <label className="text-warning mb-1" htmlFor="keeper">
                        أمين المخزن *
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="keeper"
                        name="keeper"
                        {...register("keeper")}
                      >
                        <option defaultValue="">اختر...</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.username}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                      {errors.keeper && (
                        <div role="alert" className="text-danger">
                          {errors.keeper.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-2 col-md-5">
                      <label className="text-warning" htmlFor="credit">
                        الرصيد
                      </label>
                      <input
                        type="number"
                        placeholder="Later will be calculated automatically"
                        className={`form-control form-control-lg rounded-3 mt-1 ${
                          errors.credit && "is-invalid"
                        }`}
                        id="credit"
                        name="credit"
                        {...register("credit", {
                          required: "حقل مطلوب",
                          maxLength: {
                            value: 60,
                            message: "أقصى حد 60 حرف",
                          },
                        })}
                      />
                      {errors.credit && (
                        <div role="alert" className="text-danger">
                          {errors.credit.message}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-2 col-md-7">
                      <label className="text-warning" htmlFor="notes">
                        ملاحظات
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg rounded-3 mt-1 ${
                          errors.notes && "is-invalid"
                        }`}
                        id="notes"
                        name="notes"
                        {...register("notes", {
                          maxLength: {
                            value: 100,
                            message: "أقصى حد 100 حرف",
                          },
                        })}
                      />
                      {errors.notes && (
                        <div role="alert" className="text-danger">
                          {errors.notes.message}
                        </div>
                      )}
                    </div>
                    <div className="col-md-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="isActive"
                          checked={checked}
                          onClick={handleActiveChange}
                          {...register("isActive")}
                        />
                        <label className="form-check-label" htmlFor="isActive">
                          حالة المخزن (يعمل / لا يعمل)
                        </label>
                      </div>
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
    </>
  );
};

export default CreateStock;
