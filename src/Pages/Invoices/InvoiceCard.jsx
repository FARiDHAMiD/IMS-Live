import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import "./invoice.css";
import { FaDownload, FaPrint } from "react-icons/fa6";
import AxiosInstance from "../../Components/AxiosInstance";
import { useParams } from "react-router-dom";
import Spinner from "../../Components/Spinner";
import { components } from "react-select";

const InvoiceCard = () => {
  const printRef = useRef();
  let { id } = useParams();
  let [invoice, setInvoice] = useState([]);
  let [loading, setLoading] = useState(true);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Invoice#" + invoice.invoice_no + invoice.invoiceType,
    removeAfterPrint: true,
    suppressErrors: true,
  });

  let getInvoice = async () => {
    let response = await AxiosInstance(`invoice/${id}`);
    setInvoice(response.data);
    setLoading(false);
  };

  let invoiceSubtotal = parseFloat(
    invoice.total + invoice.discount - invoice.tax
  ).toFixed(2);

  useEffect(() => {
    getInvoice();
  }, []);

  // print function
  const onBtPrint = () => {
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center"
      style={{ backgroundColor: "#1A233A" }}
    >
      <div className="col-md-10 my-2">
        {/* Template 1 */}
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="row gutters">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="custom-actions-btns mb-2">
                  <a href="#" className="btn btn-primary">
                    <i className="icon-download"></i> <FaDownload />
                  </a>
                  <a
                    href="#"
                    className="btn btn-outline-light"
                    onClick={handlePrint}
                  >
                    <i className="icon-printer"></i> <FaPrint />
                  </a>
                </div>
              </div>
            </div>
            <div className="container" ref={printRef}>
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="card" style={{ backgroundColor: "#272e48" }}>
                    <div className="card-body p-0">
                      <div className="invoice-container">
                        <div className="invoice-header">
                          <div className="row gutters">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              <a href="index.html" className="invoice-logo">
                                فاتورة {invoice.invoiceType}
                              </a>
                            </div>
                            <div className="d-flex justify-content-end col-lg-6 col-md-6 col-sm-6">
                              <address className="">
                                المستخدم : {invoice.username}
                                <br />
                                تليفون: {invoice.user_phone}
                                <br />
                                طريقة الدفع: {invoice.payMethod}
                              </address>
                            </div>
                          </div>

                          <div className="row gutters">
                            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                              <div className="invoice-details">
                                {invoice.account_data.id ? (
                                  <address>
                                    {invoice.account_data.account_type +
                                      ` | ` +
                                      invoice.account_data.name +
                                      ` | ` +
                                      invoice.account_data.phone1 +
                                      ` | ` +
                                      invoice.account_data.phone2}
                                    <br />
                                    {invoice.account_data &&
                                      invoice.account_data.address}{" "}
                                    | {invoice.notes}
                                  </address>
                                ) : (
                                  "عميل غير معرف"
                                )}
                              </div>
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                              <div className="invoice-details">
                                <div className="invoice-num">
                                  <div>فاتورة رقم # {invoice.invoice_no}</div>
                                  <div>
                                    {dayjs(invoice.invoice_time).format(
                                      "dddd, D MMMM YYYY H:mm A"
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="invoice-body">
                          <div className="row gutters">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="table-responsive">
                                <table className="table custom-table m-0">
                                  <thead>
                                    <tr>
                                      <th>الصنف</th>
                                      <th>الكمية</th>
                                      <th>سعر الوحدة الأكبر</th>
                                      <th>المجموع</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {invoice.invoice_items &&
                                      invoice.invoice_items.map((item) => (
                                        <tr key={item.id}>
                                          <td>
                                            {item.item_data.name}
                                            <p className="m-0 text-muted">
                                              {item.item_data.cat} |{" "}
                                              {item.item_data.type}
                                            </p>
                                          </td>
                                          <td>
                                            {item.qty.toFixed(2)} (
                                            {item.item_data.scale_unit})
                                            <p className="m-0 text-muted">
                                              {(
                                                item.qty *
                                                item.item_data.small_in_large
                                              ).toFixed(1)}{" "}
                                              {item.item_data.small_unit}
                                            </p>
                                          </td>
                                          <td> {item.price.toFixed(2)}</td>
                                          <td>
                                            {" "}
                                            {(item.qty * item.price).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))}
                                    <tr>
                                      <td>&nbsp;</td>
                                      <td colSpan="2">
                                        <p>
                                          مجموع الأصناف
                                          <br />
                                          خصم (
                                          {(
                                            (invoice.discount /
                                              invoiceSubtotal) *
                                            100
                                          ).toFixed(1) || 0}
                                          %)
                                          <br />
                                          ضريبة (
                                          {(
                                            (invoice.tax / invoiceSubtotal) *
                                            100
                                          ).toFixed(1) || 0}
                                          %)
                                          <br />
                                        </p>
                                        <h5 className="text-warning">
                                          <strong>إجمالى الفاتورة</strong>
                                        </h5>
                                        <h6 className="">
                                          <strong>
                                            الرصيد السابق{" "}
                                            {invoice.prevCredit < 0 ? (
                                              <span
                                                className="text-muted"
                                                style={{ fontSize: "small" }}
                                              >
                                                (عليه)
                                              </span>
                                            ) : (
                                              <span
                                                className="text-muted"
                                                style={{ fontSize: "small" }}
                                              >
                                                (له)
                                              </span>
                                            )}
                                          </strong>
                                        </h6>
                                        <h6 className="">
                                          <strong>
                                            المدفوع{" "}
                                            <span
                                              className="text-muted"
                                              style={{ fontSize: "small" }}
                                            >
                                              (وقت تحصيل الفاتورة)
                                            </span>
                                          </strong>
                                        </h6>
                                        <h6 className="">
                                          <strong>
                                            المتبقى{" "}
                                            {invoice.remain > 0
                                              ? `له `
                                              : invoice.remain < 0
                                              ? `عليه `
                                              : ``}
                                            <span
                                              className="text-muted"
                                              style={{ fontSize: "small" }}
                                            >
                                              (حتى تاريخ الفاتورة)
                                            </span>
                                          </strong>
                                        </h6>
                                      </td>
                                      <td>
                                        <h6>
                                          {invoiceSubtotal}
                                          <br />{" "}
                                          {parseFloat(invoice.discount).toFixed(
                                            2
                                          )}
                                          <br />
                                          {parseFloat(invoice.tax).toFixed(2)}
                                          <br />
                                        </h6>
                                        <h5 className="text-warning">
                                          <strong>
                                            {invoice.total &&
                                              invoice.total.toLocaleString() +
                                                ``}
                                          </strong>
                                        </h5>
                                        <p>
                                          {" "}
                                          {parseFloat(
                                            invoice.prevCredit
                                          ).toFixed(2)}
                                        </p>
                                        {parseFloat(invoice.paid).toFixed(2)}
                                        <br />{" "}
                                        {parseFloat(invoice.remain).toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div dir="ltr" className="invoice-footer col-md-6">
                            © 2024 Hesham Mansour, Inc.
                          </div>
                          <div
                            className="invoice-footer col-md-6"
                            style={{ textAlign: "left" }}
                          >
                            Designed By{" "}
                            <span className="text-warning">Farid A. Hamid</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;
