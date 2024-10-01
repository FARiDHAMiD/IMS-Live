import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import AuthContext from "../../context/AuthContext";
import RequestDeleteModal from "../../Components/RequestDeleteModal";
import { useTheme } from "../../context/ThemeProvider";

const EditProfile = () => {
  let { user, logoutUser } = useContext(AuthContext);
  let { theme } = useTheme();
  const { id } = useParams();
  let [profile, setProfile] = useState([]);
  let [loading, setLoading] = useState(true);
  const [picture, setPicture] = useState([]);
  let navigate = useNavigate();

  let changePassword = (data) => {
    AxiosInstance.patch(`user/${user.user_id}/`, {
      // username: user.username,
      password: data.password,
      password2: data.password2,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تغيير كلمة المرور بنجاح`);
          logoutUser();
        } else {
          toast.error(`خطأ بالتعديل`);
        }
      })
      .catch((error) => {
        toast.error(`خطأ بالتعديل ` + error.response.data["password"]);
      });
  };

  // manage controlled and uncontrolled data
  const defaultValues = {
    full_name: "",
    address: "",
    phone: "",
    credit: "",
    image: "",
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

  // Use Form hook
  const { handleSubmit: handleSubmitPassword, register: registerPassword } =
    useForm({
      changePassword: changePassword,
    });

  // retrieve profile by id
  let getProfile = async () => {
    let response = await AxiosInstance.get(`profile/${user.profile}/`);
    setValue("full_name", response.data.full_name);
    setValue("address", response.data.address);
    setValue("phone", response.data.phone);
    setValue("credit", response.data.credit);
    setValue("notes", response.data.notes);
    setProfile(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const update = (data) => {
    AxiosInstance.put(`profile/${user.profile}/`, {
      full_name: data.full_name,
      address: data.address,
      phone: data.phone,
      image: picture.name,
      notes: data.notes,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تعديل المستخدم بنجاح`);
          navigate(`/profile/${id}/`);
        } else {
          toast.error(`خطأ بالتعديل`);
        }
      })
      .catch((error) => {
        toast.error(`خطأ بالتعديل` + error.response["data"]["image"]);
      });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="container mt-4">
            <div className="row gutters">
              {/* Profile Card Info  */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 mb-2">
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
                        <h3 className="user-name">{profile.full_name}</h3>
                        <h4
                          className={
                            theme == `dark` ? "text-info" : "text-navy"
                          }
                        >
                          {profile.credit.toLocaleString()} EGP
                        </h4>
                        <h5 className="user-email">{user.username}@</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Actions  */}
              <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="row gutters">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <h5
                          className={
                            theme == `dark`
                              ? `mb-3 text-info`
                              : `mb-3 text-navy`
                          }
                        >
                          البيانات الأساسية
                        </h5>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label
                            htmlFor="full_name"
                            className={theme == `dark` && `text-warning`}
                          >
                            الإسم بالكامل <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control mt-1"
                            id="full_name"
                            name="full_name"
                            {...register("full_name", {
                              required: "حقل مطلوب",
                              max: {
                                value: 60,
                                message: "أقصى حد 60 حرف",
                              },
                            })}
                          />
                          {errors.full_name && (
                            <div role="alert" className="text-danger">
                              {errors.full_name.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label
                            htmlFor="address"
                            className={theme == `dark` && `text-warning`}
                          >
                            العنوان
                          </label>
                          <input
                            type="text"
                            className="form-control mt-1"
                            id="address"
                            name="address"
                            {...register("address", {
                              max: {
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
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label
                            htmlFor="phone"
                            className={theme == `dark` && `text-warning`}
                          >
                            التليفون
                          </label>
                          <input
                            type="text"
                            className="form-control mt-1"
                            id="phone"
                            name="phone"
                            {...register("phone", {
                              maxLength: {
                                value: 11,
                                message: "أقصى حد 11 رقم",
                              },
                            })}
                          />
                          {errors.phone && (
                            <div role="alert" className="text-danger">
                              {errors.phone.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label
                            htmlFor="image"
                            className={theme == `dark` && `text-warning`}
                          >
                            صورة شخصية
                          </label>
                          <input
                            type="file"
                            className="form-control mt-1"
                            accept="image/png, image/jpeg"
                            onChange={(e) => {
                              setPicture(e.target.files[0]);
                            }}
                          />
                          {errors.image && (
                            <div role="alert" className="text-danger">
                              {errors.image.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label
                            htmlFor="notes"
                            className={theme == `dark` && `text-warning`}
                          >
                            ملاحظات
                          </label>
                          <input
                            type="text"
                            className="form-control mt-1"
                            id="notes"
                            name="notes"
                            {...register("notes", {
                              max: {
                                required: "حقل مطلوب",
                                value: 100,
                                message: "أقصى حد 60 حرف",
                              },
                            })}
                          />
                          {errors.notes && (
                            <div role="alert" className="text-danger">
                              {errors.notes.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center my-1">
                        <div className="row d-flex justify-content-end">
                          <div className="col-md-3 col-6">
                            <button
                              className="btn btn-success w-100"
                              onClick={handleSubmit(update)}
                            >
                              حفظ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* edit password  */}
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h4 className="accordion-header" id="headingOne">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="false"
                            aria-controls="collapseOne"
                          >
                            تغيير كلمة المرور
                          </button>
                        </h4>
                        <div
                          id="collapseOne"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingOne"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="card my-2">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6 col-12 my-1">
                                  <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="كلمة المرور الجديدة"
                                    {...registerPassword("password", {
                                      required: "حقل مطلوب",
                                    })}
                                  />
                                </div>
                                <div className="col-md-6 col-12 my-1">
                                  <input
                                    type="password"
                                    name="password2"
                                    className="form-control"
                                    placeholder="تأكيد كلمة المرور"
                                    {...registerPassword("password2", {
                                      required: "حقل مطلوب",
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                              <button
                                className={
                                  theme == `dark`
                                    ? `btn btn-outline-info`
                                    : `btn btn-outline-danger`
                                }
                                onClick={handleSubmitPassword(changePassword)}
                              >
                                تغيير كلمة المرور
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-5">
                      <div className="col-md-3 col-6">
                        <button
                          className="btn btn-danger w-100"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#requestDeleteModal"
                        >
                          حذف نهائى
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <RequestDeleteModal object={profile.full_name} label={"المستخدم"} />
    </>
  );
};

export default EditProfile;
