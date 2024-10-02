import { useState, useEffect, useContext } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import UseDebounce from "../../hooks/UseDebounce";
import SearchBox from "../../Components/SearchBox";
import Spinner from "../../Components/Spinner";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import AuthContext from "../../context/AuthContext";

const Accounts = () => {
  let [input, setInput] = useState([]);
  let { user } = useContext(AuthContext);
  let { theme } = useTheme();
  let [accountType, setAccountType] = useState([]);
  let [accounts, setAccounts] = useState([]);
  let [loading, setLoading] = useState(true);
  const debounce = UseDebounce(input, 800);

  let getAccountType = async () => {
    let response = await AxiosInstance.get(`accountType`);
    setAccountType(response.data);
  };

  // Sum credits
  let sumCredit = (data) => {
    return data.reduce((a, v) => (a = a + v.credit), 0);
  };

  let getAccounts = async () => {
    let response = await AxiosInstance.get(`account?name=${input}`);
    setAccounts(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getAccountType();
    getAccounts();
  }, [debounce]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-8">
            <SearchBox searchTxt={input} setSearchTxt={setInput} width={10} />
          </div>
          <div className="col-md-4 col-4 mt-2 d-flex justify-content-end">
            {user.is_superuser && (
              <Link
                className={`btn btn-lg ${
                  theme == "dark" ? "btn-outline-light" : "btn-outline-dark"
                } rounded-pill`}
                style={{ fontWeight: "bolder" }}
                to="/control/account/create"
              >
                +
              </Link>
            )}
          </div>
        </div>
        <hr />
      </div>
      <div className="container-fluid">
        {loading ? (
          <Spinner />
        ) : (
          <div className="row mt-3">
            {accountType.map((type) => (
              <div key={type.id} className="col-md-5 col-lg-4 order-md-last">
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className={theme == "dark" ? "text-warning" : "text-navy"}
                  >
                    {type.name}
                  </span>
                  <span className="badge bg-secondary rounded-pill">
                    {/* fixed ...  */}
                    {type.active_accounts}
                  </span>
                </h4>
                <ul className="list-group mb-3">
                  <div>
                    {accounts.map(
                      (account) =>
                        account.account_type == type.name && (
                          <div key={account.id}>
                            <Link
                              style={{ textDecoration: "none" }}
                              to={`/control/account/${account.id}`}
                            >
                              <li className="list-group-item d-flex justify-content-between lh-sm list-group-item-action">
                                <div>
                                  <h6 className="my-0">{account.name}</h6>
                                  {account.company ? (
                                    <small className="text-muted">
                                      {account.company} | {account.address}
                                    </small>
                                  ) : (
                                    <small className="text-muted">
                                      {account.address}
                                    </small>
                                  )}
                                </div>
                                <span
                                  className={`text-nowrap ${
                                    account.credit < 0 && "text-danger"
                                  }`}
                                >
                                  {account.credit.toLocaleString()} EGP
                                </span>
                              </li>
                            </Link>
                          </div>
                        )
                    )}
                  </div>
                  <br className="mt-2" />
                  <li className="list-group-item d-flex justify-content-between bg-light">
                    <div
                      className={
                        theme == "dark" ? "text-success" : "text-primary"
                      }
                    >
                      <h6 className="my-0">
                        <strong>الإجمالى</strong>
                      </h6>
                    </div>
                    {type.count_credit >= 0 ? (
                      <span
                        className={
                          theme == "dark" ? "text-success" : "text-primary"
                        }
                      >
                        {type.count_credit.toLocaleString()} EGP
                      </span>
                    ) : (
                      <span className="text-danger">
                        {type.count_credit.toLocaleString()} EGP
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Accounts;
