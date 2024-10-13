import { useContext, useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeProvider";
import AxiosInstance from "../../../Components/AxiosInstance";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { FaArrowLeft } from "react-icons/fa6";
import AuthContext from "../../../context/AuthContext";
import { toast } from "react-toastify";

const ReprDetails = () => {
  let { id } = useParams();
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [repr, setRepr] = useState([]);
  const [reprItems, setReprItems] = useState([]);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  let get_repr = async () => {
    let response = await AxiosInstance.get(`repr/${id}`);
    setRepr(response.data);
    setReprItems(response.data.items);
    setLoading(false);
  };

  let submitReview = () => {
    AxiosInstance.put(`repr/${id}/`, {
      review: true,
      reviewed_by: user.username,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success(`شم مراجعة العهدة بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالمراجعة`);
        }
      })
      .catch((e) => {
        toast.error(`خطأ بالمراجعة`, e.message);
      });
  };

  useEffect(() => {
    get_repr();
  }, []);

  return (
    <div className="container my-2">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <h4
              className={
                theme == "dark"
                  ? "text-green text-center"
                  : "text-navy text-center"
              }
            >
              مراجعة تسليم عهدة إلى {repr.profile}@
            </h4>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">
            توقيت الاستلام: {dayjs(repr.time).format("YYYY/MM/DD hh:mma")}
          </h5>
          <p className="card-text">{repr.notes}</p>
          <hr />

          <ul className="list-group mb-2">
            {reprItems.map((itm) => (
              <li key={itm.id} className="list-group-item">
                {itm.qty} {itm.item__scale_unit__name} {itm.item__name} |{" "}
                {itm.price} ج.م.
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer text-muted">
          <div className="row">
            <div className="col-8">
              {dayjs(repr.created_at).format("YYYY/MM/DD h:mma")} | تسجيل:{" "}
              {repr.created_by}@{" "}
              {repr.review
                ? ` | تم مراجعة هذه العهدة بواسطة ` + repr.reviewed_by + `@`
                : ""}
            </div>

            <div className="col-4">
              <div className="d-flex justify-content-end">
                {repr.review == false ? (
                  <button
                    onClick={submitReview}
                    className="btn btn-success m-1 my-0"
                  >
                    تأكيد المراجعة
                  </button>
                ) : (
                  ""
                )}
                <Link to={-1} className={`btn btn-secondary m-1 my-0`}>
                  <FaArrowLeft />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReprDetails;
