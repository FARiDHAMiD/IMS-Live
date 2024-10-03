import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import AxiosInstance from "./AxiosInstance";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import UseDebounce from "../hooks/UseDebounce";
import { useTheme } from "../context/ThemeProvider";

const ControlTable = (props) => {
  let { controlData, label, search } = props;
  const { theme } = useTheme();
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(true);

  const debounce = UseDebounce(search, 800);

  let getData = async () => {
    let response = await AxiosInstance.get(`${controlData}?name=${search}`);
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [controlData, debounce]);

  const destroy = async (id) => {
    if (confirm("تأكيد الحذف")) {
      let res = await AxiosInstance.delete(`${controlData}/${id}/`);
      if (res.status == 204) {
        toast.success(`تم الحذف بنجاح`);
      }
      getData();
    }
  };

  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <table
          className={`table table-hover ${
            theme == "dark" ? "" : "table-bordered"
          }`}
        >
          <thead>
            <tr>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                #
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                {label}
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                ملاحظات
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                إجراء
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td className="text-nowrap">{item.name}</td>
                <td>{item.notes}</td>
                <td className="text-nowrap">
                  <NavLink
                    to={`/control/${controlData}/${item.id}`}
                    state={{ url: controlData, label: label }}
                    className="btn btn-sm btn-light"
                  >
                    <FaEdit />
                  </NavLink>
                  {controlData == "invoiceType" ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => destroy(item.id)}
                      className="btn btn-sm btn-danger m-1"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ControlTable;
