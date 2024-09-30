import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import AuthContext from "../../context/AuthContext";
import RequestDeleteModal from "../../Components/RequestDeleteModal";

const EditProfile = () => {
  let { user, logoutUser } = useContext(AuthContext);
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
        toast.error(`خطأ بالتعديل ` + error.response.data['password']);
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
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="account-settings">
                      <div className="user-profile">
                        <div className="user-avatar">
                          <img
                            src={`http://127.0.0.1:8000${profile.image}`}
                            alt="Profile Pic"
                          />
                        </div>
                        <h5 className="user-name">{profile.full_name}</h5>
                        <h6 className="">{profile.credit} EGP</h6>
                        <h6 className="user-email">{user.username}@</h6>
                      </div>
                      <div className="text-center">
                        <div className="row">
                          <div className="col-6">
                            <button
                              className="btn btn-success w-100"
                              onClick={handleSubmit(update)}
                            >
                              حفظ
                            </button>
                          </div>
                          <div className="col-6">
                            <button
                              className="btn btn-danger w-100"
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#requestDeleteModal"
                            >
                              حذف
                            </button>
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
                    <div className="row gutters">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <h5 className="mb-3 text-primary">البيانات الأساسية</h5>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="full_name" className="text-warning">
                            الإسم بالكامل *
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
                          <label htmlFor="address" className="text-warning">
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
                          <label htmlFor="phone" className="text-warning">
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
                          <label htmlFor="image" className="text-warning">
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
                          <label htmlFor="notes" className="text-warning">
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
                    </div>
                    {/* edit password  */}
                    <div className="card my-2">
                      <div className="card-header">تعديل كلمة المرور</div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 col-12 my-1">
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              placeholder="كلمة المرور الجديدة"
                              {...register("password", {
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
                              {...register("password2", {
                                required: "حقل مطلوب",
                              })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-end">
                        <button
                          className="btn btn-outline-info"
                          onClick={handleSubmit(changePassword)}
                        >
                          تغيير كلمة المرور
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
