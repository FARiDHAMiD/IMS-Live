import { FaTriangleExclamation } from "react-icons/fa6";

const ConfirmDeleteModal = (props) => {
  let { object, deactivate, destroy, label } = props;
  return (
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
              تأكيد حذف {label}
              <span className="text-info"> {object} </span> نهائياً من النظام ؟
            </h5>
            <div className="modal-body">
              <p className="mb-0">
                سيتم حذف ال{label} نهائياً من النظام مما قد يؤثر على جميع
                العمليات والتقارير المتعلقة بال{label}
              </p>
              <p className="mb-0 text-info">
                يمكن تعطيل ال{label} مؤقتاً وإضافة للأرشيف
              </p>
            </div>
          </div>
          <div className="modal-footer flex-nowrap p-0">
            <button
              type="button"
              className="btn btn-sm btn-link fs-6 text-decoration-none text-danger col-4 m-0 rounded-0 border-end"
              data-bs-dismiss="modal"
              onClick={destroy}
            >
              <strong>تأكيد الحذف</strong>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-link fs-6 text-decoration-none col-4 m-0 rounded-0 border-end"
              data-bs-dismiss="modal"
              onClick={deactivate}
            >
              تعطيل ال{label}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-link fs-6 text-decoration-none text-light col-4 m-0 rounded-0"
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

export default ConfirmDeleteModal;
