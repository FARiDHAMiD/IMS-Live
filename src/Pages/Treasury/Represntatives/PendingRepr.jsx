import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeProvider";
import { useEffect, useState } from "react";
import Spinner from "../../../Components/Spinner";
import AxiosInstance from "../../../Components/AxiosInstance";
import dayjs from "dayjs";
import { FaCheck, FaXmark } from "react-icons/fa6";

const PendingRepr = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [reprs, setReprs] = useState([]);

  let navigate = useNavigate();

  let get_reprs = async () => {
    let response = await AxiosInstance.get(`pendingRepr`);
    setReprs(response.data);
    setLoading(false);
  };

  useEffect(() => {
    get_reprs();
  }, []);
  return (
    <div className="container my-2">
      <div className="row">
        <div className="col-9">
          <h3 className={theme == "dark" ? "text-green" : "text-navy"}>
            العهدة الخارجية حتى الآن
          </h3>
          <p className="text-muted">إضغط على البيان لعرض التفاصيل</p>
        </div>
        <div className="col-3" dir="ltr">
          <Link to={`/control/reprhoto`} className={`btn btn-success w-100`}>
            + تسليم مندوب
          </Link>
          <Link
            to={`/control/allRepr`}
            className={`btn ${
              theme == "dark" ? "btn-outline-light" : "btn-outline-dark"
            } my-1 w-100`}
          >
            التسليمات السابقة
          </Link>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="table-responsive my-2">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    #
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    المندوب
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    توقيت التسليم
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    الأصناف
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    قيمة الأصناف
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    المراجعة
                  </th>
                  <th
                    className={
                      theme == "dark" ? "text-warning" : "text-light bg-primary"
                    }
                  >
                    ملاحظات
                  </th>
                </tr>
              </thead>
              <tbody>
                {reprs.map((repr, index) => (
                  <tr
                    onClick={() => navigate(`/control/reprDetails/${repr.id}`)}
                    key={repr.id}
                  >
                    <td>{index + 1}</td>
                    <td>{repr.profile}</td>
                    <td>{dayjs(repr.time).format("YY/MM/DD h:mma")}</td>
                    <td className="text-nowrap">
                      <ul>
                        {repr.items.map((itm) => (
                          <li key={itm.id}>
                            {itm.qty} {itm.item__scale_unit__name} (
                            {itm.item__name})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td></td>
                    <td>{repr.review == false ? <FaXmark /> : <FaCheck />}</td>
                    <td>{repr.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PendingRepr;
