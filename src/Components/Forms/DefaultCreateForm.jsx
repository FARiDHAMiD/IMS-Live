import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AxiosInstance from "../AxiosInstance";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeProvider";

const DefaultCreateForm = () => {
  let { theme } = useTheme();
  const location = useLocation();
  let navigate = useNavigate();

  // state passed from previous page
  let page = location.state.url;
  let label = location.state.label;

  // manage controlled and uncontrolled data
  const defaultValues = {
    name: "",
    notes: "",
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  const submmision = (data) => {
    AxiosInstance.post(`${page}/`, {
      name: data.name,
      notes: data.notes,
    })
      .then((res) => {
        if (res.status == 200) {
          toast.success(`تم إضافة ل${label} بنجاح`);
        } else {
          toast.error(`خطأ بالتسجيل`);
        }
        // navigate(`/control/${page}`);
        reset();
      })
      .catch(() => {
        toast.error(`خطأ بالتسجيل`);
      });
  };

  return (
    <div className=" mt-2 container">
      <h2 className="text-center">
        إضافة{" "}
        <span className={theme == "dark" ? "text-green" : "text-navy"}>
          {label}
        </span>
      </h2>
      <form onSubmit={handleSubmit(submmision)}>
        <div className="form-group">
          <label
            className={theme == "dark" ? "text-warning" : "text-navy"}
            htmlFor="name"
          >
            {label}
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            aria-invalid={errors.name ? "true" : "false"}
            {...register("name", {
              required: "حقل مطلوب",
              maxLength: {
                value: 50,
                message: "أقصى حد 50 حرف",
              },
            })}
          />
          {errors.name && (
            <p role="alert" className="text-danger">
              {errors.name.message}
            </p>
          )}
          <small id="textHelp" className="form-text text-muted">
            هذا البيان قد يؤثر على نسب التقارير للنظام .
          </small>
        </div>
        <div className="form-group mt-2 mb-2">
          <label
            className={theme == "dark" ? "text-warning" : "text-navy"}
            htmlFor="notes"
          >
            ملاحظات
          </label>
          <input
            type="text"
            className="form-control"
            name="notes"
            {...register("notes", {
              maxLength: {
                value: 100,
                message: "أقصى حد 100 حرف",
              },
            })}
          />
          {errors.notes && (
            <p role="alert" className="text-danger">
              {errors.notes.message}
            </p>
          )}
        </div>
        <div style={{ textAlignLast: "left" }} className="mb-4">
          {page == "invoiceType" ? (
            <Link to={"/working"} className="btn btn-warning m-1">
              مراجعة مع الأدمن
            </Link>
          ) : (
            <button type="submit" className="btn btn-primary m-1">
              تأكيد
            </button>
          )}
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default DefaultCreateForm;
