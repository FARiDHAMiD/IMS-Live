import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../Components/AxiosInstance";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import AuthContext from "../../context/AuthContext";
import ConfirmDeleteModal from "../../Components/ConfirmDeleteModal";
import DeleteModal from "../../Components/DeleteModal";
import { FaFill, FaMoneyBillTransfer } from "react-icons/fa6";
import dayjs from "dayjs";
import { useTheme } from "../../context/ThemeProvider";

const EditStock = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  const { id } = useParams();
  let [stock, setStock] = useState([]);
  let [stockItems, setStockItems] = useState([]);
  let [users, setUsers] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  let totalPurchase = () =>
    stockItems
      .reduce((acc, item) => {
        return parseInt(
          acc +
            parseFloat(item.item_info.purchasing_price) *
              parseFloat(item.item_qty)
        );
      }, 0)
      .toLocaleString();

  let totalSelling = () =>
    stockItems
      .reduce((acc, item) => {
        return parseInt(
          acc +
            parseFloat(item.item_info.selling_price) * parseFloat(item.item_qty)
        );
      }, 0)
      .toLocaleString();

  // manage controlled and uncontrolled data
  const defaultValues = {
    name: "",
    keeper: "",
    location: "",
    credit: "",
    notes: "",
    isActive: "",
    updated_by: user.username,
  };

  // Use Form hook
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  let getStockItems = async () => {
    let response = await AxiosInstance.get(`stock-items/${id}/`);
    console.log(response.data);
    setStockItems(response.data);
  };

  let getUsers = async () => {
    let response = await AxiosInstance.get(`user/`);
    setUsers(response.data);
  };

  let getStock = async () => {
    let response = await AxiosInstance.get(`stock/${id}/`);
    setStock(response.data);
    setValue("name", response.data.name);
    setValue("keeper", response.data.keeper);
    setValue("location", response.data.location);
    setValue("notes", response.data.notes);
    setValue("isActive", response.data.isActive);
    setValue("credit", response.data.credit);
    setValue("updated_by", response.data.updated_by);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
    getStock();
    getStockItems();
  }, [setValue("keeper", stock.keeper)]);

  let editItem = (id) => {
    navigate(`/control/item/${id}`);
  };

  const update = (data) => {
    AxiosInstance.put(`stock/${id}/`, {
      name: data.name,
      location: data.location,
      keeper: data.keeper,
      credit: data.credit,
      notes: data.notes,
      isActive: data.isActive,
      updated_by: user.username,
      archived_at: dayjs().format(),
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تعديل المخزن بنجاح`);
        } else {
          toast.error(`خطأ بالتعديل`);
        }
        navigate(-1);
      })
      .catch(() => {
        toast.error(`خطأ بالتعديل`);
      });
  };

  // Deactivate - Archive Stock
  const deactivateStock = (data) => {
    AxiosInstance.put(`stock/${id}/`, {
      name: data.name,
      location: data.location,
      keeper: data.keeper,
      credit: data.credit,
      notes: data.notes,
      isActive: false,
      updated_by: user.username,
      archived_at: dayjs().format(),
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تعطيل المخزن بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالعملية`);
        }
      })
      .catch(() => {
        toast.error(`خطأ أثناء العملية`);
      });
  };

  // Activate again ... - إعادة تفعيل المخزن المعطل
  const reactivate = (data) => {
    AxiosInstance.put(`stock/${id}/`, {
      name: data.name,
      isActive: true,
      updated_by: user.username,
      archived_at: null,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تفعيل المخزن بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالعملية`);
        }
      })
      .catch(() => {
        toast.error(`خطأ أثناء العملية`);
      });
  };

  // delete stock
  const destroy = async () => {
    if (confirm("تأكيد الحذف")) {
      let res = await AxiosInstance.delete(`stock/${id}/`);
      if (res.status == 204) {
        toast.success(`تم حذف المخزن بنجاح`);
      } else {
        toast.error(`خطأ أثناء الحذف`);
      }
      navigate(-1);
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
              {/* Stock Card */}
              <div className="col-md-6">
                <div className="modal-dialog" role="document">
                  <div className="modal-content rounded-4 shadow">
                    <div className="p-3 pb-4 border-bottom-0 text-center">
                      <h1 className="fw-bold mb-0 fs-2">
                        {stock.name} |{" "}
                        {stock.credit.total &&
                          parseInt(stock.credit.total).toLocaleString()}{" "}
                        ج.م.
                      </h1>
                      {stock.isActive == false && (
                        <h2 className="text-danger mt-1">مخزن غير مفعل</h2>
                      )}
                    </div>
                    <div className="modal-body p-5 pt-0">
                      <form>
                        <div className="row">
                          <div className="form-group col-md-6 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="name"
                            >
                              إسم المخزن <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.name && "is-invalid"
                              }`}
                              id="name"
                              name="name"
                              disabled={stock.isActive == false && true}
                              {...register("name", {
                                max: {
                                  required: "حقل مطلوب",
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
                          <div className="form-group col-md-6 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="keeper"
                              style={{ fontSize: "small" }}
                            >
                              المسئول عن المخزن{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.keeper && "is-invalid"
                              }`}
                              id="keeper"
                              name="keeper"
                              disabled={stock.isActive == false && true}
                              {...register("keeper", {
                                required: "حقل مطلوب",
                              })}
                            >
                              {errors.keeper && (
                                <div role="alert" className="text-danger">
                                  {errors.keeper.message}
                                </div>
                              )}
                              {users.map((user) => (
                                <option key={user.id} defaultValue={user.name}>
                                  {user.username}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-12 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="location"
                            >
                              مكان المخزن (العنوان){" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.location && "is-invalid"
                              }`}
                              id="location"
                              name="location"
                              disabled={stock.isActive == false && true}
                              {...register("location", {
                                required: "حقل مطلوب",
                                maxLength: {
                                  value: 100,
                                  message: "أقصى حد 100 حرف",
                                },
                              })}
                            />
                            {errors.location && (
                              <div role="alert" className="text-danger">
                                {errors.location.message}
                              </div>
                            )}
                          </div>
                          <div className="form-group col-md-12 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="notes"
                            >
                              ملاحظات
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.notes && "is-invalid"
                              }`}
                              id="notes"
                              name="notes"
                              disabled={stock.isActive == false && true}
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
                          {stock.isActive && (
                            <div className="col-md-12 mt-2">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  name="isActive"
                                  {...register("isActive")}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="isActive"
                                >
                                  حالة المخزن (يعمل / لا يعمل)
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        <hr className="my-4" />
                        <div className="d-flex justify-content-center">
                          {stock.isActive ? (
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
                                تفعيل المخزن
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

              <div className="col-md-6">
                {/* stock content  */}
                <div className="col-md-12">
                  <h3 className="text-center mt-2">
                    محتويات المخزن <FaFill size={30} />
                  </h3>
                  <div className="text-center">
                    <table className="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className={
                              theme == "dark"
                                ? "text-warning"
                                : "text-light bg-primary"
                            }
                          >
                            الفئة
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == "dark"
                                ? "text-warning"
                                : "text-light bg-primary"
                            }
                          >
                            الصنف
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == "dark"
                                ? "text-warning"
                                : "text-light bg-primary"
                            }
                          >
                            الكمية
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == "dark"
                                ? "text-warning"
                                : "text-light bg-primary"
                            }
                          >
                            الشراء
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == "dark"
                                ? "text-warning"
                                : "text-light bg-primary"
                            }
                          >
                            البيع
                          </th>
                          <th
                            scope="col"
                            className={
                              theme == "dark"
                                ? "text-warning"
                                : "text-light bg-primary"
                            }
                          >
                            إجمالى
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockItems.map((item) => (
                          <tr
                            onClick={() => editItem(item.item_info.id)}
                            key={item.item_info.id}
                          >
                            <td className="">{item.item_info.cat__name}</td>
                            <td>{item.item_info.name}</td>
                            <td>
                              {parseFloat(item.item_qty).toFixed(1)}{" "}
                              {item.item_info.scale_unit__name}
                            </td>
                            <td>{item.item_info.purchasing_price}</td>
                            <td>{item.item_info.selling_price}</td>
                            <td>
                              {(
                                item.item_info.selling_price * item.item_qty
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Total purchasing  */}
                    <div className="row">
                      <div className="col-md-8 col-8">
                        <div className="card">
                          <h5 className="">إجمالى رصيد المخزن شراء:</h5>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="card">
                          <h5
                            className={
                              theme == "dark" ? "text-warning" : "text-navy"
                            }
                          >
                            {totalPurchase()} ج.م.
                          </h5>
                        </div>
                      </div>
                    </div>
                    {/* Total selling  */}
                    <div className="row">
                      <div className="col-md-8 col-8">
                        <div className="card">
                          <h5 className="">إجمالى رصيد المخزن بيع:</h5>
                        </div>
                      </div>
                      <div className="col-md-4 col-4">
                        <div className="card">
                          <h5
                            className={
                              theme == "dark" ? "text-warning" : "text-navy"
                            }
                          >
                            {totalSelling()} ج.م.
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* last actions  */}
                  <div className="col-md-12 mt-4">
                    <div className="card">
                      <h3 className="text-center mt-2">
                        آخر الحركات <FaMoneyBillTransfer size={30} />
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm delete stock modal */}
      {stock.isActive ? (
        <ConfirmDeleteModal
          object={stock.name}
          deactivate={handleSubmit(deactivateStock)}
          destroy={destroy}
          label={"مخزن"}
        />
      ) : (
        <DeleteModal object={stock.name} destroy={destroy} label={"مخزن"} />
      )}
    </>
  );
};

export default EditStock;
