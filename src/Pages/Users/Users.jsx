import { useState, useEffect } from "react";
import dayjs from "dayjs";
import AxiosInstance from "../../Components/AxiosInstance";
import UseDebounce from "../../hooks/UseDebounce";
import SearchBox from "../../Components/SearchBox";
import Spinner from "../../Components/Spinner";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCheck, FaX } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeProvider";

const Users = () => {
  let [users, setUsers] = useState([]);
  let { theme } = useTheme();
  let [input, setInput] = useState([]);
  let [loading, setLoading] = useState(true);
  const debounce = UseDebounce(input, 800);
  let navigate = useNavigate();

  let getUsers = async () => {
    let response = await AxiosInstance.get(`user?username=${input}`);
    setUsers(response.data);
    setLoading(false);
  };

  let editUser = (id) => {
    navigate(`/control/user/${id}`);
  };

  useEffect(() => {
    getUsers();
  }, [debounce]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 col-8">
                <SearchBox
                  searchTxt={input}
                  setSearchTxt={setInput}
                  width={10}
                />
              </div>
              <div className="col-md-4 col-4 mt-2 d-flex justify-content-end">
                <Link
                  className={`btn btn-lg ${
                    theme == "dark" ? "btn-outline-light" : "btn-outline-dark"
                  } rounded-pill`}
                  style={{ fontWeight: "bolder" }}
                  to="/control/user/create"
                >
                  +
                </Link>
              </div>
            </div>
            <hr />
          </div>
          {/* Users Table  */}
          <div className="container">
            <h3 className="text-center mb-2">إضغط على المستخدم للتعديل</h3>
            <div className="card mt-2">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className={
                        theme == "dark"
                          ? "text-warning"
                          : "text-light bg-primary"
                      }
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className={
                        theme == "dark"
                          ? "text-warning"
                          : "text-light bg-primary"
                      }
                    >
                      إسم المستخدم
                    </th>
                    <th
                      scope="col"
                      className={
                        theme == "dark"
                          ? "text-warning"
                          : "text-light bg-primary"
                      }
                    >
                      تاريخ الإنشاء
                    </th>
                    <th
                      scope="col"
                      className={
                        theme == "dark"
                          ? "text-warning"
                          : "text-light bg-primary"
                      }
                    >
                      رصيد المستخدم
                    </th>
                    <th
                      scope="col"
                      className={
                        theme == "dark"
                          ? "text-warning"
                          : "text-light bg-primary"
                      }
                    >
                      Superuser
                    </th>
                    <th
                      scope="col"
                      className={
                        theme == "dark"
                          ? "text-warning"
                          : "text-light bg-primary"
                      }
                    >
                      Staff
                    </th>
                    <th
                      scope="col"
                      className={
                        theme == "dark"
                          ? "text-warning"
                          : "text-light bg-primary"
                      }
                    >
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map &&
                    users.map((user, index) => (
                      <tr onClick={() => editUser(user.id)} key={user.id}>
                        <th scope="row">{index + 1}</th>
                        <td className="text-nowrap">{user.username}</td>
                        <td>{dayjs(user.date_joined).format("YYYY/M/D")}</td>
                        <td
                          className={
                            user.profile.credit <= 0 ? `text-warning` : ``
                          }
                        >
                          {user.profile.credit.toLocaleString()}
                        </td>
                        <td className="text-nowrap">
                          {user.is_superuser && <FaCheck size={20} />}
                        </td>
                        <td className="text-nowrap">
                          {user.is_staff && <FaCheck size={20} />}
                        </td>
                        <td className="text-nowrap">
                          {user.is_active ? (
                            <FaCheck size={20} />
                          ) : (
                            <FaX size={20} className="text-danger" />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Users;
