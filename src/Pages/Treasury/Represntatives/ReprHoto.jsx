import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTheme } from "../../../context/ThemeProvider";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import AxiosInstance from "../../../Components/AxiosInstance";
import { FaRegSave } from "react-icons/fa";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import AuthContext from "../../../context/AuthContext";

const ReprHoto = () => {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  let [profiles, setProfiles] = useState([]);
  let navigate = useNavigate();
  const [reprItems, setReprItems] = useState([]);
  let [oneItem, setOneItem] = useState([]);
  let [items, setItems] = useState([]);

  let get_profiles = async () => {
    let response = await AxiosInstance.get(`profile`);
    setProfiles(response.data);
  };

  let getItems = async () => {
    let response = await AxiosInstance.get(`item`);
    setItems(response.data);
  };

  // delete reprItem row
  const handleRowDel = (item) => {
    const updatedItems = reprItems.filter((i) => i.id !== item.id);
    setReprItems(updatedItems);
  };

  // add new row
  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      item_id: "",
      stock_id: "",
      price: 1.0,
      qty: 1,
    };
    setReprItems([...reprItems, newItem]);
  };

  // edit field in row
  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;
    const updatedItems = reprItems.map((item) => {
      if (item.id === id) {
        return { ...item, [name]: value };
      } else {
        return item;
      }
    });
    setReprItems(updatedItems);
  };

  useEffect(() => {
    get_profiles();
    getItems();
  }, [oneItem]);

  const defaultValues = {
    profile: "",
    time: "",
    notes: "",
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  let save = (data) => {
    if (reprItems.map((item) => item.name)[0] == "" || reprItems.length < 1) {
      toast.error(`يجب تسجيل صنف عالأقل`);
    } else {
      try {
        // check duplicate invoice items
        let array = reprItems.map((itm) => itm.name);
        const duplicates = array.filter(
          (item, index) => array.indexOf(item) !== index
        );
        if (duplicates.length == 0) {
          AxiosInstance.post(`repr/`, {
            profile: data.profile,
            time: data.time,
            notes: data.notes,
            created_by: user.username,
            reviewed_by: null,
            items: items,
          })
            .then((res) => {
              for (let i = 0; i < reprItems.length; i++) {
                let items_data = {
                  // repr: // try to get last repr id ; handled from backend
                  item: reprItems.map((itm) => parseInt(itm.name))[i], // item id
                  stock: reprItems.map((itm) => parseInt(itm.stock_id))[i],
                  price: reprItems.map((itm) => parseInt(itm.price))[i],
                  qty: reprItems.map((itm) => parseInt(itm.qty))[i],
                };
                // store repr items *** need fixes
                AxiosInstance.post(`storeReprItems/`, items_data);
              }
              if (res.status === 200) {
                toast.success(`تم تسجيل تسليم عهدة بنجاح`);
                navigate("/control/PendingRepr");
              } else {
                toast.error(`خطأ بالتسجيل`);
              }
            })
            .catch(() => {
              toast.error(`خطأ بالتسجيل`);
            });
        } else {
          toast.error(`خطأ بأصناف مكررة ...`);
        }
      } catch (error) {
        toast.error(`خطأ بالتسجيل`, error);
      }
    }
  };

  return (
    <div className="container my-2">
      <div className="row my-1">
        <div className="col-10">
          <h3 className={theme == "dark" ? "text-green" : "text-navy"}>
            تسليم / تسلم عهدة مندوب
          </h3>
        </div>
        <div className="col-2 d-flex justify-content-end">
          <Link
            to={-1}
            className={
              theme == "dark" ? "btn btn-outline-light" : "btn btn-outline-dark"
            }
          >
            <FaArrowLeft />
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 col-12">
          <label
            className={theme == "dark" ? "text-warning" : "text-navy"}
            htmlFor="time"
          >
            المندوب
          </label>
          <select
            className={`form-select ${errors.profile && "is-invalid"}`}
            name="profile"
            id="profile"
            {...register("profile", {
              required: true,
            })}
          >
            <option value="">---</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.full_name}>
                {profile.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 col-12">
          <label
            className={theme == "dark" ? "text-warning" : "text-navy"}
            htmlFor="time"
          >
            توقيت التسليم
          </label>
          <input
            type="text"
            onFocus={(e) => (e.target.type = "datetime-local")}
            onBlur={(e) => (e.target.type = "text")}
            name="time"
            id="time"
            className={`form-control ${errors.time && "is-invalid"}`}
            {...register("time", {
              required: true,
              max: {
                value: dayjs().format(),
                message: "لا يمكن تسجيل توقيت قادم",
              },
            })}
          />
          {errors.time && (
            <div role="alert" className="text-danger">
              {errors.time.message}
            </div>
          )}
        </div>
        <div className="col-md-4 col-12">
          <label
            className={theme == "dark" ? "text-warning" : "text-navy"}
            htmlFor="notes"
          >
            ملاحظات
          </label>
          <input
            type="text"
            name="notes"
            id="notes"
            className={`form-control ${errors.notes && "is-invalid"}`}
            {...register("notes", {
              maxLength: {
                value: 100,
                message: "نص طويل جداً",
              },
            })}
          />
          {errors.notes && (
            <div role="alert" className="text-danger">
              {errors.notes.message}
            </div>
          )}
        </div>

        <hr className="my-2" />

        {/* Repr Items rows  */}
        <div className="modal-body">
          {reprItems.map((item, i) => (
            <div key={i} className="container-fluid row">
              {/* item name */}
              <div className="col-md-5 col-12 mb-1">
                <label
                  style={{ fontSize: "small" }}
                  className={theme == "dark" ? "text-info" : "text-navy"}
                >
                  الصنف
                </label>
                <select
                  name="name"
                  id={item.id}
                  onChange={onItemizedItemEdit}
                  value={item.name}
                  className="form-control form-control-sm"
                >
                  <option value="">---</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* item qty */}
              <div className="col-md-3 col-4 mb-1">
                <label
                  style={{ fontSize: "small" }}
                  className={theme == "dark" ? "text-info" : "text-navy"}
                >
                  الكمية
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="الكمية..."
                  name="qty"
                  value={item.qty}
                  id={item.id}
                  onChange={(e) =>
                    e.target.value <= 0 ? "" : onItemizedItemEdit(e)
                  }
                />
              </div>

              {/* item price */}
              <div className="col-md-3 col-4">
                <label
                  style={{ fontSize: "small" }}
                  className={theme == "dark" ? "text-info" : "text-navy"}
                >
                  السعر
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="السعر..."
                  name="price"
                  value={item.price}
                  id={item.name && item.id}
                  onChange={(e) =>
                    e.target.value <= 0 ? "" : onItemizedItemEdit(e)
                  }
                />
              </div>

              {/* Delete row  */}
              <div className="col-md-1 col-4 mt-4">
                <button
                  className="btn btn-sm btn-outline-danger"
                  style={{ float: "left" }}
                  onClick={() => handleRowDel(item)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {/* buttons  */}
          <div className="row">
            <div className=" mb-1 d-flex justify-content-center mt-1">
              <button
                className={
                  theme == "dark"
                    ? "btn btn-outline-light"
                    : "btn btn-outline-dark"
                }
                onClick={handleAddEvent}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button onClick={handleSubmit(save)} className="btn btn-primary my-2">
            حفظ <FaRegSave size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReprHoto;
