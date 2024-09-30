import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AxiosInstance from "../AxiosInstance";
import { toast } from "react-toastify";

const DefaultCreateForm = () => {
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
        navigate(`/control/${page}`);
      })
      .catch(() => {
        toast.error(`خطأ بالتسجيل`);
      });
  };

  return (
    <div className=" mt-2 container">
      <h2 className="text-center">إضافة {label}</h2>
      <form onSubmit={handleSubmit(submmision)}>
        <div className="form-group">
          <label className="text-warning" htmlFor="name">
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
          <label className="text-warning" htmlFor="notes">
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
          <button type="submit" className="btn btn-primary m-1">
            تأكيد
          </button>
          <Link to="/control/basicControl" className="btn btn-secondary">
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DefaultCreateForm;
