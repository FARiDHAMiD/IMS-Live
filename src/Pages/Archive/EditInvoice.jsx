import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../Components/Spinner";
import AxiosInstance from "../../Components/AxiosInstance";
import dayjs from "dayjs";
import { FaRegSave } from "react-icons/fa";
import { FaPrint, FaTrash, FaTriangleExclamation } from "react-icons/fa6";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeProvider";

const EditInvoice = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let { id } = useParams();
  let [loading, setLoading] = useState(true);
  let [invoice, setInvoice] = useState([]);
  let [payTypes, setPayTypes] = useState([]);
  let [updateItems, setUpdateItems] = useState([]);
  let [accountCredit, setAccountCredit] = useState();
  let [userCredit, setUserCredit] = useState();
  let [userProfileId, setUserProfileId] = useState();
  let navigate = useNavigate();

  let getInvoice = async () => {
    let response = await AxiosInstance.get(`invoice/${id}`);
    setInvoice(response.data);
    setUpdateItems(response.data.invoice_items);
    setAccountCredit(response.data.account_data.credit);
    let userResponse = await AxiosInstance.get(
      `user/${response.data.invoice_by}`
    );
    setUserCredit(userResponse.data.profile.credit);
    setUserProfileId(userResponse.data.profile.id);
    setLoading(false);
  };

  let getPayTypes = async () => {
    let response = await AxiosInstance.get(`payType`);
    setPayTypes(response.data);
  };

  let invoiceSubtotal = parseFloat(
    invoice.total + invoice.discount - invoice.tax
  ).toFixed(2);

  let onDeleteItem = (id) => {
    console.log(accountCredit);
    let accountNewCredit = accountCredit + invoice.total;
    let result = updateItems.filter((itm) => itm.id == id);
  };

  const deleteInvoice = async () => {
    let newUserCredit =
      invoice.type == 1 // بيع
        ? userCredit - invoice.paid
        : invoice.type == 2 // شراء
        ? userCredit + invoice.paid
        : invoice.type == 4 // توريد كاش
        ? userCredit + invoice.paid
        : invoice.type == 5 // توريد كاش
        ? userCredit - invoice.paid
        : null;

    // error in equation !!!
    let newAccountCredit =
      invoice.type == 1 // بيع
        ? -accountCredit + invoice.remain
        : invoice.type == 2 // شراء
        ? accountCredit - invoice.remain
        : invoice.type == 4 // توريد كاش
        ? accountCredit + invoice.paid
        : invoice.type == 5 // إستلام كاش
        ? accountCredit - invoice.paid
        : null;

    if (confirm("تأكيد الحذف")) {
      invoice.invoice_items.map((item) =>
        AxiosInstance.delete(`deleteInvoiceItem/${item.id}/`)
      );
      let res = await AxiosInstance.delete(`invoice/${id}/`);
      if (res.status == 204) {
        // update user profile credit
        AxiosInstance.put(`profile/${userProfileId}/`, {
          credit: newUserCredit,
        });

        // update account credit
        AxiosInstance.put(`account/${invoice.account_data.id}/`, {
          name: invoice.account_data.name,
          company: invoice.account_data.company,
          account_type: invoice.account_data.account_type,
          archived_at: invoice.account_data.archived_at,
          credit: newAccountCredit,
        });

        for (let i = 0; i < invoice.invoice_items.length; i++) {
          let update_items = {
            item_id: invoice.invoice_items.map((itm) => parseInt(itm.item))[i], // use as item id
            item_name: invoice.invoice_items.map((itm) => itm.item_data.name)[
              i
            ], // use as item id
            item_qty: invoice.invoice_items.map((itm) => parseFloat(itm.qty))[
              i
            ], // use as item id
            main_qty: invoice.invoice_items.map((itm) =>
              parseFloat(itm.item_data.qty)
            )[i], // use as item id
          };
          // update item qty
          if (invoice.type == 1) {
            // بيع هنزود الكمية اللى فى الفاتورة ع المخزن
            AxiosInstance.put(`item/${update_items.item_id}/`, {
              name: update_items.item_name,
              qty: parseFloat(
                update_items.main_qty + update_items.item_qty
              ).toFixed(2),
              last_order_by: user.username,
              last_order_time: dayjs().format(),
            });
          } else if (invoice.type == 2) {
            // شراء هنقص الكمية اللى فى الفاتورة ع المخزن
            // update item qty
            AxiosInstance.put(`item/${update_items.item_id}/`, {
              name: update_items.item_name,
              qty: parseFloat(
                update_items.main_qty - update_items.item_qty
              ).toFixed(2),
              last_order_by: user.username,
              last_order_time: dayjs().format(),
            });
          }
        }
        toast.success(`تم حذف الفاتورة بنجاح`);
      } else {
        toast.error(`خطأ أثناء الحذف`);
      }
      navigate("/control/invoiceArchive");
    }
  };

  const updateCalculate = useCallback(() => {}, []);

  useEffect(() => {
    getInvoice();
    getPayTypes();
  }, []);

  let print = () => {
    window.print();
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="container">
          <h3
            className={`${
              theme == "dark" ? "text-green" : "text-navy"
            } text-center my-2`}
          >
            تعديل فاتورة {invoice.invoiceType}
          </h3>
          <div className="container">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-4">فاتورة رقم# {invoice.invoice_no}</div>
                  <div className="col-4 d-flex justify-content-center">
                    <button className="btn btn-outline-light" onClick={print}>
                      <FaPrint />
                    </button>
                  </div>
                  <div className="col-4 d-flex justify-content-end text-muted">
                    ({dayjs(invoice.invoice_time).format("YYYY/MM/DD HH:mm")}) @
                    {invoice.username}
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* account data  */}
                {invoice.account_data.id && (
                  <>
                    <div className="row">
                      {/* name  */}
                      <div className="col-md-4 col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            defaultValue={invoice.account_data.name}
                            className="form-control"
                            id="floatingInput"
                            disabled
                          />
                          <label htmlFor="floatingInput">العميل</label>
                        </div>
                      </div>

                      {/* pay method */}
                      <div className="col-md-2 col-6">
                        <div className="form-floating">
                          <select
                            className="form-select form-select-sm"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                          >
                            {payTypes.map((pay) => (
                              <option
                                key={pay.id}
                                value={pay.id}
                                defaultValue={invoice.payMethod}
                              >
                                {pay.name}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="floatingSelect">وسيلة الدفع</label>
                        </div>
                      </div>

                      {/* due date  */}
                      <div className="col-md-2 col-6">
                        <div className="form-floating mb-3">
                          <input
                            type="date"
                            defaultValue={invoice.due_date}
                            className="form-control form-control-sm"
                            id="floatingInput"
                          />
                          <label
                            htmlFor="floatingInput"
                            style={{ fontSize: "small" }}
                          >
                            آخر موعد للسداد
                          </label>
                        </div>
                      </div>

                      {/* paid  */}
                      <div className="col-md-2 col-6">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            defaultValue={invoice.paid}
                            className="form-control form-control-sm"
                            id="floatingInput"
                            disabled
                          />
                          <label
                            htmlFor="floatingInput"
                            style={{ fontSize: "small" }}
                          >
                            المدفوع
                          </label>
                        </div>
                      </div>

                      {/* remain  */}
                      <div className="col-md-2 col-6">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            defaultValue={invoice.remain}
                            className="form-control form-control-sm"
                            id="floatingInput"
                            disabled
                          />
                          <label
                            htmlFor="floatingInput"
                            style={{ fontSize: "small" }}
                          >
                            المتبقى وقت الفاتورة
                          </label>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                )}

                {/* items  */}
                <div
                  className={`row ${
                    theme == "dark" ? "text-warning" : "text-navy"
                  }`}
                  style={{ fontSize: "small" }}
                >
                  <div className="col-5">
                    <label>الصنف</label>
                  </div>
                  <div className="col-2">
                    <label>الكمية</label>
                  </div>
                  <div className="col-2">
                    <label>السعر</label>
                  </div>
                  <div className="col-2">
                    <label>إجمالى</label>
                  </div>
                  {invoice.invoiceType == "بيع" && (
                    <div className="col-1 text-danger">
                      <label>حذف</label>
                    </div>
                  )}
                </div>
                {invoice.invoice_items.map((item) => (
                  <div className="row" key={item.id}>
                    <div className="col-5 my-1">
                      <label className="text-nowrap">
                        {item.item_data.name}
                      </label>
                    </div>
                    <div className="col-2 my-1">
                      <label className="text-nowrap">{item.qty}</label>
                    </div>
                    <div className="col-2 my-1">
                      <label className="text-nowrap">{item.price}</label>
                    </div>
                    <div className="col-2 my-1">
                      <label>{item.qty * item.price}</label>
                    </div>
                    {invoice.invoiceType == "بيع" && (
                      <div className="col-1">
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          x
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <hr />

                {/* total  */}
                <div
                  className={`col-md-6 col-12 ${
                    theme == "dark" ? "text-warning" : ""
                  } m-1`}
                  style={{ float: "left" }}
                >
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">قيمة الأصناف:</span>
                    <span>EGP {invoiceSubtotal}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">الخصم:</span>
                    <span>
                      <span className="small ">
                        (
                        {((invoice.discount / invoiceSubtotal) * 100).toFixed(
                          1
                        ) || 0}
                        %){" "}
                      </span>
                      {`EGP ` + invoice.discount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">ضريبة:</span>
                    <span>
                      <span className="small ">
                        (
                        {((invoice.tax / invoiceSubtotal) * 100).toFixed(1) ||
                          0}
                        %) {` `}
                      </span>
                      {`EGP ` + invoice.tax || 0}
                    </span>
                  </div>
                  <hr />
                  <div
                    className="d-flex flex-row align-items-start justify-content-between"
                    style={{ fontSize: "1.125rem" }}
                  >
                    <span className="fw-bold">إجمالى الفاتورة:</span>
                    <span className="fw-bold">EGP {invoice.total || 0}</span>
                  </div>
                </div>
              </div>
              {/* save invoice  */}
              <div className="d-flex justify-content-end">
                <button className={`btn ${theme == 'dark' ? 'btn-info' : 'btn-success'} col-md-3 col-5 m-1`}>
                  حفظ  <FaRegSave />
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#confirmDeleteModal"
                  className="btn btn-danger col-md-3 col-5 m-1"
                >
                  حذف <FaTrash />
                </button>
              </div>
              {/* delete modal  */}
              <div
                className="modal fade"
                id="confirmDeleteModal"
                tabIndex="-1"
                aria-labelledby="confirmDeleteModalLabel"
              >
                <div className="modal-dialog rounded-3 shadow">
                  <div className="modal-content">
                    <div className="modal-title p-4 text-center">
                      <FaTriangleExclamation
                        style={{ color: "red", fontSize: "xx-large" }}
                      />
                      <h5 className="mb-0">
                        تأكيد حذف فاتورة رقم ({invoice.id}) نهائياً من النظام ؟
                      </h5>
                      <div className="modal-body">
                        <p className="mb-0">
                          - هذا الإجراء على مسئولية المستخدم الحالى للنظام{" "}
                          <span
                            className={
                              theme == "dark" ? "text-info" : "text-navy"
                            }
                          >
                            {user.username}
                          </span>{" "}
                          , لا يمكن العودة فى هذا الإجراء
                          <br />
                          - سيم تعديل رصيد كلاً من العميل والمستخدم المسجل
                          بالفاتورة
                          <br />- سيتم تعديل الكميات المسجلة بالفاتورة بالمخزن
                        </p>
                      </div>
                    </div>
                    <div className="modal-footer flex-nowrap p-0">
                      <button
                        type="button"
                        className="btn btn-sm btn-link fs-6 text-decoration-none text-danger col-6 m-0 rounded-0 border-end"
                        onClick={() => deleteInvoice()}
                        data-bs-dismiss="modal"
                      >
                        <strong>تأكيد الحذف</strong>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm btn-link fs-6 text-decoration-none ${
                          theme == "dark" ? "text-light" : "text-dark"
                        } col-6 m-0 rounded-0`}
                        data-bs-dismiss="modal"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* end delete modal */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditInvoice;
