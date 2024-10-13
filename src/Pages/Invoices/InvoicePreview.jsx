import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import { FaArrowLeft, FaDownload, FaPrint, FaXmark } from "react-icons/fa6";
import AxiosInstance from "../../Components/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../Components/Spinner";
import { components } from "react-select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePreview = () => {
  const printRef = useRef();
  let { id } = useParams();
  let [invoice, setInvoice] = useState([]);
  let [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Invoice#" + invoice.invoice_no + invoice.invoiceType,
    removeAfterPrint: true,
    suppressErrors: true,
  });

  let handleDownload = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "px", "a4");
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("INV-" + invoice.invoice_no + `.pdf`);
  };

  let getInvoice = async () => {
    let response = await AxiosInstance.get(`invoice/${id}`);
    setInvoice(response.data);
    setLoading(false);
  };

  let invoiceSubtotal = parseFloat(
    invoice.total + invoice.discount - invoice.tax
  ).toFixed(2);

  useEffect(() => {
    getInvoice();
  }, []);

  return (
    <>
      <div className="invoice-2 invoice-content" data-bs-theme="light">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="container" ref={printRef} id="divToPrint">
              <div className="row">
                <div className="col-lg-12">
                  <div className="invoice-inner clearfix">
                    <div className="invoice-info clearfix" id="invoice_wrapper">
                      <div className="invoice-headar">
                        <div className="row">
                          <div className="col-sm-8">
                            <div className="invoice-id">
                              <div className="info">
                                <h1 className="inv-header-1">
                                  فاتورة {invoice.invoiceType}
                                </h1>
                                <p className="mb-0">
                                  <span># {invoice.invoice_no}</span>
                                </p>
                                <p className="mb-0">
                                  <span>
                                    {dayjs(invoice.invoice_time).format(
                                      `YYYY/MM/DD hh:mma`
                                    )}
                                  </span>
                                </p>
                                <p className="mb-0">
                                  <span>
                                    {invoice.user_phone || ""} |{" "}
                                    {invoice.username}@
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* account / client  */}
                          <div className="col-sm-4 ">
                            <div className="invoice-number">
                              {invoice.account_data.name && (
                                <>
                                  <h4 className="inv-title-1 mt-5">العميل</h4>
                                  <h4 className="name text-nowrap">
                                    {invoice.account_data.name}
                                  </h4>
                                  <p className="invo-addr-0 ">
                                    {invoice.account_data.company ||
                                      "" +
                                        ` | ` +
                                        invoice.account_data.phone1 ||
                                      ""}
                                    <br />
                                    {invoice.account_data.address || ""}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="invoice-center">
                        <div className="table-responsive">
                          <table
                            className="table mb-0 table-bordered"
                            style={{ borderBottom: "solid black " }}
                          >
                            <thead className="bg-active">
                              <tr className="tr">
                                <th>#</th>
                                <th
                                  className="pl0 text-start"
                                  style={{ fontWeight: "bold" }}
                                >
                                  إسم الصنف
                                </th>
                                <th
                                  className="text-center"
                                  style={{ fontWeight: "bold" }}
                                >
                                  السعر
                                </th>
                                <th
                                  className="text-center"
                                  style={{ fontWeight: "bold" }}
                                >
                                  الكمية
                                </th>
                                <th
                                  className="text-end"
                                  style={{ fontWeight: "bold" }}
                                >
                                  القيمة
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.invoice_items &&
                                invoice.invoice_items.map((item, index) => (
                                  <tr className="tr" key={item.id}>
                                    <td>
                                      <div className="item-desc-1">
                                        <span>{index + 1}</span>
                                      </div>
                                    </td>
                                    <td
                                      className="text-nowrap"
                                      style={{ fontWeight: "bolder" }}
                                    >
                                      {item.item_data.name}
                                    </td>
                                    <td
                                      className="text-center"
                                      style={{ fontWeight: "bolder" }}
                                    >
                                      {item.price}
                                    </td>
                                    <td
                                      className="text-center"
                                      style={{ fontWeight: "bolder" }}
                                    >
                                      {item.qty}
                                    </td>
                                    <td
                                      className="text-end"
                                      style={{ fontWeight: "bolder" }}
                                    >
                                      {parseFloat(
                                        item.price * item.qty
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}

                              {/* subtotal  */}
                              <tr className="tr2">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td
                                  className="text-center"
                                  style={{ fontWeight: "bolder" }}
                                >
                                  إجمالى الأصناف
                                </td>
                                <td
                                  className="text-end"
                                  style={{ fontWeight: "bolder" }}
                                >
                                  {invoiceSubtotal.toLocaleString()}
                                </td>
                              </tr>

                              {/* tax & discount  */}
                              <tr className="tr2">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="text-center text-nowrap">
                                  ضريبة (
                                  {(
                                    (invoice.tax / invoiceSubtotal) *
                                    100
                                  ).toFixed(1) || 0}
                                  %)
                                  <br />
                                  خصم (
                                  {(
                                    (invoice.discount / invoiceSubtotal) *
                                    100
                                  ).toFixed(1) || 0}
                                  %)
                                </td>
                                <td className="text-end">
                                  {parseFloat(invoice.tax).toFixed(2)}
                                  <br />
                                  {parseFloat(invoice.discount).toFixed(2)}
                                </td>
                              </tr>

                              {/* grand total  */}
                              <tr
                                className="tr2"
                                style={{ fontWeight: "bolder" }}
                              >
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="text-center f-w-200 active-color">
                                  إجمالى الفاتورة
                                </td>
                                <td className="f-w-200 text-end active-color">
                                  {invoice.total &&
                                    parseFloat(invoice.total).toFixed(2)}
                                </td>
                              </tr>

                              {/* paid & remain  */}
                              <tr
                                className="tr2"
                                style={{ fontWeight: "bolder" }}
                              >
                                <td></td>
                                <td></td>
                                <td></td>
                                {invoice.account_data.name && (
                                  <>
                                    <td className="text-start f-w-600 text-nowrap">
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
                                      <br />
                                      <strong>
                                        المدفوع{" "}
                                        <span
                                          className="text-muted"
                                          style={{ fontSize: "small" }}
                                        >
                                          (وقت تحصيل الفاتورة)
                                        </span>
                                      </strong>
                                      <br />
                                      <span className="text-muted">
                                        وسيلة الدفع
                                      </span>

                                      <br />
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
                                    </td>
                                    <td className="f-w-200 text-end">
                                      {invoice.prevCredit < 0
                                        ? parseFloat(
                                            -invoice.prevCredit
                                          ).toFixed(2)
                                        : parseFloat(
                                            invoice.prevCredit
                                          ).toFixed(2)}{" "}
                                      <br />
                                      {parseFloat(invoice.paid).toFixed(2)}{" "}
                                      <br />
                                      <span
                                        className="text-muted"
                                        style={{ fontWeight: "lighter" }}
                                      >
                                        {invoice.payMethod}
                                      </span>
                                      <br />
                                      {invoice.remain < 0
                                        ? parseFloat(-invoice.remain).toFixed(2)
                                        : parseFloat(invoice.remain).toFixed(2)}
                                    </td>
                                  </>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="invoice-btn-section clearfix d-print-none d-flex justify-content-end col-11">
              <button
                className="btn btn-primary m-1"
                onClick={() => handlePrint()}
              >
                <FaPrint />
              </button>
              <button
                className="btn btn-secondary m-1"
                onClick={handleDownload}
              >
                <FaDownload />
              </button>
              <button
                className="btn btn-outline-dark m-1"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InvoicePreview;
