import { useContext, useEffect, useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeProvider";

const ExpensesInvoice = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [userProfile, setUserProfile] = useState([]);
  let [payTypes, setPayTypes] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {}, []);

  const defaultValues = {
    pay_type: "",
    total: "",
    notes: "",
    account: "",
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  let saveInvoice = (data) => {
    let saved_data = {
        
    };

    AxiosInstance.post(`invoice/`, saved_data)
      .then((res) => {
        if (res.status === 200) {
          accountData.id &&
            AxiosInstance.put(`account/${accountData.id}/`, {
              // add to account credit
              name: accountData.name,
              account_type: accountData.account_type,
              company: accountData.company,
              archived_at: accountData.archived_at,
              credit: parseInt(accountData.credit) + parseInt(data.total),
            });
          AxiosInstance.put(`profile/${user.profile}/`, {
            // sub from account credit
            credit: parseInt(userProfile.credit) + parseInt(data.total),
          });
          toast.success(`تم تسجيل فاتورة تسليم نقدية بنجاح`);
          navigate(-1);
        } else {
          toast.error(`خطأ بالتسجيل`);
        }
      })
      .catch((e) => {
        toast.error(`خطأ بالتسجيل` + e);
      });
  };

  return (
    <div className="container">
      <div className="modal-dialog">
        <div className="modal-content rounded-4 shadow">
          <div className="container-fluid mb-2">
            <div className="p-3 pb-4 border-bottom-0 text-center">
              <h3
                className={`fw-bold mb-0 fs-2 ${
                  theme == "dark" ? "text-green" : "text-navy"
                }`}
              >
                فاتورة مصروفات
              </h3>
            </div>
            <div className="row">
              <div className="col-md-4 col-12 my-1">
                <input
                  type="text"
                  name="item"
                  placeholder="بند الصرف"
                  className="form-control"
                  onChange={``}
                />
              </div>
              <div className="col-md-4 col-12 my-1">
                <input
                  type="number"
                  name="item"
                  placeholder="المبلغ"
                  className="form-control"
                  onChange={``}
                />
              </div>
              <div className="col-md-4 col-12 my-1">
                <input
                  type="notes"
                  name="item"
                  placeholder="ملاحظات"
                  className="form-control"
                  onChange={``}
                />
              </div>
              <div className="my-1 d-flex justify-content-end">
                <button onClick={handleSubmit(saveInvoice)} className="btn btn-primary m-1">حفظ</button>
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary m-1"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesInvoice;
