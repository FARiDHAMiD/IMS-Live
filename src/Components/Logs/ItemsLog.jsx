import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AxiosInstance from "../AxiosInstance";
import {
  FaArrowLeft,
  FaArrowsTurnToDots,
  FaCircleArrowDown,
  FaCircleArrowUp,
  FaCirclePause,
  FaScroll,
} from "react-icons/fa6";
import dayjs from "dayjs";
import Spinner from "../Spinner";
import { useTheme } from "../../context/ThemeProvider";

const ItemsLog = ({ limited = false }, { item }) => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [itemsLog, setItemsLog] = useState([]);
  let [loading, setLoading] = useState(true);

  const apiURL = limited ? `itemsLimitedLog/` : "itemsLog";
  // All Items changes log
  let getItemLog = async () => {
    let response = await AxiosInstance.get(apiURL);
    setItemsLog(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getItemLog();
  }, []);

  return (
    <>
      {/* Prices change log ...  */}
      <div className="d-flex justify-content-center">
        <div>
          <h3 className="text-center mt-2">
            حركات الأسعار <FaArrowsTurnToDots size={30} />
          </h3>
          {!limited && (
            <Link className="btn text-end w-100" to={-1}>
              <FaArrowLeft />
            </Link>
          )}
          {loading ? (
            <Spinner />
          ) : (
            <div className="list-group w-auto">
              {itemsLog.map((log) => (
                <Link
                  key={log.id}
                  to={
                    (user.is_superuser || user.is_staff) &&
                    `/control/item/${log.object_id}`
                  }
                  className="list-group-item list-group-item-action d-flex gap-3 py-3"
                >
                  {/* selling price up or down */}
                  {log.changes.selling_price ? (
                    <>
                      {log.changes.selling_price[0] >
                      log.changes.selling_price[1] ? (
                        <FaCircleArrowDown size={30} />
                      ) : (
                        <FaCircleArrowUp size={30} />
                      )}
                    </>
                  ) : (
                    <FaCirclePause size={30} />
                  )}

                  <div className="d-flex gap-2 w-100 justify-content-between">
                    <div>
                      <h6
                        className={
                          theme == "dark" ? "mb-0 text-warning" : "mb-0"
                        }
                      >
                        {log.object_repr}
                      </h6>
                      <p className="mb-0 opacity-75">
                        شراء:{" "}
                        {log.purchase_changes &&
                          JSON.stringify(log.purchase_changes)
                            .replace(/]|[[]|"|'/g, "")
                            .replace(/,/g, "->")}
                      </p>
                      <p className="mb-0 opacity-75">
                        جملة:{" "}
                        {log.selling_changes &&
                          JSON.stringify(log.selling_changes)
                            .replace(/]|[[]|"|'/g, "")
                            .replace(/,/g, "->")}
                      </p>
                      <p className="mb-0 opacity-75">
                        قطاعى:{" "}
                        {log.retail_changes &&
                          JSON.stringify(log.retail_changes)
                            .replace(/]|[[]|"|'/g, "")
                            .replace(/,/g, "->")}
                      </p>
                      {/* <p className="mb-0 opacity-75">
                          شراء: ({log.changes.purchasing_price} {` - `}
                          <span className="text-warning">
                            {log.changes.purchasing_price}
                          </span>
                          )
                        </p> */}
                    </div>
                    <small className="opacity-50 text-nowrap">
                      {log.changed_by} | {dayjs(log.timestamp).fromNow()}
                    </small>
                  </div>
                </Link>
              ))}
              <br className="mt-2" />
              {!limited && (
                <Link className="btn text-end w-100" to={-1}>
                  <FaArrowLeft />
                </Link>
              )}
              {limited && (
                <Link
                  to={`/itemsLog`}
                  className="list-group-item list-group-item-action d-flex gap-3 py-3 justify-content-center"
                >
                  المزيد ... <FaScroll size={20} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemsLog;
