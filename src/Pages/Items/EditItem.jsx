import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../Components/AxiosInstance";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import AuthContext from "../../context/AuthContext";
import ConfirmDeleteModal from "../../Components/ConfirmDeleteModal";
import DeleteModal from "../../Components/DeleteModal";
import dayjs from "dayjs";
import Barcode from "react-barcode";
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaChartSimple,
  FaCircleHalfStroke,
  FaPrint,
  FaFileInvoice,
  FaArrowRight,
  FaArrowLeft,
  FaRepeat,
  FaFillDrip,
  FaScroll,
} from "react-icons/fa6";
import { useTheme } from "../../context/ThemeProvider";

const EditItem = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  const { id } = useParams();
  let [item, setItem] = useState([]);
  let [unit, setUnit] = useState([]);
  let [stock, setStock] = useState([]);
  let [cat, setCat] = useState([]);
  let [type, setType] = useState([]);
  let [users, setUsers] = useState([]);
  let [loading, setLoading] = useState(true);
  let [itemLog, setItemLog] = useState([]);
  let [invoiceByItem, setInvoiceByItem] = useState([]);
  let navigate = useNavigate();

  // this Item changes log
  let getItemLog = async () => {
    let response = await AxiosInstance.get(`itemLog/${id}`);
    setItemLog(response.data);
  };

  let getInvoiceByItem = async () => {
    let response = await AxiosInstance.get(`invoiceByItemLimited/${id}`);
    setInvoiceByItem(response.data);
    setLoading(false);
  };

  // Generate barcode function and onClick
  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const handleClick = () => {
    const barcodeNumebr = document.getElementById("barcode");
    barcodeNumebr.value = randomNumberInRange(2000123456, 2000999999);
    barcodeNumebr.focus();
  };

  // manage controlled and uncontrolled data
  const defaultValues = {
    name: "",
    type: "",
    cat: "",
    scale_unit: "",
    small_unit: "",
    updated_by: "",
    stock: "",
    barcode: "",
    qty: "",
    small_in_large: "",
    min_limit: "",
    expire: "",
    status: "",
    purchasing_price: "",
    lowest_price: "",
    selling_price: "",
    retail_price: "",
    notes: "",
    last_order_time: "",
    isActive: "",
    created_at: "",
    updated_at: dayjs().format(),
    archived_at: "",
  };

  // Use Form hook
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  let getUsers = async () => {
    let response = await AxiosInstance.get(`user/`);
    setUsers(response.data);
  };

  let getStock = async () => {
    let response = await AxiosInstance.get(`stock/`);
    setStock(response.data);
  };

  let getUnit = async () => {
    let response = await AxiosInstance.get(`itemUnit/`);
    setUnit(response.data);
  };

  let getCat = async () => {
    let response = await AxiosInstance.get(`itemCat/`);
    setCat(response.data);
  };

  let getType = async () => {
    let response = await AxiosInstance.get(`itemType/`);
    setType(response.data);
  };

  let getItem = async () => {
    let response = await AxiosInstance.get(`item/${id}/`);
    setItem(response.data);
    setValue("name", response.data.name);
    setValue("qty", response.data.qty);
    setValue("scale_unit", response.data.scale_unit);
    setValue("small_unit", response.data.small_unit);
    setValue("barcode", response.data.barcode);
    setValue("small_in_large", response.data.small_in_large);
    setValue("type", response.data.type);
    setValue("cat", response.data.cat);
    setValue("purchasing_price", response.data.purchasing_price);
    setValue("lowest_price", response.data.lowest_price);
    setValue("selling_price", response.data.selling_price);
    setValue("retail_price", response.data.retail_price);
    setValue("min_limit", response.data.min_limit);
    setValue("expire", response.data.expire);
    setValue("stock", response.data.stock);
    setValue("notes", response.data.notes);
    setValue("isActive", response.data.isActive);
    setValue("last_order_by", response.data.last_order_by);
    setValue("last_order_time", response.data.last_order_time);
    setValue("created_by", response.data.created_by);
    setValue("created_at", response.data.created_at);
    setValue("updated_by", response.data.updated_by);
    setValue("updated_at", response.data.updated_at);
    setValue("archived_at", response.data.archived_at);
    setLoading(false);
  };

  useEffect(() => {
    getInvoiceByItem();
    getUsers();
    getStock();
    getCat();
    getType();
    getItem();
    getUnit();
    getItemLog();
  }, []);

  const update = (data) => {
    AxiosInstance.put(`item/${id}/`, {
      name: data.name,
      qty: data.qty,
      scale_unit: data.scale_unit,
      small_unit: data.small_unit,
      barcode: data.barcode,
      small_in_large: data.small_in_large,
      type: data.type,
      cat: data.cat,
      expire: data.expire || null,
      purchasing_price: data.purchasing_price,
      lowest_price: data.lowest_price,
      selling_price: data.selling_price,
      retail_price: data.retail_price,
      min_limit: data.min_limit,
      updated_by: user.username,
      updated_at: dayjs().format(),
      isActive: data.isActive,
      stock: data.stock,
      notes: data.notes,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تعديل الصنف بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالتعديل`);
        }
      })
      .catch(() => {
        toast.error(`خطأ بالتعديل`);
      });
  };

  // Deactivate - Archive Item
  const deactivateItem = (data) => {
    AxiosInstance.put(`item/${id}/`, {
      name: data.name,
      isActive: false,
      updated_by: user.username,
      archived_at: dayjs().format(),
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تعطيل الصنف بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالعملية`);
        }
      })
      .catch(() => {
        toast.error(`خطأ أثناء العملية`);
      });
  };

  // Activate again ... - إعادة تفعيل الصنف المعطل
  const reactivate = (data) => {
    AxiosInstance.put(`item/${id}/`, {
      name: data.name,
      isActive: true,
      updated_by: user.username,
      archived_at: null,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تفعيل الصنف بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالعملية`);
        }
      })
      .catch(() => {
        toast.error(`خطأ أثناء العملية`);
      });
  };

  // delete item
  const destroy = async () => {
    if (confirm("تأكيد الحذف")) {
      let res = await AxiosInstance.delete(`item/${id}/`);
      if (res.status == 204) {
        toast.success(`تم حذف الصنف بنجاح`);
      } else {
        toast.error(`خطأ أثناء الحذف`);
      }
      navigate("/control/item");
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
              {/* Edit Item Card */}
              <div className="col-md-8">
                <div className="modal-dialog" role="document">
                  <div className="modal-content rounded-4 shadow">
                    <div className="p-3 pb-4 border-bottom-0 text-center">
                      <h1 className="fw-bold mb-0 fs-2">
                        <div className="row">
                          <div className="col-md-4">
                            <Barcode
                              value={`${item.barcode}`}
                              height={35}
                              margin={5}
                              displayValue={false}
                            />
                          </div>
                          <div className="col-md-6 text-nowrap">
                            {item.name}
                            <br />
                            {item.selling_price &&
                              item.selling_price.toLocaleString()}{" "}
                            ج.م.
                          </div>
                          <div
                            onClick={() => {
                              alert("try to print...");
                            }}
                            className="col-md-1"
                            style={{ float: "left" }}
                          >
                            <FaPrint size={30} />
                          </div>
                        </div>
                      </h1>
                      {item.isActive == false && (
                        <h2 className="text-danger mt-1">صنف غير مفعل</h2>
                      )}
                    </div>
                    <div className="modal-body p-5 pt-0">
                      <form>
                        <div className="row">
                          {/* item name */}
                          <div className="form-group col-md-6 col-12 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="name"
                            >
                              إسم الصنف <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.name && "is-invalid"
                              }`}
                              id="name"
                              name="name"
                              {...register("name", {
                                required: true,
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

                          {/* qty  */}
                          {/* <div className="form-group col-md-2 col-4 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="qty"
                            >
                              الكمية <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.qty && "is-invalid"
                              }`}
                              id="qty"
                              name="qty"
                              {...register("qty", {
                                required: true,
                                validate: (value) => value > 0,
                              })}
                            />
                            {errors.qty && (
                              <div role="alert" className="text-danger">
                                {errors.qty.message}
                              </div>
                            )}
                          </div> */}

                          {/* scale unit */}
                          <div className="form-group col-md-3 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="scale_unit"
                            >
                              الوحدة الكبرى{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.scale_unit && "is-invalid"
                              }`}
                              id="scale_unit"
                              name="scale_unit"
                              {...register("scale_unit", {
                                required: true,
                              })}
                            >
                              {errors.scale_unit && (
                                <div role="alert" className="text-danger">
                                  {errors.scale_unit.message}
                                </div>
                              )}
                              <option></option>
                              {unit.map((unit) => (
                                <option key={unit.id}>{unit.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* small unit  */}
                          <div className="form-group col-md-3 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="small_unit"
                            >
                              الوحدة الصغرى{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.small_unit && "is-invalid"
                              }`}
                              id="small_unit"
                              name="small_unit"
                              {...register("small_unit", {
                                required: true,
                              })}
                            >
                              {errors.small_unit && (
                                <div role="alert" className="text-danger">
                                  {errors.small_unit.message}
                                </div>
                              )}
                              <option></option>
                              {unit.map((unit) => (
                                <option key={unit.id}>{unit.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* small in large */}
                          <div className="form-group col-md-4 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="small_in_large"
                            >
                              نسبة الوحدة الكبرى للصغرى{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.small_in_large && "is-invalid"
                              }`}
                              id="small_in_large"
                              name="small_in_large"
                              {...register("small_in_large", {
                                required: true,
                                min: {
                                  value: 1,
                                  message: "أدخل رقم صحيح",
                                },
                              })}
                            />
                            {errors.small_in_large && (
                              <div role="alert" className="text-danger">
                                {errors.small_in_large.message}
                              </div>
                            )}
                          </div>

                          {/* barcode  */}
                          <div className="form-group col-md-5 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="barcode"
                            >
                              باركود <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.barcode && "is-invalid"
                              }`}
                              id="barcode"
                              name="barcode"
                              {...register("barcode", {
                                required: true,
                                min: {
                                  value: 1,
                                  message: "أدخل رقم صحيح",
                                },
                                valueAsNumber: {
                                  value: true,
                                  message: "أدخل رقم صحيح",
                                },
                                unique: true,
                              })}
                            />
                            {errors.barcode && (
                              <div role="alert" className="text-danger">
                                {errors.barcode.message}
                              </div>
                            )}
                          </div>

                          {/* generate barcode button */}
                          <div className="form-group col-md-3 col-6 mb-2">
                            <button
                              type="button"
                              className={`btn btn-lg ${
                                theme == "dark"
                                  ? "btn-outline-light"
                                  : "btn-outline-dark"
                              } w-100 text-nowrap`}
                              style={{ marginTop: "28px" }}
                              onClick={handleClick}
                            >
                              إنشاء باركود
                            </button>
                          </div>

                          {/* type  */}
                          <div className="form-group col-md-4 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="type"
                            >
                              النوع <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.type && "is-invalid"
                              }`}
                              id="type"
                              name="type"
                              {...register("type", {
                                required: true,
                              })}
                            >
                              {errors.type && (
                                <div role="alert" className="text-danger">
                                  {errors.type.message}
                                </div>
                              )}
                              <option></option>
                              {type.map((itemType) => (
                                <option key={itemType.id}>
                                  {itemType.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* cat  */}
                          <div className="form-group col-md-4 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="cat"
                            >
                              الفئة <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.cat && "is-invalid"
                              }`}
                              id="cat"
                              name="cat"
                              {...register("cat", {
                                required: true,
                              })}
                            >
                              {errors.cat && (
                                <div role="alert" className="text-danger">
                                  {errors.cat.message}
                                </div>
                              )}
                              <option></option>
                              {cat.map((itemCat) => (
                                <option key={itemCat.id}>{itemCat.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* expire date */}
                          <div className="form-group col-md-4 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="expire"
                            >
                              تاريخ الصلاحية
                            </label>
                            <input
                              type="date"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.expire && "is-invalid"
                              }`}
                              id="expire"
                              name="expire"
                              {...register("expire", {
                                max: dayjs().add(5, "year").format(),
                                min: dayjs().subtract(1, "day").format(),
                              })}
                            />
                            {errors.expire && (
                              <div role="alert" className="text-danger">
                                {errors.expire.message}
                              </div>
                            )}
                          </div>

                          {/* purchase price */}
                          <div className="form-group col-md-3 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="purchasing_price"
                            >
                              سعر الشراء <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.purchasing_price && "is-invalid"
                              }`}
                              id="purchasing_price"
                              name="purchasing_price"
                              {...register("purchasing_price", {
                                required: true,
                                min: 1,
                              })}
                            />
                            {errors.purchasing_price && (
                              <div role="alert" className="text-danger">
                                {errors.purchasing_price.message}
                              </div>
                            )}
                          </div>

                          {/* lowest price */}
                          <div className="form-group col-md-3 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="lowest_price"
                            >
                              أقل سعر بيع <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.lowest_price && "is-invalid"
                              }`}
                              id="lowest_price"
                              name="lowest_price"
                              {...register("lowest_price", {
                                required: true,
                                validate: {
                                  max: (value) => {
                                    if (value > getValues("selling_price"))
                                      return "تأكد من سعر الجملة";
                                    return true;
                                  },
                                },
                                min: 1,
                              })}
                            />
                            {errors.lowest_price && (
                              <div role="alert" className="text-danger">
                                {errors.lowest_price.message}
                              </div>
                            )}
                          </div>

                          {/* selling price */}
                          <div className="form-group col-md-3 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="selling_price"
                            >
                              البيع جملة <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.selling_price && "is-invalid"
                              }`}
                              id="selling_price"
                              name="selling_price"
                              {...register("selling_price", {
                                required: true,
                                min: 1,
                              })}
                            />
                            {errors.selling_price && (
                              <div role="alert" className="text-danger">
                                {errors.selling_price.message}
                              </div>
                            )}
                          </div>

                          {/* retail price */}
                          <div className="form-group col-md-3 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="retail_price"
                            >
                              البيع قطاعى <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.retail_price && "is-invalid"
                              }`}
                              id="retail_price"
                              name="retail_price"
                              {...register("retail_price", {
                                required: true,
                                validate: {
                                  min: (value) => {
                                    if (value < getValues("selling_price"))
                                      return "تأكد من سعر الجملة";
                                    return true;
                                  },
                                },
                              })}
                            />
                            {errors.retail_price && (
                              <div role="alert" className="text-danger">
                                {errors.retail_price.message}
                              </div>
                            )}
                          </div>

                          {/* minimum limit of qty in stock */}
                          <div className="form-group col-md-3 col-12 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="min_limit"
                            >
                              أقل كمية <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.min_limit && "is-invalid"
                              }`}
                              id="min_limit"
                              name="min_limit"
                              {...register("min_limit", {
                                required: true,
                                min: 0,
                                max: 1000,
                              })}
                            />
                            {errors.min_limit && (
                              <div role="alert" className="text-danger">
                                {errors.min_limit.message}
                              </div>
                            )}
                          </div>

                          {/* stock  */}
                          {/* <div className="form-group col-md-9 col-6 mb-2">
                            <label
                              className={
                                theme == "dark" ? "text-warning" : "text-navy"
                              }
                              htmlFor="stock"
                            >
                              متواجد بأي مخزن{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              multiple
                              className={`form-control form-control-lg rounded-3 mt-1 ${
                                errors.stock && "is-invalid"
                              }`}
                              id="stock"
                              name="stock"
                              {...register("stock")}
                            >
                              {stock.map((stock) => (
                                <option key={stock.id} value={stock.id}>
                                  {stock.name}
                                </option>
                              ))}
                            </select>
                          </div> */}

                          {/* notes */}
                          <div className="form-group col-md-9 mb-2">
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
                        </div>

                        <hr className="my-4" />
                        <div className="d-flex justify-content-center">
                          {item.isActive ? (
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
                                تفعيل الصنف
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

              {/* Item related info   */}
              <div className="col-md-4">
                {/* quantity per stock */}
                <h3 className="text-center mt-2">
                  التوزيع <FaFillDrip size={30} />
                </h3>

                <table className="table table-hover table-bordered text-center">
                  <thead>
                    <tr>
                      <th
                        className={
                          theme == "dark"
                            ? " text-warning"
                            : " text-light bg-primary"
                        }
                      >
                        المخزن
                      </th>
                      <th
                        className={
                          theme == "dark"
                            ? " text-warning"
                            : " text-light bg-primary"
                        }
                      >
                        الكمية
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.stock &&
                      item.stock.map((itm) => (
                        <tr
                          key={itm.stock__name}
                          onClick={() =>
                            navigate(`/control/stock/${itm.stock}`)
                          }
                        >
                          <td>{itm.stock__name}</td>
                          <td>{parseFloat(itm.item_qty).toFixed(1)}</td>
                        </tr>
                      ))}
                    <tr>
                      <td
                        className={
                          theme == "dark"
                            ? "text-info"
                            : "text-light bg-primary"
                        }
                      >
                        إجمالى
                      </td>
                      <td
                        className={
                          theme == "dark"
                            ? "text-info"
                            : "text-light bg-primary"
                        }
                      >
                        {parseFloat(item.qty).toFixed(1) || 0}{" "}
                        {item.qty ? item.scale_unit : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <br />

                <h3 className="text-center mt-2">
                  تغييرات السعر <FaChartSimple size={30} />
                </h3>

                <div className="list-group w-auto">
                  {itemLog.map((item) => (
                    <a
                      key={item.id}
                      href="#"
                      className="list-group-item list-group-item-action d-flex gap-3 py-3"
                    >
                      {item.changes.selling_price ? (
                        <>
                          {item.changes.selling_price[0] >
                          item.changes.selling_price[1] ? (
                            <FaArrowTrendDown size={30} />
                          ) : (
                            <FaArrowTrendUp size={30} />
                          )}
                        </>
                      ) : (
                        <FaCircleHalfStroke size={25} />
                      )}
                      <div className="d-flex gap-2 w-100 justify-content-center">
                        <div>
                          <h6
                            className={
                              theme == "dark"
                                ? "mb-0 text-warning"
                                : "mb-0 text-navy"
                            }
                          >
                            {dayjs(item.timestamp).format("YYYY/MM/DD HH:mm")} |{" "}
                            {item.changed_by}@
                          </h6>
                          <p className="mb-0 opacity-75">
                            شراء: {item.purchase_changes}
                          </p>
                          <p className="mb-0 opacity-75">
                            جملة: {item.selling_changes}
                          </p>
                          <p className="mb-0 opacity-75">
                            قطاعى: {item.retail_changes}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <br />
                {/* latest invoices  */}
                <h3 className="text-center mt-2">
                  آخر الفواتير <FaFileInvoice size={30} />
                </h3>
                <div className="list-group w-auto">
                  {invoiceByItem.map((invoice) => (
                    <Link
                      key={invoice.id}
                      to={`/invoice/preview/${invoice.id}/`}
                      className="list-group-item list-group-item-action d-flex justify-content-center gap-3 py-3"
                    >
                      {invoice.type == `بيع` ? (
                        <FaArrowRight className="text-success" size={20} />
                      ) : (
                        <FaArrowLeft size={20} />
                      )}
                      <div className="text-center">
                        <h6>
                          {invoice.type} | {invoice.total.toLocaleString()} ج.م.
                          <br />
                          <span className=" mt-1">
                            {dayjs(invoice.invoice_time).format(`YY/MM/DD`)} |{" "}
                            {invoice.invoice_by}@
                          </span>
                          <br />
                          <span>{invoice.account}</span>
                        </h6>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/control/invoiceByItem/${id}`}
                  className="list-group-item list-group-item-action d-flex gap-3 py-3 justify-content-center"
                >
                  المزيد ... <FaScroll size={20} />
                </Link>
              </div>
            </div>
            {item.isActive ? (
              <ConfirmDeleteModal
                object={item.name}
                deactivate={handleSubmit(deactivateItem)}
                destroy={destroy}
                label={"صنف"}
              />
            ) : (
              <DeleteModal object={item.name} destroy={destroy} label={"صنف"} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default EditItem;
