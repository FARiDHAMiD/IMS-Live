import { useContext } from "react";
import { FaEdit } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import ProgressBar from "./ProgressBar";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";

const ItemCard = ({ item }) => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();

  return (
    <div className="card">
      <div className="card-header">
        <div className="row">
          <div className="col-9">
            <h5 className={theme == "dark" ? "text-warning" : "text-navy"}>
              {item.name}
              {user.is_superuser && ` | ` +
                parseInt(item.selling_price * item.qty).toLocaleString()}
            </h5>
            <h6>أقل حد بالمخزن ({item.min_limit + item.scale_unit})</h6>
          </div>
          <div className="col-3">
            {(user.is_superuser || user.is_staff) && (
              <Link
                to={`/control/item/${item.id}/`}
                className="btn btn-default"
                style={{ float: "left" }}
              >
                <FaEdit size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="card-body">
        <p className="card-text">
          المتاح بالمخزن (
          <span className={theme == "dark" ? "text-warning" : "text-navy"}>
            {item.qty || 0} {item.scale_unit} /{" "}
            {parseFloat(item.qty * item.small_in_large).toLocaleString()}{" "}
            {item.small_unit}
          </span>
          ) | شراء: EGP{item.purchasing_price} | بيع جملة: EGP{" "}
          {item.selling_price} | بيع قطاعى: EGP{item.retail_price}
        </p>

        <ProgressBar
          width={Math.round((item.qty / item.min_limit) * 100)}
          bg_class={
            Math.round((item.qty / item.min_limit) * 100) < 100 &&
            Math.round((item.qty / item.min_limit) * 100) > 50
              ? "bg-warning"
              : Math.round((item.qty / item.min_limit) * 100) <= 50
              ? "bg-danger"
              : "bg-success"
          }
          striped={
            Math.round((item.qty / item.min_limit) * 100) >= 100
              ? ""
              : "striped"
          }
        />
      </div>
      <div className="card-footer text-muted">
        آخر طلب: {item.last_order_by} | {dayjs(item.last_order_time).fromNow()}
        {item.notes && " | " + item.notes}
      </div>
    </div>
  );
};

export default ItemCard;
