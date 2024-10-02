import { useState, useEffect } from "react";
import dayjs from "dayjs";
import AxiosInstance from "../../Components/AxiosInstance";
import UseDebounce from "../../hooks/UseDebounce";
import SearchBox from "../../Components/SearchBox";
import Spinner from "../../Components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";

const AccountsArchive = () => {
  let [input, setInput] = useState([]);
  let { theme } = useTheme();
  let [accounts, setAccounts] = useState([]);
  let [loading, setLoading] = useState(true);
  const debounce = UseDebounce(input, 800);
  let navigate = useNavigate();
  let getArchivedAccount = async () => {
    let response = await AxiosInstance.get(`accountArchive?name=${input}`);
    setAccounts(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getArchivedAccount();
  }, [debounce]);

  let editAccount = (id) => {
    navigate(`/control/account/${id}`);
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-md-8">
          <SearchBox searchTxt={input} setSearchTxt={setInput} />
        </div>
        <div className="col-md-4">
          <Link
            to="/control/archive"
            className="btn btn-outline-light mt-2"
            style={{ float: "left" }}
          >
            عودة للأرشيف
          </Link>
        </div>
      </div>
      <h4 className="text-center mb-2">إضغط على الحساب للمعلومات</h4>
      {loading ? (
        <Spinner />
      ) : (
        <table className="table table-hover ">
          <thead>
            <tr>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                #
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                الإسم
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                نوع الحساب
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                تاريخ التعطيل
              </th>
              <th
                scope="col"
                className={
                  theme == "dark" ? "text-warning" : "text-light bg-primary"
                }
              >
                تعطيل بواسطة
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr onClick={() => editAccount(account.id)} key={account.id}>
                <td scope="row">{index + 1}</td>
                <td className="text-nowrap">{account.name}</td>
                <td className="text-nowrap">{account.account_type}</td>
                <td>{dayjs(account.archived_at).format("YYYY/M/D")}</td>
                <td>{account.updated_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccountsArchive;
