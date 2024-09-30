import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import AxiosInstance from "../AxiosInstance";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Spinner from "../Spinner";

const DefaultEditForm = (props) => {
  const { control, label } = props;
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(true);

  let getData = async () => {
    let response = await AxiosInstance.get(`${control}/${id}`);
    setValue("name", response.data.name);
    setValue("notes", response.data.notes);
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [control]);

  let navigate = useNavigate();

  const { id } = useParams();

  // manage controlled and uncontrolled data
  const defaultValues = {
    name: "",
    notes: "",
  };

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    // later for validation
    // resolver: yupResolver(schema),
  });

  const submmision = (data) => {
    AxiosInstance.put(`${control}/${id}/`, {
      name: data.name,
      notes: data.notes,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`تم التعديل بنجاح`);
        } else {
          toast.error(`خطأ بالتعديل`);
        }
        navigate(`/control/${control}`);
      })
      .catch(() => {
        toast.error(`خطأ بالتعديل`);
      });
  };

  return (
    <div className=" mt-2 container">
      <h2 className="text-center">
        تعديل {label} <strong>({data.name})</strong>
      </h2>
      {loading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(submmision)}>
          <div className="form-group">
            <label className="text-warning" htmlFor="name">
              تعديل {label}
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              {...register("name", {
                required: "حقل مطلوب",
                maxLength: {
                  value: 50,
                  message: "أقصى حد 50 حرف",
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
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
              <p className="text-danger">{errors.notes.message}</p>
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
      )}
    </div>
  );
};

export default DefaultEditForm;
