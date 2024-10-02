import { useContext, useEffect, useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import { useForm } from "react-hook-form";
import { useFetcher, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeProvider";

const CashOutInvoice = () => {
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [loading, setLoading] = useState(true);
  let [accounts, setAccounts] = useState([]);
  let [accountData, setAccountData] = useState([]);
  let [userProfile, setUserProfile] = useState([]);
  let [payTypes, setPayTypes] = useState([]);

  let navigate = useNavigate();

  let getAccounts = async () => {
    let response = await AxiosInstance.get(`account`);
    setAccounts(response.data);
    setLoading(false);
  };

  let getAccountData = async (id) => {
    if (id == 0) {
      setAccountData([]);
    } else {
      let response = await AxiosInstance.get(`account/${id}`);
      setAccountData(response.data);
    }
  };

  let getUserProfile = async () => {
    let response = await AxiosInstance.get(`profile/${user.profile}`);
    setUserProfile(response.data);
  };

  let getPayTypes = async () => {
    let response = await AxiosInstance.get(`payType`);
    setPayTypes(response.data);
  };

  useEffect(() => {
    getAccounts();
    getUserProfile();
    getPayTypes();
  }, []);

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
      type: 4,
      pay_type: data.pay_type,
      invoice_by: user.user_id,
      invoice_time: dayjs().format(),
      account: data.account,
      total: data.total,
      paid: data.total,
      prevCredit: accountData.credit,
      remain: parseInt(accountData.credit) - parseInt(data.total),
      notes: data.notes,
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
              credit: parseInt(accountData.credit) - parseInt(data.total),
            });
          AxiosInstance.put(`profile/${user.profile}/`, {
            // sub from account credit
            credit: userProfile.credit - data.total,
          });
          toast.success(`تم تسجيل فاتورة توريد نقدية بنجاح`);
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
                توريد نقدية
              </h3>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 col-12 my-2">
                    <select
                      name="account"
                      className="form-select"
                      {...register("account", {
                        required: true,
                      })}
                      onChange={(e) =>
                        e ? getAccountData(e.target.value) : getAccountData(0)
                      }
                    >
                      <option value="">--إختر حساب--</option>
                      {accounts.map((account) => (
                        <option value={account.id} key={account.id}>
                          {account.name} | {account.credit.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 col-6">
                    <input
                      type="text"
                      name="cashAmount"
                      className="form-control my-2"
                      placeholder="المبلغ"
                      {...register("total", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="col-md-2 col-6 my-2">
                    <select
                      name="pay_type"
                      className="form-select"
                      {...register("pay_type", {
                        required: true,
                      })}
                    >
                      <option value="">--وسيلة الدفع--</option>
                      {payTypes.map((payType) => (
                        <option value={payType.id} key={payType.id}>
                          {payType.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 col-12">
                    <input
                      type="text"
                      name="notes"
                      className="form-control my-2"
                      placeholder="سبب الدفع"
                      {...register("notes", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={handleSubmit(saveInvoice)}
                      className="btn btn-primary m-1"
                    >
                      تأكيد
                    </button>
                    <button
                      className="btn btn-secondary m-1"
                      onClick={() => navigate(-1)}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashOutInvoice;
