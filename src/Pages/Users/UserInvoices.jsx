import { useEffect, useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import Spinner from "../../Components/Spinner";
import { FaFileInvoice } from "react-icons/fa6";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";

const UserInvoices = (props) => {
  let { userID, limited } = props;
  let { theme } = useTheme();
  const { id } = useParams();
  let [invoices, setInvoices] = useState([]);
  let [userData, setUserData] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  const apiURL = limited
    ? `userInvoiceItemLimit/${userID}/`
    : `userInvoiceItem/${userID || id}/`;

  let getUserInvoices = async () => {
    let response = await AxiosInstance(apiURL);
    setInvoices(response.data);
    setLoading(false);
  };

  let getUserData = async () => {
    let response = await AxiosInstance(`user/${id}`);
    setUserData(response.data);
  };

  let getInvoice = (id) => {
    navigate(`/invoice/preview/${id}`);
  };

  useEffect(() => {
    getUserInvoices();
    getUserData();
  }, []);

  return (
    <div className="container-fluid">
      {loading ? (
        <Spinner />
      ) : (
        <div className="row gutters ">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <h5
              className={`mb-3 ${
                theme == `dark` ? `text-info` : `text-navy`
              } text-center mt-2`}
            >
              الفواتير <FaFileInvoice size={25} />{" "}
              {!limited && ` | ` + userData.username + `@`}
            </h5>
          </div>
          <div className="container-fluid">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={
                      theme == `dark` ? `text-warning` : `text-light bg-primary`
                    }
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className={
                      theme == `dark` ? `text-warning` : `text-light bg-primary`
                    }
                  >
                    رقم
                  </th>
                  <th
                    scope="col"
                    className={
                      theme == `dark` ? `text-warning` : `text-light bg-primary`
                    }
                  >
                    نوع الفاتورة
                  </th>
                  <th
                    scope="col"
                    className={
                      theme == `dark` ? `text-warning` : `text-light bg-primary`
                    }
                  >
                    توقيت الفاتورة
                  </th>
                  <th
                    scope="col"
                    className={
                      theme == `dark` ? `text-warning` : `text-light bg-primary`
                    }
                  >
                    قيمة الفاتورة
                  </th>
                  <th
                    scope="col"
                    className={
                      theme == `dark` ? `text-warning` : `text-light bg-primary`
                    }
                  >
                    لحساب
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr onClick={() => getInvoice(invoice.id)} key={invoice.id}>
                    <th scope="row">{index + 1}</th>
                    <th scope="row">{invoice.invoice_no}</th>
                    <td className="text-nowrap">{invoice.type}</td>
                    <td className="text-nowrap">
                      {dayjs(invoice.invoice_time).format("YYYY/MM/DD h:mma")}
                    </td>
                    <td className="text-nowrap">
                      EGP {invoice.total.toLocaleString()}
                    </td>
                    <td className="text-nowrap">{invoice.account}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!limited && (
            <div className="d-flex justify-content-center">
              <Link
                className="btn btn-outline-light"
                onClick={() => navigate(-1)}
              >
                عودة ...
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
