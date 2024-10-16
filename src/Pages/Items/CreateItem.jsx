import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../Components/Spinner";
import dayjs from "dayjs";
import { useTheme } from "../../context/ThemeProvider";

const CreateItem = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [unit, setUnit] = useState([]);
  let [stock, setStock] = useState([]);
  let [cat, setCat] = useState([]);
  let [type, setType] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  // Generate barcode function and onClick
  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  // handle click on generate barcode
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
    created_by: user.username,
  };

  // Use Form hook
  const {
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

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
    setLoading(false);
  };

  useEffect(() => {
    getStock();
    getCat();
    getType();
    getUnit();
  }, []);

  const create = (data) => {
    AxiosInstance.post(`item/`, {
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
      created_by: user.username,
      stock: data.stock,
      notes: data.notes,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم تسجيل صنف جديد بنجاح`);
        } else {
          toast.error(`خطأ بالتسجيل`);
        }
        reset();
      })
      .catch(() => {
        toast.error(`خطأ بالتسجيل`);
      });
  };

  return (
    <div className="d-flex justify-content-center">
      {/* Add Item Card */}
      <div className="col-md-9">
        <div className="modal-dialog" role="document">
          <div className="modal-content rounded-4 shadow">
            <div className="p-3 pb-4 border-bottom-0 text-center">
              <h1
                className={`fw-bold mb-0 fs-2 ${
                  theme == "dark" ? "text-green" : "text-navy"
                }`}
              >
                تسجيل صنف لأول مرة
              </h1>
            </div>
            <div className="modal-body p-5 pt-0">
              {loading ? (
                <Spinner />
              ) : (
                <>
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
                          الوحدة الكبرى <span className="text-danger">*</span>
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
                          الوحدة الصغرى <span className="text-danger">*</span>
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
                            <option key={itemType.id}>{itemType.name}</option>
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
                          متواجد بأي مخزن <span className="text-danger">*</span>
                        </label>
                        <select
                          multiple
                          className={`form-control form-control-lg rounded-3 mt-1 ${
                            errors.stock && "is-invalid"
                          }`}
                          id="stock"
                          name="stock"
                          {...register("stock", {
                            required: true,
                          })}
                        >
                          {stock.map((stock) => (
                            <option key={stock.id}>{stock.name}</option>
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
                      هذا الإجراء يتم على مسئولية المستخدم الحالى للنظام
                    </small>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
