import { useContext, useEffect, useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import Spinner from "../../Components/Spinner";
import {
  FaArrowLeft,
  FaCircleArrowLeft,
  FaCircleArrowRight,
  FaRepeat,
  FaScroll,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import SearchBox from "../../Components/SearchBox";
import UseDebounce from "../../hooks/UseDebounce";
import AuthContext from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeProvider";

const Invoices = (props) => {
  const { theme } = useTheme();
  let { limited, byAccount, accountID } = props;
  let { user } = useContext(AuthContext);
  let [invoices, setInvoices] = useState([]);
  let [loading, setLoading] = useState(true);
  let [input, setInput] = useState([]);
  const debounce = UseDebounce(input, 800);

  const apiURL = limited
    ? "recentInvoices/"
    : byAccount
    ? `accountInvoiceItem/${accountID}`
    : `invoice/?invoice_no=${input}`;

  let getInvoices = async () => {
    let response = await AxiosInstance.get(apiURL);
    setInvoices(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getInvoices();
  }, [debounce]);

  return (
    <div className="container mt-2">
      {!limited && (
        <div className="row">
          <div className="col-md-8 col-6">
            <SearchBox searchTxt={input} setSearchTxt={setInput} width={12} />
          </div>
          <div className="col-md-4 col-2 d-flex justify-content-end">
            <div className="">
              <Link
                to={-1}
                className={`btn mt-2 ${
                  theme == "dark" ? "btn-outline-light" : "btn-outline-dark"
                }`}
              >
                <FaArrowLeft />
              </Link>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <div className="list-group w-auto my-2">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              to={`/invoice/preview/${invoice.id}/`}
              className="list-group-item list-group-item-action d-flex gap-3 py-3"
              aria-current="true"
            >
              {invoice.type == `بيع` ? (
                <FaCircleArrowRight size={40} />
              ) : invoice.type == `شراء` ? (
                <FaCircleArrowLeft size={40} />
              ) : (
                <FaRepeat size={40} />
              )}
              <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 className="mb-0">
                    فاتورة {invoice.type} ({invoice.total.toLocaleString()}{" "}
                    ج.م.)
                  </h6>
                  <p className="mb-0 opacity-75">
                    # {invoice.invoice_no}
                    {/* {JSON.stringify(
                      invoice.items.map(
                        (itm, i) =>
                          invoice.invoice_items[i].qty + ` ` + itm.name + ` | `
                      )
                    )
                      .replace(/]|[[]|"|,/g, "")
                      .slice(0, 50) + `...`} */}
                  </p>
                </div>
                <small className="opacity-50 text-nowrap">
                  {invoice.invoice_by} | {dayjs(invoice.invoice_time).fromNow()}
                </small>
              </div>
            </Link>
          ))}
          <br className="mt-2" />
          {limited && (user.is_superadmin || user.is_staff) && (
            <Link
              to={`/invoice/invoices`}
              className="list-group-item list-group-item-action d-flex gap-3 py-3 justify-content-center"
            >
              المزيد ... <FaScroll size={20} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoices;
