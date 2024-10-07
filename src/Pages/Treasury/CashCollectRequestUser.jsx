import { useContext, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import AxiosInstance from "../../Components/AxiosInstance";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import AuthContext from "../../context/AuthContext";

const CashCollectRequestUser = (props) => {
  let { user } = useContext(AuthContext);
  let { profile_view = false, limited = false } = props;
  let [cashUser, setCashUser] = useState([]);
  let { id } = useParams();
  let { theme } = useTheme();
  let [profileName, setProfileName] = useState();

  const apiURL = limited ? "cashUserLimited" : `cashUser`;
  const request_id = user.is_superuser ? id : user.profile;

  let get_cashUser = async () => {
    let response = await AxiosInstance.get(`${apiURL}/${request_id}/`);
    setCashUser(response.data);
    if (response.data[0]) {
      // if the user profile have previous request ...
      setProfileName(response.data[0]["from_user"]);
    }
  };

  useEffect(() => {
    get_cashUser();
  }, []);
  return (
    <div className="container my-1">
      <h4
        className={
          theme == "dark" ? "text-center text-green" : "text-center text-navy"
        }
      >
        {profile_view
          ? ""
          : profileName
          ? user.is_superuser && `طلبات التوريد للمستخدم ${profileName}`
          : `لا يوجد طلبات توريد سابقة لهذا المسخدم`}
      </h4>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                #
              </th>
              <th
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                توقيت الطلب
              </th>
              <th
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                المبلغ
              </th>
              <th
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                طلب مراجعة
              </th>
              <th
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                الإجراء
              </th>
              <th
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                الإجراء بواسطة
              </th>

              <th
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                الرصيد قبل الطلب
              </th>
              {!limited && (
                <th
                  className={
                    theme == "dark" ? "text-warning" : "text-light bg-primary"
                  }
                >
                  ملاحظات المستخدم
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {cashUser.map((cash, index) => (
              <tr key={cash.id}>
                <td>{index + 1}</td>
                <td>{dayjs(cash.request_time).format("YYYY/MM/DD hh:mma")}</td>
                <td>{cash.credit_collected}</td>
                <td>{cash.approved_user}</td>
                <td>
                  {cash.approved ? (
                    `قبول`
                  ) : (
                    <span
                      className={
                        theme == "dark" ? "text-warning" : "text-danger"
                      }
                    >
                      رفض
                    </span>
                  )}
                </td>
                <td>{cash.approved_by}</td>
                <td>{cash.current_credit.toLocaleString()}</td>
                {!limited && <td>{cash.notes}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashCollectRequestUser;
