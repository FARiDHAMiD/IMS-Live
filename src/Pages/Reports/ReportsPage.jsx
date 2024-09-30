import { Link } from "react-router-dom";
import {
  FaClipboard,
  FaFileInvoice,
  FaRegCreditCard,
  FaStore,
  FaUsers,
} from "react-icons/fa6";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { FaShoppingBasket } from "react-icons/fa";

const ReportsPage = () => {
  let { user } = useContext(AuthContext);

  return (
    <div className="container mt-3">
      <div className="row d-flex justify-content-center">
        <div className="col-md-4 mt-2">
          <Link to="/reports/accounts/" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaUsers size={70} style={{ alignContent: "center" }} />
              <h3 className="mt-2">العملاء</h3>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mt-2">
          <Link to="/reports/stocks/" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaStore size={70} style={{ alignContent: "center" }} />
              <h3 className="mt-2">المخازن</h3>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mt-2">
          <Link to="/reports/items/" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaShoppingBasket size={70} style={{ alignContent: "center" }} />
              <h3 className="mt-2">الأصناف</h3>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mt-2">
          <Link to="/reports/invoices/" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaFileInvoice size={70} style={{ alignContent: "center" }} />
              <h3 className="mt-2">الفواتير</h3>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mt-2">
          <Link to="/working" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaRegCreditCard size={70} style={{ alignContent: "center" }} />
              <h3 className="mt-2">الرصيد</h3>
            </div>
          </Link>
        </div>
        <div className="col-md-4 mt-2">
          <Link to="/working" style={{ textDecoration: "none" }}>
            <div className="card p-3" style={{ alignItems: "center" }}>
              <FaClipboard size={70} style={{ alignContent: "center" }} />
              <h3 className="mt-2">أصناف تحت الكمية</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
