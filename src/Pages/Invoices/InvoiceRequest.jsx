import Spinner from "../../Components/Spinner";
import {
  FaBilibili,
  FaCashRegister,
  FaFileCirclePlus,
  FaMoneyBill,
  FaMoneyBill1Wave,
  FaMoneyBillTransfer,
  FaReact,
  FaRepeat,
  FaSellcast,
} from "react-icons/fa6";
import Invoices from "./Invoices";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import UserInvoices from "../Users/UserInvoices";

const InvoiceRequest = () => {
  let { user } = useContext(AuthContext);
  useEffect(() => {}, [Invoices]);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-7 mt-3">
            <div className="row d-flex justify-content-center">
              <div className="col-md-8 mt-2">
                <Link to="/invoice/bill/" style={{ textDecoration: "none" }}>
                  <div className="card p-3" style={{ alignItems: "center" }}>
                    <FaSellcast size={30} style={{ alignContent: "center" }} />
                    <h3 className="mt-2">فاتورة بيع</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-8 mt-2">
                <Link
                  to="/invoice/purchase/"
                  style={{ textDecoration: "none" }}
                >
                  <div className="card p-3" style={{ alignItems: "center" }}>
                    <FaMoneyBill size={30} style={{ alignContent: "center" }} />
                    <h3 className="mt-2">فاتورة شراء</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-8 mt-2">
                <Link to="/working" style={{ textDecoration: "none" }}>
                  <div className="card p-3" style={{ alignItems: "center" }}>
                    <FaRepeat size={30} style={{ alignContent: "center" }} />
                    <h3 className="mt-2">مرتجع / هالك</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-8 mt-2">
                <Link to="/invoice/cashOut" style={{ textDecoration: "none" }}>
                  <div className="card p-3" style={{ alignItems: "center" }}>
                    <FaMoneyBillTransfer
                      size={30}
                      style={{ alignContent: "center" }}
                    />
                    <h3 className="mt-2">توريد نقدية</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-8 mt-2">
                <Link to="/invoice/cashIn" style={{ textDecoration: "none" }}>
                  <div className="card p-3" style={{ alignItems: "center" }}>
                    <FaMoneyBillTransfer
                      size={30}
                      style={{ alignContent: "center" }}
                    />
                    <h3 className="mt-2">إستلام نقدية</h3>
                  </div>
                </Link>
              </div>
              <div className="col-md-8 mt-2">
                <Link to="/invoice/expenses" style={{ textDecoration: "none" }}>
                  <div className="card p-3" style={{ alignItems: "center" }}>
                    <FaFileCirclePlus
                      size={30}
                      style={{ alignContent: "center" }}
                    />
                    <h3 className="mt-2">مصروفات</h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Recent Invoices  */}
          <div className="col-md-5">
            <h3 className="text-center mt-2">
              آخر الفواتير <FaMoneyBill1Wave size={30} />
            </h3>
            {/* Invoices limited  */}
            {user.is_superadmin || user.is_staff ? (
              <Invoices limited={true} />
            ) : (
              <>
                {/* user invoices */}
                <UserInvoices userID={user.user_id} limited />
                <div className="d-flex justify-content-center">
                  <Link
                    to={`/userInvoices/${user.user_id}`}
                    className="btn btn-sm btn-outline-primary text-center"
                  >
                    المزيد ...
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceRequest;
