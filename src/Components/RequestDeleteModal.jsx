import { FaTriangleExclamation } from "react-icons/fa6";

const RequestDeleteModal = (props) => {
  let { object, label } = props;
  return (
    <div
      className="modal fade"
      id="requestDeleteModal"
      tabIndex="-1"
      aria-labelledby="requestDeleteModalLabel"
    >
      <div className="modal-dialog rounded-3 shadow">
        <div className="modal-content">
          <div className="modal-title p-4 text-center">
            <FaTriangleExclamation
              style={{ color: "red", fontSize: "xx-large" }}
            />
            <h5 className="mb-0">
              طلب حذف {label}
              <span className="text-info"> {object} </span> نهائياً من النظام ؟
            </h5>
            <div className="modal-body">
              <p className="mb-0">سيتم إرسال طلب حذف {label} للأدمن</p>
              <div className="d-flex justify-content-center">
                <select
                  name="requestReason"
                  id=""
                  className="form-select mt-2 "
                >
                  <option value="" className="text-center text-muted">
                    --- إختر سبب طلب الحذف ---
                  </option>
                  <option value="1">مستخدم معطل</option>
                  <option value="2">مستخدم مكرر</option>
                  <option value="3">تسجيل بالخطأ</option>
                  <option value="4">سبب آخر</option>
                </select>
              </div>
              <div className="d-flex justify-content-center">
                <input
                  type="text"
                  className="form-control mt-2"
                  name="requestNotes"
                  id="requestNotes"
                  placeholder="معلومات إضافية ..."
                />
              </div>
            </div>
          </div>
          <div className="modal-footer flex-nowrap p-0">
            <button
              type="button"
              className="btn btn-sm btn-link fs-6 text-decoration-none text-danger col-6 m-0 rounded-0 border-end"
              data-bs-dismiss="modal"
            >
              <strong>تأكيد الطلب</strong>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-link fs-6 text-decoration-none text-light col-6 m-0 rounded-0"
              data-bs-dismiss="modal"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDeleteModal;
